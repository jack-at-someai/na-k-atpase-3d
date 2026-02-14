import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/card_item.dart';
import '../models/price_history.dart';

final cardServiceProvider = Provider<CardService>((ref) => CardService());

class CardService {
  final _db = FirebaseFirestore.instance;

  CollectionReference<Map<String, dynamic>> get _cardsRef =>
      _db.collection('cards');

  CollectionReference<Map<String, dynamic>> _priceHistoryRef(String cardId) =>
      _db.collection('cards').doc(cardId).collection('priceHistory');

  // ---------------------------------------------------------------------------
  // Card CRUD
  // ---------------------------------------------------------------------------

  /// Watch all cards for a specific store.
  Stream<List<CardItem>> watchStoreCards(String storeId) {
    return _cardsRef
        .where('storeId', isEqualTo: storeId)
        .where('isSold', isEqualTo: false)
        .orderBy('updatedAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs.map((doc) {
              final data = doc.data();
              data['id'] = doc.id;
              return CardItem.fromJson(data);
            }).toList());
  }

  /// Watch a single card.
  Stream<CardItem?> watchCard(String cardId) {
    return _cardsRef.doc(cardId).snapshots().map((snap) {
      if (!snap.exists) return null;
      final data = snap.data()!;
      data['id'] = snap.id;
      return CardItem.fromJson(data);
    });
  }

  /// Search cards within a store by name, set, rarity, category, price range.
  Stream<List<CardItem>> searchCards({
    required String storeId,
    String? query,
    CardCategory? category,
    double? minPrice,
    double? maxPrice,
    String? rarity,
  }) {
    Query<Map<String, dynamic>> q =
        _cardsRef.where('storeId', isEqualTo: storeId)
            .where('isSold', isEqualTo: false);

    if (category != null) {
      q = q.where('category', isEqualTo: category.name);
    }

    // Firestore doesn't support full-text search natively.
    // Price range filters can be applied:
    if (minPrice != null) {
      q = q.where('price', isGreaterThanOrEqualTo: minPrice);
    }
    if (maxPrice != null) {
      q = q.where('price', isLessThanOrEqualTo: maxPrice);
    }

    return q.orderBy('price').snapshots().map((snap) {
      var cards = snap.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return CardItem.fromJson(data);
      }).toList();

      // Client-side text filtering
      if (query != null && query.isNotEmpty) {
        final lower = query.toLowerCase();
        cards = cards.where((c) =>
            c.name.toLowerCase().contains(lower) ||
            c.set.toLowerCase().contains(lower) ||
            (c.playerName?.toLowerCase().contains(lower) ?? false)).toList();
      }

      if (rarity != null && rarity.isNotEmpty) {
        cards = cards.where((c) =>
            c.rarity?.toLowerCase() == rarity.toLowerCase()).toList();
      }

      return cards;
    });
  }

  /// Create a new card.
  Future<String> createCard(CardItem card) async {
    final json = card.toJson();
    json.remove('id');
    final ref = await _cardsRef.add(json);
    return ref.id;
  }

  /// Update an existing card.
  Future<void> updateCard(CardItem card) {
    final json = card.toJson();
    json.remove('id');
    json['updatedAt'] = DateTime.now().toIso8601String();
    return _cardsRef.doc(card.id).update(json);
  }

  /// Delete a card.
  Future<void> deleteCard(String cardId) {
    return _cardsRef.doc(cardId).delete();
  }

  /// Mark card as sold.
  Future<void> markSold(String cardId) {
    return _cardsRef.doc(cardId).update({
      'isSold': true,
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  // ---------------------------------------------------------------------------
  // Price History
  // ---------------------------------------------------------------------------

  /// Watch price history for a card.
  Stream<PriceHistory> watchPriceHistory(String cardId) {
    return _priceHistoryRef(cardId)
        .orderBy('timestamp')
        .snapshots()
        .map((snap) {
      final entries = snap.docs
          .map((doc) => PriceEntry.fromJson(doc.data()))
          .toList();
      return PriceHistory(cardId: cardId, entries: entries);
    });
  }

  /// Add a price entry.
  Future<void> addPriceEntry(String cardId, PriceEntry entry) {
    return _priceHistoryRef(cardId).add(entry.toJson());
  }

  // ---------------------------------------------------------------------------
  // Analytics (owner)
  // ---------------------------------------------------------------------------

  /// Get sold cards for a store (for analytics).
  Stream<List<CardItem>> watchSoldCards(String storeId) {
    return _cardsRef
        .where('storeId', isEqualTo: storeId)
        .where('isSold', isEqualTo: true)
        .orderBy('updatedAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs.map((doc) {
              final data = doc.data();
              data['id'] = doc.id;
              return CardItem.fromJson(data);
            }).toList());
  }

  // ---------------------------------------------------------------------------
  // Bulk import (simplified — writes batch)
  // ---------------------------------------------------------------------------

  /// Import a list of cards in a batch.
  Future<void> bulkImport(List<CardItem> cards) async {
    final batch = _db.batch();
    for (final card in cards) {
      final json = card.toJson();
      json.remove('id');
      batch.set(_cardsRef.doc(), json);
    }
    await batch.commit();
  }
}
