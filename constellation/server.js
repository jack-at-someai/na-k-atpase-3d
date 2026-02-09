const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Load knowledge graph
let knowledgeGraph;
try {
  knowledgeGraph = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'public', 'data', 'knowledge-graph.json'), 'utf8'
  ));
  console.log(`Knowledge graph loaded: ${knowledgeGraph.nodes.length} nodes, ${knowledgeGraph.edges.length} edges`);
} catch (e) {
  console.error('Failed to load knowledge graph:', e.message);
  process.exit(1);
}

// Claude API proxy
app.post('/api/query', async (req, res) => {
  const { query, context, relevantNodeIds } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // No API key — return a local inference response
    return res.json(localInference(query, relevantNodeIds || []));
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 500,
        system: `You are the voice of a personal knowledge graph called "Constellation" — the neural brain of Jack Richard's journey. You have access to the knowledge graph context below. When answering:

1. Speak naturally but concisely (2-4 sentences max for voice output)
2. Reference specific nodes and relationships from the graph
3. Draw connections between seemingly unrelated nodes when insightful
4. Return which node IDs you traversed to form your answer

The knowledge graph spans Jack's journey from Lake Forest through LineLeap (human behavior), Sounder/Trogdon (biological systems), ISG (mechanical systems), Prier Violins (cultural artifacts), converging into Charlotte — a universal substrate for observable reality.

Respond with JSON: {"response": "your spoken answer", "traversedNodes": ["node-id-1", "node-id-2"]}`,
        messages: [{
          role: 'user',
          content: `${context}\n\nQUESTION: ${query}`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude API error:', err);
      return res.json(localInference(query, relevantNodeIds || []));
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Parse the JSON response
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({
          response: parsed.response || text,
          traversedNodes: parsed.traversedNodes || relevantNodeIds || []
        });
      }
    } catch (parseErr) {
      // Not JSON — use raw text
    }

    return res.json({
      response: text,
      traversedNodes: relevantNodeIds || []
    });

  } catch (err) {
    console.error('Query error:', err.message);
    return res.json(localInference(query, relevantNodeIds || []));
  }
});

// Local inference fallback
function localInference(query, relevantNodeIds) {
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const matchedNodes = knowledgeGraph.nodes.filter(node => {
    const text = [node.label, node.type, node.cluster, JSON.stringify(node.properties || {})]
      .join(' ').toLowerCase();
    return keywords.some(k => text.includes(k));
  });

  if (matchedNodes.length === 0) {
    return {
      response: "I don't have information about that in the knowledge graph yet. Try asking about people, ventures, philosophy, or the convex hull journey.",
      traversedNodes: []
    };
  }

  const primary = matchedNodes[0];
  let response = `${primary.label} is a ${primary.type}`;

  if (primary.properties) {
    const desc = primary.properties.description || primary.properties.domain || primary.properties.role;
    if (desc) response += ` — ${desc}`;
  }
  response += '.';

  // Find connections
  const connections = knowledgeGraph.edges
    .filter(e => e.source === primary.id || e.target === primary.id)
    .slice(0, 3)
    .map(e => {
      const otherId = e.source === primary.id ? e.target : e.source;
      const other = knowledgeGraph.nodes.find(n => n.id === otherId);
      return other ? `${other.label} (${e.label})` : null;
    })
    .filter(Boolean);

  if (connections.length) {
    response += ` Connected to ${connections.join(', ')}.`;
  }

  const traversedNodes = [primary.id];
  knowledgeGraph.edges
    .filter(e => e.source === primary.id || e.target === primary.id)
    .slice(0, 4)
    .forEach(e => {
      traversedNodes.push(e.source === primary.id ? e.target : e.source);
    });

  return { response, traversedNodes };
}

// Serve index for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  CONSTELLATION — Journey Brain`);
  console.log(`  ─────────────────────────────`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  ${knowledgeGraph.nodes.length} nodes, ${knowledgeGraph.edges.length} edges`);
  console.log(`  ${process.env.ANTHROPIC_API_KEY ? 'Claude API: connected' : 'Claude API: no key (using local inference)'}`);
  console.log(`  Voice: hold Space or click mic\n`);
});
