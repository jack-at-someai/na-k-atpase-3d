import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/card_item.dart';
import '../theme/cardvault_colors.dart';

class CardGridTile extends StatelessWidget {
  final CardItem card;
  final VoidCallback? onTap;
  final bool showEditBadge;

  const CardGridTile({
    super.key,
    required this.card,
    this.onTap,
    this.showEditBadge = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFmt = NumberFormat.currency(symbol: '\$');

    return GlassCard(
      padding: EdgeInsets.zero,
      accentColor: CardVaultColors.gold500,
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Card image placeholder
          Expanded(
            flex: 3,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    CardVaultColors.vault600,
                    CardVaultColors.vault800,
                  ],
                ),
                borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12)),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Icon(
                      _categoryIcon(card.category),
                      size: 40,
                      color: CardVaultColors.gold500.withValues(alpha: 0.3),
                    ),
                  ),
                  // Condition badge
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: _conditionColor(card.condition)
                            .withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        card.gradeDisplay,
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),
                  if (showEditBadge)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: CardVaultColors.gold500.withValues(alpha: 0.9),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Icon(Icons.edit,
                            size: 12, color: Colors.white),
                      ),
                    ),
                ],
              ),
            ),
          ),
          // Card info
          Expanded(
            flex: 2,
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    card.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: CardVaultColors.text,
                      fontWeight: FontWeight.w600,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 2),
                  if (card.set.isNotEmpty)
                    Text(
                      card.set,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: CardVaultColors.dim,
                        fontSize: 10,
                      ),
                    ),
                  const Spacer(),
                  Row(
                    children: [
                      Text(
                        currencyFmt.format(card.price),
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: CardVaultColors.gold500,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const Spacer(),
                      if (card.rarity != null)
                        Text(
                          card.rarity!,
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: CardVaultColors.dim,
                            fontSize: 9,
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _categoryIcon(CardCategory cat) => switch (cat) {
        CardCategory.sports => Icons.sports_football,
        CardCategory.pokemon => Icons.catching_pokemon,
        CardCategory.yugioh => Icons.style,
        CardCategory.magic => Icons.auto_awesome,
        CardCategory.onePiece => Icons.sailing,
        CardCategory.entertainment => Icons.movie,
        CardCategory.memorabilia => Icons.emoji_events,
      };

  Color _conditionColor(CardCondition c) => switch (c) {
        CardCondition.gem => CardVaultColors.gradeGem,
        CardCondition.mint => CardVaultColors.gradeMint,
        CardCondition.nearMint => CardVaultColors.gradeNear,
        CardCondition.excellent => CardVaultColors.gradeExcellent,
        CardCondition.good => CardVaultColors.gradeGood,
        CardCondition.poor => CardVaultColors.gradePoor,
      };
}
