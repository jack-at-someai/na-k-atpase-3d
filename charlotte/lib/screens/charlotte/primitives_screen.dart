import 'package:flutter/material.dart';
import '../../theme.dart';

class PrimitivesScreen extends StatelessWidget {
  const PrimitivesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Five Primitives', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'The five irreducible primitives of Charlotte',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: config.textPrimary),
          ),
          const SizedBox(height: 8),
          Text(
            'Every piece of information in Charlotte is a FACT. FACTs divide into five mutually disjoint primitives.',
            style: TextStyle(fontSize: 14, color: config.textSecondary),
          ),
          const SizedBox(height: 24),
          _PrimitiveCard(
            name: 'NODE',
            layer: 'Ontological',
            knowledge: 'Declarative',
            description: 'Identity. Any uniquely identifiable entity in the graph. A person, machine, business, pig, violin, location.',
            color: config.primary.shade400,
            config: config,
          ),
          _PrimitiveCard(
            name: 'EDGE',
            layer: 'Ontological',
            knowledge: 'Structural',
            description: 'Relationship. A typed, directed connection between two NODEs. OWNS, PARENT_OF, LOCATED_AT, CAUSES.',
            color: config.primary.shade500,
            config: config,
          ),
          _PrimitiveCard(
            name: 'METRIC',
            layer: 'Valuation',
            knowledge: 'Heuristic',
            description: 'Measurement. A quantitative dimension attached to a NODE. Like features in a regression model.',
            color: config.tertiary.shade400,
            config: config,
          ),
          _PrimitiveCard(
            name: 'SIGNAL',
            layer: 'Valuation',
            knowledge: 'Heuristic',
            description: 'Observation. A timestamped value placed on a METRIC line. Immutable. Append-only.',
            color: config.tertiary.shade500,
            config: config,
          ),
          _PrimitiveCard(
            name: 'PROTOCOL',
            layer: 'Valuation',
            knowledge: 'Procedural',
            description: 'Rule. Business logic: when TRIGGER fires and CONDITION holds, execute ACTION. Deterministic. Traceable.',
            color: config.tertiary.shade600,
            config: config,
          ),
        ],
      ),
    );
  }
}

class _PrimitiveCard extends StatelessWidget {
  final String name;
  final String layer;
  final String knowledge;
  final String description;
  final Color color;
  final CharlotteThemeConfig config;

  const _PrimitiveCard({
    required this.name,
    required this.layer,
    required this.knowledge,
    required this.description,
    required this.color,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: config.surface,
        borderRadius: BorderRadius.circular(config.radiusMedium),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                name,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: color,
                  fontFamily: 'monospace',
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  layer,
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: color),
                ),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: config.surfaceVariant,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  knowledge,
                  style: TextStyle(fontSize: 10, color: config.textTertiary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            description,
            style: TextStyle(fontSize: 13, color: config.textSecondary, height: 1.5),
          ),
        ],
      ),
    );
  }
}
