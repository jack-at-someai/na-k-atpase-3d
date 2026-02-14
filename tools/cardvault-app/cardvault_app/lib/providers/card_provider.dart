import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/card_item.dart';
import '../models/price_history.dart';
import '../services/card_service.dart';

/// Stream of cards for a specific store.
final storeCardsProvider =
    StreamProvider.family<List<CardItem>, String>((ref, storeId) {
  final service = ref.watch(cardServiceProvider);
  return service.watchStoreCards(storeId);
});

/// Stream of sold cards for analytics.
final soldCardsProvider =
    StreamProvider.family<List<CardItem>, String>((ref, storeId) {
  final service = ref.watch(cardServiceProvider);
  return service.watchSoldCards(storeId);
});

/// Watch a single card.
final cardByIdProvider =
    StreamProvider.family<CardItem?, String>((ref, cardId) {
  final service = ref.watch(cardServiceProvider);
  return service.watchCard(cardId);
});

/// Watch price history for a card.
final priceHistoryProvider =
    StreamProvider.family<PriceHistory, String>((ref, cardId) {
  final service = ref.watch(cardServiceProvider);
  return service.watchPriceHistory(cardId);
});

// ---------------------------------------------------------------------------
// Search / filter state
// ---------------------------------------------------------------------------

final cardSearchQueryProvider = StateProvider<String>((ref) => '');
final cardCategoryFilterProvider = StateProvider<CardCategory?>((ref) => null);
final cardMinPriceProvider = StateProvider<double?>((ref) => null);
final cardMaxPriceProvider = StateProvider<double?>((ref) => null);
final cardRarityFilterProvider = StateProvider<String?>((ref) => null);

/// Filtered cards for the currently selected store, applying search + filters.
final filteredCardsProvider =
    StreamProvider.family<List<CardItem>, String>((ref, storeId) {
  final service = ref.watch(cardServiceProvider);
  final query = ref.watch(cardSearchQueryProvider);
  final category = ref.watch(cardCategoryFilterProvider);
  final minPrice = ref.watch(cardMinPriceProvider);
  final maxPrice = ref.watch(cardMaxPriceProvider);
  final rarity = ref.watch(cardRarityFilterProvider);

  return service.searchCards(
    storeId: storeId,
    query: query.isNotEmpty ? query : null,
    category: category,
    minPrice: minPrice,
    maxPrice: maxPrice,
    rarity: rarity,
  );
});

// ---------------------------------------------------------------------------
// Card edit notifier (debounced Firestore persistence)
// ---------------------------------------------------------------------------

class CardEditNotifier extends AutoDisposeAsyncNotifier<CardItem?> {
  Timer? _debounce;
  bool _hasLoaded = false;

  @override
  Future<CardItem?> build() async {
    ref.onDispose(() => _debounce?.cancel());
    return null;
  }

  /// Load a card for editing.
  void load(CardItem card) {
    _hasLoaded = true;
    state = AsyncData(card);
  }

  /// Update a field and debounce-persist to Firestore.
  void updateCard(CardItem Function(CardItem) updater) {
    final current = state.valueOrNull;
    if (current == null) return;

    final updated = updater(current).copyWith(updatedAt: DateTime.now());
    state = AsyncData(updated);

    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 800), () {
      _persist(updated);
    });
  }

  Future<void> _persist(CardItem card) async {
    if (!_hasLoaded) return;
    try {
      final service = ref.read(cardServiceProvider);
      await service.updateCard(card);
    } catch (e) {
      // Silently handle — card will re-sync from stream
    }
  }

  /// Save immediately (for explicit save actions).
  Future<void> saveNow() async {
    _debounce?.cancel();
    final card = state.valueOrNull;
    if (card == null) return;
    await _persist(card);
  }
}

final cardEditProvider =
    AutoDisposeAsyncNotifierProvider<CardEditNotifier, CardItem?>(
        CardEditNotifier.new);
