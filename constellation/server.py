#!/usr/bin/env python3
"""
Constellation — Journey Brain Server
Python HTTP server serving 3D graph visualization + Claude API proxy
"""

import os
import sys
import json
import http.server
import socketserver
import urllib.request
import urllib.error
from pathlib import Path

PORT = int(os.environ.get('PORT', 3333))
PUBLIC_DIR = Path(__file__).parent / 'public'
GRAPH_PATH = PUBLIC_DIR / 'data' / 'knowledge-graph.json'

# Load knowledge graph
with open(GRAPH_PATH) as f:
    KNOWLEDGE_GRAPH = json.load(f)


class ConstellationHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files + handles /api/query for Claude proxy."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_POST(self):
        if self.path == '/api/query':
            self._handle_query()
        else:
            self.send_error(404)

    def _handle_query(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = json.loads(body)

        query = data.get('query', '')
        context = data.get('context', '')
        relevant_node_ids = data.get('relevantNodeIds', [])

        api_key = os.environ.get('ANTHROPIC_API_KEY', '')

        if api_key:
            result = self._claude_query(query, context, relevant_node_ids, api_key)
        else:
            result = self._local_inference(query, relevant_node_ids)

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def _claude_query(self, query, context, relevant_node_ids, api_key):
        system_prompt = (
            'You are the voice of a personal knowledge graph called "Constellation" — '
            "the neural brain of Jack Richard's journey. You have access to the knowledge "
            "graph context below. When answering:\n\n"
            "1. Speak naturally but concisely (2-4 sentences max for voice output)\n"
            "2. Reference specific nodes and relationships from the graph\n"
            "3. Draw connections between seemingly unrelated nodes when insightful\n"
            "4. Return which node IDs you traversed to form your answer\n\n"
            "The knowledge graph spans Jack's journey from Lake Forest through LineLeap "
            "(human behavior), Sounder/Trogdon (biological systems), ISG (mechanical systems), "
            "Prier Violins (cultural artifacts), converging into Charlotte — a universal "
            "substrate for observable reality.\n\n"
            'Respond with JSON: {"response": "your spoken answer", "traversedNodes": ["node-id-1", "node-id-2"]}'
        )

        payload = json.dumps({
            "model": "claude-sonnet-4-5-20250929",
            "max_tokens": 500,
            "system": system_prompt,
            "messages": [{
                "role": "user",
                "content": f"{context}\n\nQUESTION: {query}"
            }]
        }).encode()

        req = urllib.request.Request(
            'https://api.anthropic.com/v1/messages',
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01'
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
                text = data['content'][0]['text']

                # Try parsing as JSON
                try:
                    import re
                    json_match = re.search(r'\{[\s\S]*\}', text)
                    if json_match:
                        parsed = json.loads(json_match.group())
                        return {
                            'response': parsed.get('response', text),
                            'traversedNodes': parsed.get('traversedNodes', relevant_node_ids)
                        }
                except (json.JSONDecodeError, AttributeError):
                    pass

                return {'response': text, 'traversedNodes': relevant_node_ids}

        except (urllib.error.URLError, urllib.error.HTTPError) as e:
            print(f"Claude API error: {e}")
            return self._local_inference(query, relevant_node_ids)

    def _local_inference(self, query, relevant_node_ids):
        import re as _re
        stop_words = {'what', 'who', 'where', 'when', 'why', 'how', 'is', 'are', 'was',
                      'were', 'the', 'and', 'or', 'but', 'for', 'with', 'about', 'tell',
                      'me', 'show', 'can', 'you', 'do', 'does', 'did', 'this', 'that',
                      'from', 'has', 'have', 'had', 'will', 'would', 'could', 'should'}
        words = _re.findall(r'[a-zA-Z]+', query.lower())
        keywords = [w for w in words if len(w) > 2 and w not in stop_words]
        scored = []

        for node in KNOWLEDGE_GRAPH['nodes']:
            label_lower = node.get('label', '').lower()
            text = ' '.join([
                label_lower,
                node.get('type', ''),
                node.get('cluster', ''),
                json.dumps(node.get('properties', {}))
            ]).lower()

            score = 0
            for k in keywords:
                if k in label_lower:
                    score += 10  # Label match is worth much more
                elif k in text:
                    score += 1

            if score > 0:
                scored.append((score, node))

        scored.sort(key=lambda x: x[0], reverse=True)
        matched = [s[1] for s in scored]

        if not matched:
            return {
                'response': "I don't have information about that in the knowledge graph yet. "
                           "Try asking about people, ventures, philosophy, or the convex hull journey.",
                'traversedNodes': []
            }

        primary = matched[0]
        props = primary.get('properties', {})
        desc = props.get('description', props.get('domain', props.get('role', '')))
        response = f"{primary['label']} is a {primary['type']}"
        if desc:
            response += f" — {desc}"
        response += '.'

        # Connections
        edges = [e for e in KNOWLEDGE_GRAPH['edges']
                 if e['source'] == primary['id'] or e['target'] == primary['id']]
        conn_texts = []
        for e in edges[:3]:
            other_id = e['target'] if e['source'] == primary['id'] else e['source']
            other = next((n for n in KNOWLEDGE_GRAPH['nodes'] if n['id'] == other_id), None)
            if other:
                conn_texts.append(f"{other['label']} ({e['label']})")

        if conn_texts:
            response += f" Connected to {', '.join(conn_texts)}."

        traversed = [primary['id']]
        for e in edges[:4]:
            other_id = e['target'] if e['source'] == primary['id'] else e['source']
            traversed.append(other_id)

        return {'response': response, 'traversedNodes': traversed}

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        # Quiet logging — only show API calls
        if '/api/' in str(args[0]) if args else False:
            super().log_message(format, *args)


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    print(f"\n  CONSTELLATION - Journey Brain")
    print(f"  {'=' * 30}")
    print(f"  http://localhost:{PORT}")
    print(f"  {len(KNOWLEDGE_GRAPH['nodes'])} nodes, {len(KNOWLEDGE_GRAPH['edges'])} edges")
    api_status = 'connected' if os.environ.get('ANTHROPIC_API_KEY') else 'no key (local inference)'
    print(f"  Claude API: {api_status}")
    print(f"  Voice: hold Space or click mic\n")

    with ReusableTCPServer(("", PORT), ConstellationHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down.")
            httpd.shutdown()


if __name__ == '__main__':
    main()
