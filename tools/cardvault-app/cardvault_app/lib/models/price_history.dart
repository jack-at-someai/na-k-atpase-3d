/// PriceHistory — tracks price changes for a card over time.

class PriceEntry {
  final double price;
  final DateTime timestamp;
  final String source; // 'manual', 'agent', 'market'
  final String? note;

  const PriceEntry({
    required this.price,
    required this.timestamp,
    this.source = 'manual',
    this.note,
  });

  Map<String, dynamic> toJson() => {
        'price': price,
        'timestamp': timestamp.toIso8601String(),
        'source': source,
        'note': note,
      };

  factory PriceEntry.fromJson(Map<String, dynamic> json) => PriceEntry(
        price: (json['price'] as num?)?.toDouble() ?? 0,
        timestamp: DateTime.tryParse(json['timestamp'] as String? ?? '') ??
            DateTime.now(),
        source: json['source'] as String? ?? 'manual',
        note: json['note'] as String?,
      );
}

class PriceHistory {
  final String cardId;
  final List<PriceEntry> entries;

  const PriceHistory({
    required this.cardId,
    this.entries = const [],
  });

  PriceHistory copyWith({
    String? cardId,
    List<PriceEntry>? entries,
  }) =>
      PriceHistory(
        cardId: cardId ?? this.cardId,
        entries: entries ?? this.entries,
      );

  Map<String, dynamic> toJson() => {
        'cardId': cardId,
        'entries': entries.map((e) => e.toJson()).toList(),
      };

  factory PriceHistory.fromJson(Map<String, dynamic> json) => PriceHistory(
        cardId: json['cardId'] as String? ?? '',
        entries: (json['entries'] as List?)
                ?.map((e) => PriceEntry.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
      );

  double? get latestPrice => entries.isNotEmpty ? entries.last.price : null;

  double? get previousPrice =>
      entries.length >= 2 ? entries[entries.length - 2].price : null;

  double? get priceChange {
    if (latestPrice == null || previousPrice == null) return null;
    return latestPrice! - previousPrice!;
  }

  double? get priceChangePercent {
    if (priceChange == null || previousPrice == null || previousPrice == 0) {
      return null;
    }
    return (priceChange! / previousPrice!) * 100;
  }
}
