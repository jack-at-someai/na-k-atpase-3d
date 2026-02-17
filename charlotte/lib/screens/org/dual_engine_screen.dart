import 'package:flutter/material.dart';
import '../../theme.dart';

class DualEngineScreen extends StatelessWidget {
  const DualEngineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('The Dual Engine', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'Charlotte OS is the shared substrate.\nTwo engines drive it.',
            style: TextStyle(fontSize: 16, color: config.textSecondary, height: 1.5),
          ),
          const SizedBox(height: 32),
          _EngineCard(
            name: 'SomeAI',
            type: 'CONVERGENT',
            description: 'The engineering company. Ships Charlotte OS to clients. Builds domain-specific implementations. Revenue-generating. Client-facing. Consumes industries one at a time.',
            items: const ['Ships product', 'Serves clients', 'Generates revenue', 'Builds domains'],
            color: config.primary.base,
            config: config,
          ),
          const SizedBox(height: 16),
          Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: config.surfaceVariant,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                'Charlotte OS',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: config.textPrimary),
              ),
            ),
          ),
          const SizedBox(height: 16),
          _EngineCard(
            name: 'SumAI',
            type: 'DIVERGENT',
            description: 'The research arm. OASIS framework. Five senses plus brain. Hex campus vision. Pushes boundaries of perception and reasoning.',
            items: const ['Discovers capabilities', 'Publishes research', 'Explores frontiers', 'Feeds product'],
            color: config.tertiary.base,
            config: config,
          ),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.surface,
              borderRadius: BorderRadius.circular(config.radiusMedium),
            ),
            child: Text(
              'SumAI discovers capabilities, SomeAI ships them. '
              'Clients fund SumAI through SomeAI contracts. '
              'The research makes the product better. The product funds the research.',
              style: TextStyle(fontSize: 14, color: config.textSecondary, height: 1.6, fontStyle: FontStyle.italic),
            ),
          ),
        ],
      ),
    );
  }
}

class _EngineCard extends StatelessWidget {
  final String name;
  final String type;
  final String description;
  final List<String> items;
  final Color color;
  final CharlotteThemeConfig config;

  const _EngineCard({
    required this.name,
    required this.type,
    required this.description,
    required this.items,
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
          Row(
            children: [
              Text(name, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: color)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(type, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: color, letterSpacing: 1)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(description, style: TextStyle(fontSize: 14, color: config.textSecondary, height: 1.5)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: items.map((item) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: config.surfaceVariant,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(item, style: TextStyle(fontSize: 12, color: config.textPrimary)),
            )).toList(),
          ),
        ],
      ),
    );
  }
}
