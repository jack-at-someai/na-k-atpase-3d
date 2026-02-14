import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/card_item.dart';
import '../../providers/card_provider.dart';
import '../../providers/store_provider.dart';
import '../../services/auth_service.dart';
import '../../theme/cardvault_colors.dart';
import '../../widgets/card_grid_tile.dart';
import '../../widgets/store_selector.dart';

class CustomerHomeScreen extends ConsumerStatefulWidget {
  const CustomerHomeScreen({super.key});

  @override
  ConsumerState<CustomerHomeScreen> createState() => _CustomerHomeScreenState();
}

class _CustomerHomeScreenState extends ConsumerState<CustomerHomeScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final storesAsync = ref.watch(allStoresProvider);
    final selectedStoreId = ref.watch(selectedStoreIdProvider);
    final categoryFilter = ref.watch(cardCategoryFilterProvider);

    return Scaffold(
      backgroundColor: CardVaultColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // App bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Row(
                children: [
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [
                        CardVaultColors.gold500,
                        CardVaultColors.gold300,
                      ],
                    ).createShader(bounds),
                    child: Text(
                      'CARDVAULT',
                      style: theme.textTheme.titleLarge?.copyWith(
                        color: Colors.white,
                        letterSpacing: 3,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const Spacer(),
                  GlassIconButton(
                    icon: Icons.logout,
                    onPressed: () =>
                        ref.read(authServiceProvider).signOut(),
                    size: 20,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Store selector
            storesAsync.when(
              data: (stores) => StoreSelector(
                stores: stores,
                selectedId: selectedStoreId,
                onSelected: (id) =>
                    ref.read(selectedStoreIdProvider.notifier).state = id,
              ),
              loading: () => const Padding(
                padding: EdgeInsets.all(16),
                child: CupertinoActivityIndicator(
                    color: CardVaultColors.gold500),
              ),
              error: (e, _) => Padding(
                padding: const EdgeInsets.all(16),
                child: Text('Error loading stores',
                    style: TextStyle(color: CardVaultColors.error)),
              ),
            ),
            const SizedBox(height: 12),

            // Search bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: GlassSearchField(
                controller: _searchController,
                hintText: 'Search cards, players, sets...',
                onChanged: (value) =>
                    ref.read(cardSearchQueryProvider.notifier).state = value,
              ),
            ),
            const SizedBox(height: 12),

            // Category filter chips
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _filterChip(context, 'All', null, categoryFilter),
                  ...CardCategory.values.map((cat) => _filterChip(
                      context,
                      cat.name[0].toUpperCase() + cat.name.substring(1),
                      cat,
                      categoryFilter)),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Card grid
            Expanded(
              child: selectedStoreId == null
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.store_outlined,
                              size: 64, color: CardVaultColors.dim),
                          const SizedBox(height: 12),
                          Text('Select a store to browse cards',
                              style: theme.textTheme.bodyMedium
                                  ?.copyWith(color: CardVaultColors.dim)),
                        ],
                      ),
                    )
                  : _buildCardGrid(selectedStoreId),
            ),
          ],
        ),
      ),
    );
  }

  Widget _filterChip(BuildContext context, String label,
      CardCategory? category, CardCategory? selected) {
    final isSelected = category == selected;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GlassChip(
        isSelected: isSelected,
        accentColor: CardVaultColors.gold500,
        onTap: () =>
            ref.read(cardCategoryFilterProvider.notifier).state = category,
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: isSelected
                ? CardVaultColors.gold500
                : CardVaultColors.dim,
          ),
        ),
      ),
    );
  }

  Widget _buildCardGrid(String storeId) {
    final cardsAsync = ref.watch(filteredCardsProvider(storeId));

    return cardsAsync.when(
      data: (cards) {
        if (cards.isEmpty) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.search_off, size: 48, color: CardVaultColors.dim),
                const SizedBox(height: 12),
                Text('No cards found',
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium
                        ?.copyWith(color: CardVaultColors.dim)),
              ],
            ),
          );
        }
        return GridView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.68,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: cards.length,
          itemBuilder: (context, index) {
            final card = cards[index];
            return CardGridTile(
              card: card,
              onTap: () => context.push('/card/${card.id}'),
            );
          },
        );
      },
      loading: () => const Center(
          child: CupertinoActivityIndicator(color: CardVaultColors.gold500)),
      error: (e, _) => Center(
          child: Text('Error: $e',
              style: const TextStyle(color: CardVaultColors.error))),
    );
  }
}
