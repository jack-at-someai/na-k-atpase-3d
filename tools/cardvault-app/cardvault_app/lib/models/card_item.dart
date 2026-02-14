/// CardItem — a single trading card in a store's inventory.

enum CardCondition { gem, mint, nearMint, excellent, good, poor }

enum CardCategory { sports, pokemon, yugioh, magic, onePiece, entertainment, memorabilia }

class CardItem {
  final String id;
  final String storeId;
  final String name;
  final String? playerName;
  final String set;
  final String? subset;
  final int? year;
  final CardCategory category;
  final CardCondition condition;
  final String? grader; // PSA, BGS, SGC, or null (raw)
  final double? gradeValue; // 1-10 scale
  final double price;
  final double? marketPrice;
  final String? imageUrl;
  final String? rarity; // Common, Uncommon, Rare, Ultra Rare, etc.
  final int quantity;
  final bool isSold;
  final DateTime createdAt;
  final DateTime updatedAt;

  const CardItem({
    required this.id,
    required this.storeId,
    required this.name,
    this.playerName,
    this.set = '',
    this.subset,
    this.year,
    this.category = CardCategory.sports,
    this.condition = CardCondition.nearMint,
    this.grader,
    this.gradeValue,
    required this.price,
    this.marketPrice,
    this.imageUrl,
    this.rarity,
    this.quantity = 1,
    this.isSold = false,
    required this.createdAt,
    required this.updatedAt,
  });

  CardItem copyWith({
    String? id,
    String? storeId,
    String? name,
    String? playerName,
    String? set,
    String? subset,
    int? year,
    CardCategory? category,
    CardCondition? condition,
    String? grader,
    double? gradeValue,
    double? price,
    double? marketPrice,
    String? imageUrl,
    String? rarity,
    int? quantity,
    bool? isSold,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) =>
      CardItem(
        id: id ?? this.id,
        storeId: storeId ?? this.storeId,
        name: name ?? this.name,
        playerName: playerName ?? this.playerName,
        set: set ?? this.set,
        subset: subset ?? this.subset,
        year: year ?? this.year,
        category: category ?? this.category,
        condition: condition ?? this.condition,
        grader: grader ?? this.grader,
        gradeValue: gradeValue ?? this.gradeValue,
        price: price ?? this.price,
        marketPrice: marketPrice ?? this.marketPrice,
        imageUrl: imageUrl ?? this.imageUrl,
        rarity: rarity ?? this.rarity,
        quantity: quantity ?? this.quantity,
        isSold: isSold ?? this.isSold,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'storeId': storeId,
        'name': name,
        'playerName': playerName,
        'set': set,
        'subset': subset,
        'year': year,
        'category': category.name,
        'condition': condition.name,
        'grader': grader,
        'gradeValue': gradeValue,
        'price': price,
        'marketPrice': marketPrice,
        'imageUrl': imageUrl,
        'rarity': rarity,
        'quantity': quantity,
        'isSold': isSold,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };

  factory CardItem.fromJson(Map<String, dynamic> json) => CardItem(
        id: json['id'] as String? ?? '',
        storeId: json['storeId'] as String? ?? '',
        name: json['name'] as String? ?? '',
        playerName: json['playerName'] as String?,
        set: json['set'] as String? ?? '',
        subset: json['subset'] as String?,
        year: json['year'] as int?,
        category: CardCategory.values.firstWhere(
          (c) => c.name == (json['category'] as String?),
          orElse: () => CardCategory.sports,
        ),
        condition: CardCondition.values.firstWhere(
          (c) => c.name == (json['condition'] as String?),
          orElse: () => CardCondition.nearMint,
        ),
        grader: json['grader'] as String?,
        gradeValue: (json['gradeValue'] as num?)?.toDouble(),
        price: (json['price'] as num?)?.toDouble() ?? 0,
        marketPrice: (json['marketPrice'] as num?)?.toDouble(),
        imageUrl: json['imageUrl'] as String?,
        rarity: json['rarity'] as String?,
        quantity: json['quantity'] as int? ?? 1,
        isSold: json['isSold'] as bool? ?? false,
        createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ??
            DateTime.now(),
        updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? '') ??
            DateTime.now(),
      );

  String get conditionLabel => switch (condition) {
        CardCondition.gem => 'Gem Mint',
        CardCondition.mint => 'Mint',
        CardCondition.nearMint => 'Near Mint',
        CardCondition.excellent => 'Excellent',
        CardCondition.good => 'Good',
        CardCondition.poor => 'Poor',
      };

  String get categoryLabel => switch (category) {
        CardCategory.sports => 'Sports',
        CardCategory.pokemon => 'Pokemon',
        CardCategory.yugioh => 'Yu-Gi-Oh!',
        CardCategory.magic => 'Magic: The Gathering',
        CardCategory.onePiece => 'One Piece',
        CardCategory.entertainment => 'Entertainment',
        CardCategory.memorabilia => 'Memorabilia',
      };

  String get gradeDisplay {
    if (grader == null) return 'Raw';
    return '$grader ${gradeValue?.toStringAsFixed(0) ?? ''}';
  }
}
