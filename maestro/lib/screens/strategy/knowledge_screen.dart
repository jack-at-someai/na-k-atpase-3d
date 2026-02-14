import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';

import '../../models/knowledge_base.dart';
import '../../theme/maestro_colors.dart';

class KnowledgeScreen extends StatefulWidget {
  final String strategyId;

  const KnowledgeScreen({super.key, required this.strategyId});

  @override
  State<KnowledgeScreen> createState() => _KnowledgeScreenState();
}

class _KnowledgeScreenState extends State<KnowledgeScreen> {
  String _query = '';

  List<KnowledgeCard> get _filtered {
    if (_query.isEmpty) return knowledgeCards;
    final q = _query.toLowerCase();
    return knowledgeCards.where((c) {
      return c.title.toLowerCase().contains(q) ||
          c.tag.toLowerCase().contains(q) ||
          c.description.toLowerCase().contains(q);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'KNOWLEDGE BASE',
            style: TextStyle(
              color: MaestroColors.accent,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),

          // Search
          GlassSearchField(
            hintText: 'Search concepts...',
            onChanged: (v) => setState(() => _query = v),
          ),
          const SizedBox(height: 16),

          // Cards grid
          LayoutBuilder(
            builder: (context, constraints) {
              final columns = constraints.maxWidth > 800 ? 3 : (constraints.maxWidth > 500 ? 2 : 1);
              final cardWidth = (constraints.maxWidth - 14 * (columns - 1)) / columns;

              return Wrap(
                spacing: 14,
                runSpacing: 14,
                children: _filtered.map((card) {
                  return SizedBox(
                    width: cardWidth,
                    child: _KnowledgeCardWidget(card: card),
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _KnowledgeCardWidget extends StatelessWidget {
  final KnowledgeCard card;

  const _KnowledgeCardWidget({required this.card});

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  card.title,
                  style: TextStyle(
                    color: MaestroColors.text,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: MaestroColors.accent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  card.tag,
                  style: TextStyle(
                    color: MaestroColors.accent,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            card.description,
            style: TextStyle(color: MaestroColors.mauveLt, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
