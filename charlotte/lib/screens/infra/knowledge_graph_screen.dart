import 'package:flutter/material.dart';
import '../../theme.dart';

class KnowledgeGraphScreen extends StatelessWidget {
  const KnowledgeGraphScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Knowledge Graph', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'The Ontological Layer',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: config.textPrimary),
          ),
          const SizedBox(height: 8),
          Text(
            'NODE + EDGE. What exists. Shared truth. Graph-traversable.',
            style: TextStyle(fontSize: 15, color: config.primary.base, height: 1.5),
          ),
          const SizedBox(height: 24),

          // Stats
          _StatRow(label: 'KRF Files', value: '31', config: config),
          _StatRow(label: 'Microtheories', value: '28+', config: config),
          _StatRow(label: 'Predicates', value: '70+', config: config),
          _StatRow(label: 'Validation Domains', value: '10', config: config),
          const SizedBox(height: 24),

          // Graph operations
          Text('GRAPH OPERATIONS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.textTertiary)),
          const SizedBox(height: 8),
          _OpCard(name: 'BFS / DFS', description: 'Breadth-first and depth-first traversal across NODE-EDGE pairs', config: config),
          _OpCard(name: 'Shortest Path', description: 'Minimum-hop path between any two NODEs in the graph', config: config),
          _OpCard(name: 'Centrality', description: 'Identify high-connectivity NODEs — hubs in the knowledge graph', config: config),
          _OpCard(name: 'Connected Components', description: 'Find isolated subgraphs — islands of knowledge', config: config),
          _OpCard(name: 'k-Hop Neighborhood', description: 'All NODEs within k edges of a target — local context', config: config),
          const SizedBox(height: 24),

          // Domain instances
          Text('DOMAIN INSTANCES', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.textTertiary)),
          const SizedBox(height: 8),
          _DomainTile(name: 'ISG', facts: '12,773 lines', detail: '1,199 entries — products, services, competitors', color: config.primary.base, config: config),
          _DomainTile(name: 'Sounder', facts: '401K facts', detail: 'Pedigrees, breeding records, farm operations', color: config.primary.base, config: config),
          _DomainTile(name: 'Charlotte OS', facts: '31 KRF files', detail: 'Kernel, knowledge, spine, reference, agent', color: config.tertiary.base, config: config),

          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.surface,
              borderRadius: BorderRadius.circular(config.radiusMedium),
            ),
            child: Text(
              'The graph IS the industry. Each client that embeds Charlotte adds their domain to the ontological layer. '
              'ISG adds industrial equipment. Sounder adds livestock genetics. '
              'The graph grows. The territory expands. Charlotte remembers everything.',
              style: TextStyle(fontSize: 13, color: config.textSecondary, height: 1.6, fontStyle: FontStyle.italic),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  final String label;
  final String value;
  final CharlotteThemeConfig config;
  const _StatRow({required this.label, required this.value, required this.config});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          SizedBox(width: 140, child: Text(label, style: TextStyle(fontSize: 13, color: config.textTertiary))),
          Text(value, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: config.textPrimary)),
        ],
      ),
    );
  }
}

class _OpCard extends StatelessWidget {
  final String name;
  final String description;
  final CharlotteThemeConfig config;
  const _OpCard({required this.name, required this.description, required this.config});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: config.surface,
        borderRadius: BorderRadius.circular(config.radiusMedium),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 130,
            child: Text(name, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: config.primary.base, fontFamily: 'monospace')),
          ),
          Expanded(child: Text(description, style: TextStyle(fontSize: 12, color: config.textSecondary))),
        ],
      ),
    );
  }
}

class _DomainTile extends StatelessWidget {
  final String name;
  final String facts;
  final String detail;
  final Color color;
  final CharlotteThemeConfig config;
  const _DomainTile({required this.name, required this.facts, required this.detail, required this.color, required this.config});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(config.radiusMedium),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: config.textPrimary)),
                const SizedBox(height: 2),
                Text(detail, style: TextStyle(fontSize: 12, color: config.textTertiary)),
              ],
            ),
          ),
          Text(facts, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: color)),
        ],
      ),
    );
  }
}
