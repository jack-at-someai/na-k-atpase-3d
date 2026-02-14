import 'dart:async';
import 'dart:math';

import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../models/price_history.dart';
import '../../providers/card_provider.dart';
import '../../providers/user_provider.dart';
import '../../services/card_service.dart';
import '../../theme/cardvault_colors.dart';

/// Mock AI pricing agent — simulates market-based price suggestions.
class _PriceSuggestion {
  final String cardId;
  final String cardName;
  final double currentPrice;
  final double suggestedPrice;
  final String reasoning;
  final double confidence;

  const _PriceSuggestion({
    required this.cardId,
    required this.cardName,
    required this.currentPrice,
    required this.suggestedPrice,
    required this.reasoning,
    required this.confidence,
  });

  double get priceDelta => suggestedPrice - currentPrice;
  double get priceDeltaPercent =>
      currentPrice > 0 ? (priceDelta / currentPrice) * 100 : 0;
  bool get isIncrease => priceDelta > 0;
}

class PriceAgentScreen extends ConsumerStatefulWidget {
  const PriceAgentScreen({super.key});

  @override
  ConsumerState<PriceAgentScreen> createState() => _PriceAgentScreenState();
}

class _PriceAgentScreenState extends ConsumerState<PriceAgentScreen> {
  List<_PriceSuggestion> _suggestions = [];
  bool _isAnalyzing = false;
  bool _hasAnalyzed = false;

  Future<void> _runAgent() async {
    final storeId = ref.read(ownerStoreIdProvider);
    if (storeId == null) return;

    setState(() {
      _isAnalyzing = true;
      _suggestions = [];
    });

    // Simulate AI processing delay
    await Future.delayed(const Duration(seconds: 2));

    final cards = ref.read(storeCardsProvider(storeId)).valueOrNull ?? [];
    final rng = Random();

    // Generate mock suggestions for a subset of cards
    final cardsToAnalyze = cards.length > 10
        ? (cards.toList()..shuffle(rng)).take(10).toList()
        : cards;

    final suggestions = <_PriceSuggestion>[];

    for (final card in cardsToAnalyze) {
      // Mock market analysis — random price adjustment between -15% and +25%
      final adjustment = (rng.nextDouble() * 40 - 15) / 100;
      final suggestedPrice = card.price * (1 + adjustment);
      final confidence = 0.65 + rng.nextDouble() * 0.3;

      final reasons = [
        'Recent eBay sold comps show ${adjustment > 0 ? "upward" : "downward"} trend for ${card.set} cards.',
        'PSA population report indicates ${adjustment > 0 ? "scarcity" : "increased supply"} at this grade level.',
        'Market demand for ${card.categoryLabel} cards has ${adjustment > 0 ? "increased" : "softened"} this quarter.',
        '130point data shows comparable sales averaging \$${suggestedPrice.toStringAsFixed(2)} over last 30 days.',
        'Card Ladder index for ${card.playerName ?? card.name} is ${adjustment > 0 ? "trending up" : "cooling off"}.',
      ];

      suggestions.add(_PriceSuggestion(
        cardId: card.id,
        cardName: card.name,
        currentPrice: card.price,
        suggestedPrice: double.parse(suggestedPrice.toStringAsFixed(2)),
        reasoning: reasons[rng.nextInt(reasons.length)],
        confidence: double.parse(confidence.toStringAsFixed(2)),
      ));
    }

    // Sort by absolute price change (biggest opportunities first)
    suggestions.sort(
        (a, b) => b.priceDelta.abs().compareTo(a.priceDelta.abs()));

    setState(() {
      _suggestions = suggestions;
      _isAnalyzing = false;
      _hasAnalyzed = true;
    });
  }

