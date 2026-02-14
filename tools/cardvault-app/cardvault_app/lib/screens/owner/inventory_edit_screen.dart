import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

import '../../models/card_item.dart';
import '../../models/price_history.dart';
import '../../providers/card_provider.dart';
import '../../providers/user_provider.dart';
import '../../services/card_service.dart';
import '../../theme/cardvault_colors.dart';

class InventoryEditScreen extends ConsumerStatefulWidget {
  final String? cardId; // null = new card

  const InventoryEditScreen({super.key, this.cardId});

  @override
  ConsumerState<InventoryEditScreen> createState() =>
      _InventoryEditScreenState();
}

class _InventoryEditScreenState extends ConsumerState<InventoryEditScreen> {
  final _nameController = TextEditingController();
  final _playerController = TextEditingController();
  final _setController = TextEditingController();
  final _yearController = TextEditingController();
  final _priceController = TextEditingController();
  final _marketPriceController = TextEditingController();
  final _rarityController = TextEditingController();
  final _quantityController = TextEditingController(text: '1');
  final _gradeValueController = TextEditingController();

  CardCategory _category = CardCategory.sports;
  CardCondition _condition = CardCondition.nearMint;
  String? _grader;
  bool _isLoading = false;
  bool _isNew = true;

  @override
  void initState() {
    super.initState();
    _isNew = widget.cardId == null || widget.cardId == 'new';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _playerController.dispose();
    _setController.dispose();
    _yearController.dispose();
    _priceController.dispose();
    _marketPriceController.dispose();
    _rarityController.dispose();
    _quantityController.dispose();
    _gradeValueController.dispose();
    super.dispose();
  }

  void _populateFromCard(CardItem card) {
    _nameController.text = card.name;
    _playerController.text = card.playerName ?? '';
    _setController.text = card.set;
    _yearController.text = card.year?.toString() ?? '';
    _priceController.text = card.price.toStringAsFixed(2);
    _marketPriceController.text = card.marketPrice?.toStringAsFixed(2) ?? '';
    _rarityController.text = card.rarity ?? '';
    _quantityController.text = card.quantity.toString();
    _gradeValueController.text = card.gradeValue?.toString() ?? '';
    _category = card.category;
    _condition = card.condition;
    _grader = card.grader;
  }

  Future<void> _save() async {
    if (_nameController.text.trim().isEmpty) return;

    setState(() => _isLoading = true);

    try {
      final service = ref.read(cardServiceProvider);
      final storeId = ref.read(ownerStoreIdProvider);
      if (storeId == null) return;

      final now = DateTime.now();
      final price = double.tryParse(_priceController.text) ?? 0;

      final card = CardItem(
        id: _isNew ? const Uuid().v4() : widget.cardId!,
        storeId: storeId,
        name: _nameController.text.trim(),
        playerName: _playerController.text.trim().isNotEmpty
            ? _playerController.text.trim()
            : null,
        set: _setController.text.trim(),
        year: int.tryParse(_yearController.text),
        category: _category,
        condition: _condition,
        grader: _grader,
        gradeValue: double.tryParse(_gradeValueController.text),
        price: price,
        marketPrice: double.tryParse(_marketPriceController.text),
        rarity: _rarityController.text.trim().isNotEmpty
            ? _rarityController.text.trim()
            : null,
        quantity: int.tryParse(_quantityController.text) ?? 1,
        createdAt: _isNew ? now : now, // Preserved from existing on update
        updatedAt: now,
      );

      if (_isNew) {
        final docId = await service.createCard(card);
        // Add initial price entry
        await service.addPriceEntry(
          docId,
          PriceEntry(price: price, timestamp: now, source: 'manual'),
        );
      } else {
        await service.updateCard(card);
        // Add price change entry
        await service.addPriceEntry(
          card.id,
          PriceEntry(price: price, timestamp: now, source: 'manual'),
        );
      }

      if (mounted) Navigator.of(context).pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _delete() async {
    if (_isNew || widget.cardId == null) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: CardVaultColors.vault600,
        title: const Text('Delete Card',
            style: TextStyle(color: CardVaultColors.error)),
        content: const Text('Remove this card from inventory?',
            style: TextStyle(color: CardVaultColors.dim)),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel',
                style: TextStyle(color: CardVaultColors.dim)),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Delete',
                style: TextStyle(color: CardVaultColors.error)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(cardServiceProvider).deleteCard(widget.cardId!);
      if (mounted) Navigator.of(context).pop();
    }
  }

