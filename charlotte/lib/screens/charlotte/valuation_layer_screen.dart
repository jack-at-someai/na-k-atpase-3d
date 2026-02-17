import 'package:flutter/material.dart';
import '../../theme.dart';

class ValuationLayerScreen extends StatelessWidget {
  const ValuationLayerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('The Two-Layer Split', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Ontological Layer
          _LayerCard(
            title: 'ONTOLOGICAL LAYER',
            subtitle: '"What exists"',
            primitives: 'NODE + EDGE',
            properties: const [
              'Graph-traversable',
              'Objective / shared truth',
              'Standard graph operations (BFS, shortest path, centrality)',
            ],
            color: config.primary.base,
            config: config,
          ),
          const SizedBox(height: 16),

          // Arrow
          Center(
            child: Column(
              children: [
                Icon(Icons.arrow_downward, color: config.textTertiary, size: 28),
                Text(
                  'The graph is the territory.',
                  style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: config.textTertiary),
                ),
                Text(
                  'The pipeline is the map.',
                  style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: config.textTertiary),
                ),
                Icon(Icons.arrow_downward, color: config.textTertiary, size: 28),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Valuation Layer
          _LayerCard(
            title: 'VALUATION LAYER',
            subtitle: '"What it means"',
            primitives: 'METRIC \u2192 SIGNAL \u2192 PROTOCOL',
            properties: const [
              'Serial pipeline (NOT graph traversal)',
              'Observer-dependent / perspectival',
              'Signal processing, not graph search',
              'Every conclusion has a dive line',
            ],
            color: config.tertiary.base,
            config: config,
          ),
          const SizedBox(height: 32),

          // DXP Example
          Text(
            'WORKED EXAMPLE',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
              color: config.textTertiary,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '"DXP Enterprises has revenue \$1.8B"',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: config.textPrimary),
          ),
          const SizedBox(height: 16),
          _ExampleRow(label: 'NODE', value: 'DXPEnterprises', layer: 'Ontological', config: config),
          _ExampleRow(label: 'EDGE', value: '(competitorOf DXP ISG)', layer: 'Ontological', config: config),
          _ExampleRow(label: 'METRIC', value: 'annualRevenue = 1800', layer: 'Valuation', config: config),
          _ExampleRow(label: 'SIGNAL', value: 'revenueExceedsISGBy6x', layer: 'Valuation', config: config),
          _ExampleRow(label: 'PROTOCOL', value: 'avoidHeadToHeadInLargeAcct', layer: 'Valuation', config: config),
          const SizedBox(height: 32),

          // Dive Line
          Text(
            'THE DIVE LINE',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
              color: config.textTertiary,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.surface,
              borderRadius: BorderRadius.circular(config.radiusMedium),
              border: Border.all(color: config.primary.base.withValues(alpha: 0.2)),
            ),
            child: Text(
              'PROTOCOL fired \u2190 SIGNAL detected \u2190 METRIC crossed threshold \u2190 NODE exists\n\n'
              'The chain is unbroken. No confidence scores. No approximate reasoning. Just the line.',
              style: TextStyle(
                fontSize: 13,
                color: config.textSecondary,
                fontFamily: 'monospace',
                height: 1.6,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LayerCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String primitives;
  final List<String> properties;
  final Color color;
  final CharlotteThemeConfig config;

  const _LayerCard({
    required this.title,
    required this.subtitle,
    required this.primitives,
    required this.properties,
    required this.color,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(config.radiusLarge),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: color, letterSpacing: 1)),
          const SizedBox(height: 4),
          Text(subtitle, style: TextStyle(fontSize: 13, fontStyle: FontStyle.italic, color: config.textTertiary)),
          const SizedBox(height: 12),
          Text(primitives, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: config.textPrimary, fontFamily: 'monospace')),
          const SizedBox(height: 12),
          ...properties.map((p) => Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Row(
              children: [
                Icon(Icons.check, size: 14, color: color),
                const SizedBox(width: 8),
                Expanded(child: Text(p, style: TextStyle(fontSize: 13, color: config.textSecondary))),
              ],
            ),
          )),
        ],
      ),
    );
  }
}

class _ExampleRow extends StatelessWidget {
  final String label;
  final String value;
  final String layer;
  final CharlotteThemeConfig config;

  const _ExampleRow({
    required this.label,
    required this.value,
    required this.layer,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    final isOntological = layer == 'Ontological';
    final color = isOntological ? config.primary.base : config.tertiary.base;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: color, fontFamily: 'monospace'),
            ),
          ),
          Expanded(
            child: Text(value, style: TextStyle(fontSize: 13, color: config.textPrimary, fontFamily: 'monospace')),
          ),
        ],
      ),
    );
  }
}
