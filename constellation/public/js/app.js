/**
 * Constellation App — Orchestrator
 * Wires together graph, voice, and query engine
 */
(async function() {
  // --- Load knowledge graph ---
  const response = await fetch('/data/knowledge-graph.json');
  const graphData = await response.json();

  // --- Init 3D graph ---
  const container = document.getElementById('graph-container');
  const graph = new ConstellationGraph(container);
  graph.loadGraph(graphData);

  // --- Build cluster legend ---
  const legend = document.getElementById('cluster-legend');
  Object.entries(graphData.clusters).forEach(([key, cluster]) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-dot" style="background:${cluster.color}"></span>${cluster.label}`;
    item.addEventListener('click', () => {
      const isDimmed = graph.toggleCluster(key);
      item.classList.toggle('dimmed', isDimmed);
    });
    legend.appendChild(item);
  });

  // --- Node info panel ---
  const nodeInfo = document.getElementById('node-info');
  const nodeInfoClose = document.getElementById('node-info-close');

  graph.onNodeSelect = (node) => {
    nodeInfo.classList.remove('hidden');

    document.getElementById('node-info-type').textContent = node.type;
    document.getElementById('node-info-label').textContent = node.label;

    const clusterData = graphData.clusters[node.cluster];
    document.getElementById('node-info-cluster').textContent =
      clusterData ? `${clusterData.label} — ${clusterData.description}` : node.cluster;

    // Properties
    const propsEl = document.getElementById('node-info-properties');
    propsEl.innerHTML = '';
    if (node.properties) {
      Object.entries(node.properties).forEach(([key, value]) => {
        const div = document.createElement('div');
        const displayValue = Array.isArray(value) ? value.join(', ') :
          typeof value === 'object' ? JSON.stringify(value) : String(value);
        div.innerHTML = `<span class="prop-key">${key}:</span> <span class="prop-value">${displayValue}</span>`;
        propsEl.appendChild(div);
      });
    }

    // Connections
    const connEl = document.getElementById('node-info-connections');
    connEl.innerHTML = '<div class="connection-header">Connections</div>';
    const neighbors = graph.getNeighbors(node.id);
    neighbors.forEach(n => {
      const neighborNode = graph.nodeMap[n.id];
      if (!neighborNode) return;
      const item = document.createElement('div');
      item.className = 'connection-item';
      item.innerHTML = `
        <span style="color:${neighborNode.color}">${neighborNode.label}</span>
        <span class="connection-label">${n.label}</span>
      `;
      item.addEventListener('click', () => graph.selectNode(n.id));
      connEl.appendChild(item);
    });

    // Sources
    const srcEl = document.getElementById('node-info-sources');
    if (node.sources && node.sources.length > 0) {
      srcEl.innerHTML = 'sources: ' + node.sources.map(s => s.split('/').pop()).join(', ');
    } else {
      srcEl.innerHTML = 'sources: manifest/context';
    }
  };

  nodeInfoClose.addEventListener('click', () => {
    nodeInfo.classList.add('hidden');
    graph.deselectNode();
  });

  // --- Voice interface ---
  const voice = new VoiceInterface();
  const micBtn = document.getElementById('mic-btn');
  const voiceStatus = document.getElementById('voice-status');
  const clearBtn = document.getElementById('clear-btn');
  const transcriptHistory = document.getElementById('transcript-history');
  const traversalOverlay = document.getElementById('traversal-overlay');
  const traversalPath = document.getElementById('traversal-path');

  voice.onStateChange = (state) => {
    micBtn.classList.toggle('listening', state === 'listening');
    if (state === 'listening') {
      voiceStatus.textContent = 'Listening...';
      graph.controls.autoRotate = false;
    } else if (state === 'speaking') {
      voiceStatus.textContent = 'Speaking...';
    } else {
      voiceStatus.textContent = 'Press space or click mic to speak';
    }
  };

  voice.onInterim = (text) => {
    voiceStatus.textContent = text;
  };

  voice.onResult = async (text) => {
    // Add user message to transcript
    addTranscriptEntry('user', text);
    voiceStatus.textContent = 'Thinking...';

    // Query the brain
    try {
      const result = await queryBrain(text, graphData);

      // Animate traversal
      if (result.traversedNodes && result.traversedNodes.length > 0) {
        traversalOverlay.classList.remove('hidden');
        traversalPath.textContent = result.traversedNodes.map(id => {
          const node = graph.nodeMap[id];
          return node ? node.label : id;
        }).join(' → ');

        await graph.animateTraversal(result.traversedNodes, 500);

        setTimeout(() => traversalOverlay.classList.add('hidden'), 2000);
      }

      // Add assistant response
      addTranscriptEntry('assistant', result.response, result.traversedNodes);

      // Speak the response
      voice.speak(result.response);

    } catch (err) {
      addTranscriptEntry('assistant', 'Error: ' + err.message);
      voiceStatus.textContent = 'Error — try again';
    }
  };

  // Mic button
  micBtn.addEventListener('mousedown', () => voice.startListening());
  micBtn.addEventListener('mouseup', () => voice.stopListening());
  micBtn.addEventListener('touchstart', (e) => { e.preventDefault(); voice.startListening(); });
  micBtn.addEventListener('touchend', (e) => { e.preventDefault(); voice.stopListening(); });

  // Spacebar hold-to-talk
  let spaceHeld = false;
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spaceHeld && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      spaceHeld = true;
      voice.startListening();
    }
    if (e.code === 'Escape') {
      nodeInfo.classList.add('hidden');
      graph.deselectNode();
      graph.resetTraversal();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && spaceHeld) {
      e.preventDefault();
      spaceHeld = false;
      voice.stopListening();
    }
  });

  // Clear button
  clearBtn.addEventListener('click', () => {
    transcriptHistory.innerHTML = '';
    graph.resetTraversal();
    graph.controls.autoRotate = true;
  });

  function addTranscriptEntry(role, text, traversedNodes) {
    const entry = document.createElement('div');
    entry.className = `transcript-entry ${role}`;

    let html = `<div class="role">${role === 'user' ? 'You' : 'Brain'}</div>`;
    html += `<div class="text">${text}</div>`;

    if (traversedNodes && traversedNodes.length > 0) {
      html += '<div class="traversed-nodes">traversed: ';
      html += traversedNodes.map(id => {
        const node = graph.nodeMap[id];
        const label = node ? node.label : id;
        return `<span class="traversed-node-tag" data-node="${id}">${label}</span>`;
      }).join(' ');
      html += '</div>';
    }

    entry.innerHTML = html;
    transcriptHistory.appendChild(entry);

    // Make traversed node tags clickable
    entry.querySelectorAll('.traversed-node-tag').forEach(tag => {
      tag.addEventListener('click', () => graph.selectNode(tag.dataset.node));
    });

    // Scroll to bottom
    const container = document.getElementById('transcript-container');
    container.scrollTop = container.scrollHeight;
  }

  // --- Query engine ---
  async function queryBrain(userQuery, graphData) {
    // Step 1: Find relevant nodes by keyword matching
    const keywords = extractKeywords(userQuery);
    const relevantNodeIds = graph.querySubgraph(keywords);

    // Build context from relevant nodes
    const context = buildGraphContext(relevantNodeIds, graphData);

    // Step 2: Send to server (Claude API proxy)
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          context: context,
          relevantNodeIds: relevantNodeIds
        })
      });

      if (!res.ok) {
        // Fallback to local inference if server is down
        return localInference(userQuery, relevantNodeIds, graphData);
      }

      return await res.json();
    } catch (e) {
      // Server not running — fall back to local graph traversal
      return localInference(userQuery, relevantNodeIds, graphData);
    }
  }

  function extractKeywords(query) {
    const stopWords = new Set(['what', 'who', 'where', 'when', 'why', 'how', 'is', 'are', 'was', 'were',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'about', 'tell', 'me', 'show', 'can', 'you', 'do', 'does', 'did', 'this', 'that', 'it',
      'from', 'has', 'have', 'had', 'be', 'been', 'being', 'will', 'would', 'could', 'should']);

    return query.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }

  function buildGraphContext(nodeIds, graphData) {
    const nodes = nodeIds.map(id => graphData.nodes.find(n => n.id === id)).filter(Boolean);
    const edges = graphData.edges.filter(e => nodeIds.includes(e.source) || nodeIds.includes(e.target));

    let context = 'KNOWLEDGE GRAPH CONTEXT:\n\n';

    context += 'ENTITIES:\n';
    nodes.forEach(n => {
      context += `- ${n.label} [${n.type}] (cluster: ${n.cluster})`;
      if (n.properties) {
        const props = Object.entries(n.properties)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('; ');
        context += ` — ${props}`;
      }
      context += '\n';
    });

    context += '\nRELATIONSHIPS:\n';
    edges.forEach(e => {
      const src = graphData.nodes.find(n => n.id === e.source);
      const tgt = graphData.nodes.find(n => n.id === e.target);
      if (src && tgt) {
        context += `- ${src.label} —[${e.label}]→ ${tgt.label}\n`;
      }
    });

    return context;
  }

  // Local fallback when server isn't running — pure graph traversal
  function localInference(query, relevantNodeIds, graphData) {
    const keywords = extractKeywords(query);
    const nodes = relevantNodeIds.map(id => graphData.nodes.find(n => n.id === id)).filter(Boolean);

    if (nodes.length === 0) {
      return {
        response: "I couldn't find any nodes matching that query. Try asking about specific people, places, companies, or concepts in the knowledge graph.",
        traversedNodes: []
      };
    }

    // Build a response from the matched nodes
    let response = '';

    // Check if asking about a specific entity
    const exactMatch = nodes.find(n => keywords.some(k => n.label.toLowerCase().includes(k)));

    if (exactMatch) {
      response = `${exactMatch.label} is a ${exactMatch.type} in the ${exactMatch.cluster} cluster.`;

      if (exactMatch.properties) {
        const importantProps = Object.entries(exactMatch.properties)
          .slice(0, 3)
          .map(([k, v]) => {
            const val = Array.isArray(v) ? v.join(', ') : v;
            return `${k}: ${val}`;
          });
        if (importantProps.length) {
          response += ' ' + importantProps.join('. ') + '.';
        }
      }

      // Add connections
      const neighbors = graph.getNeighbors(exactMatch.id);
      if (neighbors.length > 0) {
        const connTexts = neighbors.slice(0, 4).map(n => {
          const nn = graphData.nodes.find(node => node.id === n.id);
          return nn ? `${nn.label} (${n.label})` : n.id;
        });
        response += ` Connected to: ${connTexts.join(', ')}.`;
      }
    } else {
      response = `Found ${nodes.length} related nodes: ${nodes.slice(0, 5).map(n => n.label).join(', ')}.`;
      if (nodes.length > 5) response += ` And ${nodes.length - 5} more.`;
    }

    // Determine traversal path
    const traversedNodes = [];
    if (exactMatch) {
      traversedNodes.push(exactMatch.id);
      const neighbors = graph.getNeighbors(exactMatch.id);
      neighbors.slice(0, 4).forEach(n => traversedNodes.push(n.id));
    } else {
      nodes.slice(0, 6).forEach(n => traversedNodes.push(n.id));
    }

    return { response, traversedNodes };
  }

  // --- Initial state ---
  if (!voice.isSupported) {
    voiceStatus.textContent = 'Voice not supported — use Chrome';
    micBtn.disabled = true;
  }

  // Load voices
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
})();