  Future<void> _markSold() async {
    if (_isNew || widget.cardId == null) return;
    await ref.read(cardServiceProvider).markSold(widget.cardId!);
    if (mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // If editing, load existing card data
    if (!_isNew && widget.cardId != null) {
      final cardAsync = ref.watch(cardByIdProvider(widget.cardId!));
      cardAsync.whenData((card) {
        if (card != null && _nameController.text.isEmpty) {
          _populateFromCard(card);
        }
      });
    }

    return Scaffold(
      backgroundColor: CardVaultColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: CardVaultColors.text),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          _isNew ? 'ADD CARD' : 'EDIT CARD',
          style: theme.textTheme.titleMedium?.copyWith(
            color: CardVaultColors.gold500,
            letterSpacing: 2,
          ),
        ),
        actions: [
          if (!_isNew) ...[
            IconButton(
              icon: const Icon(Icons.sell_outlined,
                  color: CardVaultColors.gradeGem),
              onPressed: _markSold,
              tooltip: 'Mark as Sold',
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline,
                  color: CardVaultColors.error),
              onPressed: _delete,
              tooltip: 'Delete',
            ),
          ],
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            GlassContainer(
              padding: const EdgeInsets.all(20),
              tint: CardVaultColors.gold500,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('CARD DETAILS',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: CardVaultColors.gold500,
                        letterSpacing: 2,
                      )),
                  const SizedBox(height: 16),
                  GlassTextField(
                    controller: _nameController,
                    labelText: 'Card Name',
                    hintText: '2000 Playoff Contenders #144',
                  ),
                  const SizedBox(height: 12),
                  GlassTextField(
                    controller: _playerController,
                    labelText: 'Player / Character',
                    hintText: 'Tom Brady',
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: GlassTextField(
                          controller: _setController,
                          labelText: 'Set',
                          hintText: 'Playoff Contenders',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GlassTextField(
                          controller: _yearController,
                          labelText: 'Year',
                          hintText: '2000',
                          keyboardType: TextInputType.number,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  GlassTextField(
                    controller: _rarityController,
                    labelText: 'Rarity',
                    hintText: 'Rare, Ultra Rare, etc.',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Category + Condition
            GlassContainer(
              padding: const EdgeInsets.all(20),
              tint: CardVaultColors.gold500,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('CATEGORY',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: CardVaultColors.gold500,
                        letterSpacing: 2,
                      )),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: CardCategory.values.map((cat) {
                      final selected = cat == _category;
                      return GlassChip(
                        isSelected: selected,
                        accentColor: CardVaultColors.gold500,
                        onTap: () => setState(() => _category = cat),
                        child: Text(
                          cat.name[0].toUpperCase() + cat.name.substring(1),
                          style: TextStyle(
                            fontSize: 12,
                            color: selected
                                ? CardVaultColors.gold500
                                : CardVaultColors.dim,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  Text('CONDITION',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: CardVaultColors.gold500,
                        letterSpacing: 2,
                      )),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: CardCondition.values.map((cond) {
                      final selected = cond == _condition;
                      return GlassChip(
                        isSelected: selected,
                        accentColor: _conditionColor(cond),
                        onTap: () => setState(() => _condition = cond),
                        child: Text(
                          _conditionLabel(cond),
                          style: TextStyle(
                            fontSize: 12,
                            color: selected
                                ? _conditionColor(cond)
                                : CardVaultColors.dim,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Grading + Pricing
            GlassContainer(
              padding: const EdgeInsets.all(20),
              tint: CardVaultColors.gold500,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('GRADING',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: CardVaultColors.gold500,
                        letterSpacing: 2,
                      )),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [null, 'PSA', 'BGS', 'SGC'].map((g) {
                      final selected = g == _grader;
                      return GlassChip(
                        isSelected: selected,
                        accentColor: CardVaultColors.gold500,
                        onTap: () => setState(() => _grader = g),
                        child: Text(
                          g ?? 'Raw',
                          style: TextStyle(
                            fontSize: 12,
                            color: selected
                                ? CardVaultColors.gold500
                                : CardVaultColors.dim,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  if (_grader != null) ...[
                    const SizedBox(height: 12),
                    GlassTextField(
                      controller: _gradeValueController,
                      labelText: 'Grade (1-10)',
                      hintText: '10',
                      keyboardType: TextInputType.number,
                    ),
                  ],
                  const SizedBox(height: 20),
                  Text('PRICING',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: CardVaultColors.gold500,
                        letterSpacing: 2,
                      )),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: GlassTextField(
                          controller: _priceController,
                          labelText: 'Price (\$)',
                          hintText: '99.99',
                          keyboardType: TextInputType.number,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GlassTextField(
                          controller: _marketPriceController,
                          labelText: 'Market Price (\$)',
                          hintText: '120.00',
                          keyboardType: TextInputType.number,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  GlassTextField(
                    controller: _quantityController,
                    labelText: 'Quantity',
                    hintText: '1',
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Save button
            _isLoading
                ? const Center(
                    child: CupertinoActivityIndicator(
                        color: CardVaultColors.gold500))
                : GlassFilledButton(
                    onPressed: _save,
                    label: _isNew ? 'Add to Inventory' : 'Save Changes',
                  ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  String _conditionLabel(CardCondition c) => switch (c) {
        CardCondition.gem => 'Gem',
        CardCondition.mint => 'Mint',
        CardCondition.nearMint => 'NM',
        CardCondition.excellent => 'EX',
        CardCondition.good => 'Good',
        CardCondition.poor => 'Poor',
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
