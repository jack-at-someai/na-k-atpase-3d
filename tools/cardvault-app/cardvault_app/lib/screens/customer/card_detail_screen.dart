import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../models/card_item.dart';
import '../../providers/card_provider.dart';
import '../../providers/store_provider.dart';
import '../../theme/cardvault_colors.dart';

class CardDetailScreen extends ConsumerWidget {
  final String cardId;

  const CardDetailScreen({super.key, required this.cardId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final cardAsync = ref.watch(cardByIdProvider(cardId));
    final priceAsync = ref.watch(priceHistoryProvider(cardId));
    final currencyFmt = NumberFormat.currency(symbol: '\$');

    return Scaffold(
      backgroundColor: CardVaultColors.background,
      body: cardAsync.when(
        data: (card) {
          if (card == null) {
            return const Center(child: Text('Card not found'));
          }

          final storeAsync = ref.watch(storeByIdProvider(card.storeId));
          final storeName = storeAsync.valueOrNull?.displayName ?? '...';

          return CustomScrollView(
            slivers: [
              // App bar with back button
              SliverAppBar(
                backgroundColor: Colors.transparent,
                pinned: true,
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_ios,
                      color: CardVaultColors.text),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                title: Text(
                  card.name,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: CardVaultColors.gold500,
                    letterSpacing: 1,
                  ),
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Card image placeholder
                      GlassContainer(
                        padding: EdgeInsets.zero,
                        tint: CardVaultColors.gold500,
                        child: AspectRatio(
                          aspectRatio: 0.72,
                          child: card.imageUrl != null
                              ? Image.network(card.imageUrl!,
                                  fit: BoxFit.cover)
                              : Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        CardVaultColors.vault600,
                                        CardVaultColors.vault800,
                                      ],
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.style_outlined,
                                          size: 64,
                                          color: CardVaultColors.gold500
                                              .withValues(alpha: 0.4)),
                                      const SizedBox(height: 12),
                                      Text(
                                        card.categoryLabel,
                                        style: theme.textTheme.labelSmall
                                            ?.copyWith(
                                          color: CardVaultColors.gold500
                                              .withValues(alpha: 0.6),
                                          letterSpacing: 2,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Card name + set
                      Text(
                        card.name,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          color: CardVaultColors.text,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if (card.playerName != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          card.playerName!,
                          style: theme.textTheme.bodyLarge?.copyWith(
                              color: CardVaultColors.gold500),
                        ),
                      ],
                      const SizedBox(height: 4),
                      Text(
                        '${card.set}${card.year != null ? ' (${card.year})' : ''}',
                        style: theme.textTheme.bodyMedium
                            ?.copyWith(color: CardVaultColors.dim),
                      ),
                      const SizedBox(height: 20),

                      // Price
                      GlassCard(
                        padding: const EdgeInsets.all(20),
                        accentColor: CardVaultColors.gold500,
                        child: Row(
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('PRICE',
                                    style: theme.textTheme.labelSmall?.copyWith(
                                      color: CardVaultColors.gold500,
                                      letterSpacing: 2,
                                    )),
                                const SizedBox(height: 4),
                                Text(
                                  currencyFmt.format(card.price),
                                  style:
                                      theme.textTheme.headlineMedium?.copyWith(
                                    color: CardVaultColors.text,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                            const Spacer(),
                            if (card.marketPrice != null)
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text('MARKET',
                                      style:
                                          theme.textTheme.labelSmall?.copyWith(
                                        color: CardVaultColors.dim,
                                        letterSpacing: 2,
                                      )),
                                  const SizedBox(height: 4),
                                  Text(
                                    currencyFmt.format(card.marketPrice),
                                    style: theme.textTheme.titleLarge?.copyWith(
                                      color: CardVaultColors.dim,
                                    ),
                                  ),
                                ],
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Details grid
                      GlassContainer(
                        padding: const EdgeInsets.all(20),
                        tint: CardVaultColors.gold500,
                        child: Column(
                          children: [
                            _detailRow(theme, 'Condition',
                                card.conditionLabel, _conditionColor(card.condition)),
                            const Divider(
                                color: CardVaultColors.glassBorder, height: 24),
                            _detailRow(
                                theme, 'Grade', card.gradeDisplay, null),
                            const Divider(
                                color: CardVaultColors.glassBorder, height: 24),
                            _detailRow(
                                theme, 'Category', card.categoryLabel, null),
                            const Divider(
                                color: CardVaultColors.glassBorder, height: 24),
                            _detailRow(theme, 'Rarity',
                                card.rarity ?? 'N/A', null),
                            const Divider(
                                color: CardVaultColors.glassBorder, height: 24),
                            _detailRow(theme, 'Quantity',
                                '${card.quantity}', null),
                            const Divider(
                                color: CardVaultColors.glassBorder, height: 24),
                            _detailRow(theme, 'Store', storeName, null),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Price history
                      priceAsync.when(
                        data: (history) {
                          if (history.entries.isEmpty) {
                            return const SizedBox.shrink();
                          }
                          return GlassContainer(
                            padding: const EdgeInsets.all(20),
                            tint: CardVaultColors.gold500,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('PRICE HISTORY',
                                    style:
                                        theme.textTheme.labelSmall?.copyWith(
                                      color: CardVaultColors.gold500,
                                      letterSpacing: 2,
                                    )),
                                const SizedBox(height: 12),
                                ...history.entries
                                    .reversed
                                    .take(10)
                                    .map((entry) => Padding(
                                          padding: const EdgeInsets.only(
                                              bottom: 8),
                                          child: Row(
                                            children: [
                                              Text(
                                                DateFormat('MMM d, yyyy')
                                                    .format(entry.timestamp),
                                                style: theme
                                                    .textTheme.bodySmall
                                                    ?.copyWith(
                                                        color: CardVaultColors
                                                            .dim),
                                              ),
                                              const Spacer(),
                                              Text(
                                                currencyFmt
                                                    .format(entry.price),
                                                style: theme
                                                    .textTheme.bodyMedium
                                                    ?.copyWith(
                                                  color: CardVaultColors.text,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              Container(
                                                padding: const EdgeInsets.symmetric(
                                                    horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: (entry.source == 'agent'
                                                          ? CardVaultColors.gold500
                                                          : CardVaultColors.silver500)
                                                      .withValues(alpha: 0.2),
                                                  borderRadius:
                                                      BorderRadius.circular(4),
                                                  border: Border.all(
                                                    color: entry.source == 'agent'
                                                        ? CardVaultColors.gold500
                                                        : CardVaultColors.silver500,
                                                    width: 0.5,
                                                  ),
                                                ),
                                                child: Text(
                                                  entry.source,
                                                  style: TextStyle(
                                                    fontSize: 9,
                                                    fontWeight: FontWeight.w600,
                                                    color: entry.source == 'agent'
                                                        ? CardVaultColors.gold500
                                                        : CardVaultColors.silver500,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        )),
                              ],
                            ),
                          );
                        },
                        loading: () => const SizedBox.shrink(),
                        error: (_, __) => const SizedBox.shrink(),
                      ),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
        loading: () => const Center(
            child: CupertinoActivityIndicator(color: CardVaultColors.gold500)),
        error: (e, _) =>
            Center(child: Text('Error: $e', style: const TextStyle(color: CardVaultColors.error))),
      ),
    );
  }

  Widget _detailRow(ThemeData theme, String label, String value, Color? valueColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: theme.textTheme.bodySmall
                ?.copyWith(color: CardVaultColors.dim)),
        Text(value,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: valueColor ?? CardVaultColors.text,
              fontWeight: FontWeight.w600,
            )),
      ],
    );
  }

  Color _conditionColor(CardCondition condition) => switch (condition) {
        CardCondition.gem => CardVaultColors.gradeGem,
        CardCondition.mint => CardVaultColors.gradeMint,
        CardCondition.nearMint => CardVaultColors.gradeNear,
        CardCondition.excellent => CardVaultColors.gradeExcellent,
        CardCondition.good => CardVaultColors.gradeGood,
        CardCondition.poor => CardVaultColors.gradePoor,
      };
}