  Future<void> _applySuggestion(_PriceSuggestion suggestion) async {
    final service = ref.read(cardServiceProvider);
    final cardAsync = ref.read(cardByIdProvider(suggestion.cardId));
    final card = cardAsync.valueOrNull;
    if (card == null) return;

    final updated = card.copyWith(
      price: suggestion.suggestedPrice,
      updatedAt: DateTime.now(),
    );
    await service.updateCard(updated);
    await service.addPriceEntry(
      card.id,
      PriceEntry(
        price: suggestion.suggestedPrice,
        timestamp: DateTime.now(),
        source: 'agent',
        note: suggestion.reasoning,
      ),
    );

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              'Updated ${suggestion.cardName} to \$${suggestion.suggestedPrice.toStringAsFixed(2)}'),
          backgroundColor: CardVaultColors.vault600,
        ),
      );
      // Remove from suggestions
      setState(() {
        _suggestions.removeWhere((s) => s.cardId == suggestion.cardId);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFmt = NumberFormat.currency(symbol: '\$');

    return Scaffold(
      backgroundColor: CardVaultColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: CardVaultColors.text),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.smart_toy_outlined,
                color: CardVaultColors.gold500, size: 20),
            const SizedBox(width: 8),
            Text(
              'PRICE AGENT',
              style: theme.textTheme.titleMedium?.copyWith(
                color: CardVaultColors.gold500,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Agent description
            GlassContainer(
              padding: const EdgeInsets.all(20),
              tint: CardVaultColors.gold500,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('AI Pricing Assistant',
                      style: theme.textTheme.titleSmall?.copyWith(
                        color: CardVaultColors.text,
                        fontWeight: FontWeight.w700,
                      )),
                  const SizedBox(height: 8),
                  Text(
                    'Analyzes your inventory against market data from '
                    'eBay sold listings, PSA population reports, Card Ladder, '
                    'and 130point to suggest optimal pricing.',
                    style: theme.textTheme.bodySmall
                        ?.copyWith(color: CardVaultColors.dim),
                  ),
                  const SizedBox(height: 16),
                  _isAnalyzing
                      ? const Center(
                          child: CupertinoActivityIndicator(
                              color: CardVaultColors.gold500))
                      : GlassFilledButton(
                          onPressed: _runAgent,
                          label: _hasAnalyzed
                              ? 'Re-Analyze Inventory'
                              : 'Analyze Inventory',
                        ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Results
            if (_suggestions.isNotEmpty) ...[
              Text(
                '${_suggestions.length} SUGGESTIONS',
                style: theme.textTheme.labelSmall?.copyWith(
                  color: CardVaultColors.gold500,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 12),
            ],

            Expanded(
              child: _suggestions.isEmpty
                  ? Center(
                      child: _hasAnalyzed
                          ? Text('All prices look optimal.',
                              style: theme.textTheme.bodyMedium
                                  ?.copyWith(color: CardVaultColors.dim))
                          : Text('Press Analyze to get started.',
                              style: theme.textTheme.bodyMedium
                                  ?.copyWith(color: CardVaultColors.dim)),
                    )
                  : ListView.separated(
                      itemCount: _suggestions.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final s = _suggestions[index];
                        return GlassCard(
                          padding: const EdgeInsets.all(16),
                          accentColor: s.isIncrease
                              ? CardVaultColors.gradeGem
                              : CardVaultColors.gradeExcellent,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(s.cardName,
                                        style: theme.textTheme.bodyMedium
                                            ?.copyWith(
                                          color: CardVaultColors.text,
                                          fontWeight: FontWeight.w600,
                                        )),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: CardVaultColors.gold500
                                          .withValues(alpha: 0.2),
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(
                                        color: CardVaultColors.gold500,
                                        width: 0.5,
                                      ),
                                    ),
                                    child: Text(
                                      '${s.confidence * 100 ~/ 1}% conf',
                                      style: const TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w600,
                                        color: CardVaultColors.gold500,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text('Current',
                                          style: theme.textTheme.labelSmall
                                              ?.copyWith(
                                                  color:
                                                      CardVaultColors.dim)),
                                      Text(currencyFmt.format(s.currentPrice),
                                          style: theme.textTheme.bodyLarge
                                              ?.copyWith(
                                                  color:
                                                      CardVaultColors.dim)),
                                    ],
                                  ),
                                  const SizedBox(width: 16),
                                  Icon(Icons.arrow_forward,
                                      color: CardVaultColors.gold500,
                                      size: 16),
                                  const SizedBox(width: 16),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text('Suggested',
                                          style: theme.textTheme.labelSmall
                                              ?.copyWith(
                                                  color: CardVaultColors
                                                      .gold500)),
                                      Text(
                                          currencyFmt
                                              .format(s.suggestedPrice),
                                          style: theme.textTheme.bodyLarge
                                              ?.copyWith(
                                            color: CardVaultColors.text,
                                            fontWeight: FontWeight.w700,
                                          )),
                                    ],
                                  ),
                                  const Spacer(),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        '${s.isIncrease ? "+" : ""}${s.priceDeltaPercent.toStringAsFixed(1)}%',
                                        style: theme.textTheme.bodyMedium
                                            ?.copyWith(
                                          color: s.isIncrease
                                              ? CardVaultColors.gradeGem
                                              : CardVaultColors.gradeExcellent,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      Text(
                                        '${s.isIncrease ? "+" : ""}${currencyFmt.format(s.priceDelta)}',
                                        style: theme.textTheme.bodySmall
                                            ?.copyWith(
                                                color: CardVaultColors.dim),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(s.reasoning,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: CardVaultColors.dim,
                                    fontStyle: FontStyle.italic,
                                  )),
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  GlassTextButton(
                                    onPressed: () => setState(() =>
                                        _suggestions.removeWhere(
                                            (x) => x.cardId == s.cardId)),
                                    label: 'Dismiss',
                                  ),
                                  const SizedBox(width: 12),
                                  GlassFilledButton(
                                    onPressed: () => _applySuggestion(s),
                                    label: 'Apply',
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
