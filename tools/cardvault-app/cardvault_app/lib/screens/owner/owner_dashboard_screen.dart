import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../providers/card_provider.dart';
import '../../providers/user_provider.dart';
import '../../services/auth_service.dart';
import '../../theme/cardvault_colors.dart';
import '../../widgets/card_grid_tile.dart';

class OwnerDashboardScreen extends ConsumerWidget {
  const OwnerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final storeId = ref.watch(ownerStoreIdProvider);
    final currencyFmt = NumberFormat.currency(symbol: '\$');

    if (storeId == null) {
      return Scaffold(
        backgroundColor: CardVaultColors.background,
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.store_outlined, size: 64, color: CardVaultColors.dim),
              const SizedBox(height: 16),
              Text('No store assigned to your account.',
                  style: theme.textTheme.bodyLarge
                      ?.copyWith(color: CardVaultColors.dim)),
              const SizedBox(height: 24),
              GlassOutlinedButton(
                onPressed: () => ref.read(authServiceProvider).signOut(),
                label: 'Sign Out',
              ),
            ],
          ),
        ),
      );
    }

    final inventoryAsync = ref.watch(storeCardsProvider(storeId));
    final soldAsync = ref.watch(soldCardsProvider(storeId));

    return Scaffold(
      backgroundColor: CardVaultColors.background,
      floatingActionButton: GlassFab(
        onPressed: () => context.push('/inventory/new'),
        icon: Icons.add,
        color: CardVaultColors.gold500,
      ),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Padding(
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
                        'VAULT',
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: Colors.white,
                          letterSpacing: 3,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'OWNER',
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: CardVaultColors.dim,
                        letterSpacing: 2,
                      ),
                    ),
                    const Spacer(),
                    GlassIconButton(
                      icon: Icons.smart_toy_outlined,
                      onPressed: () => context.push('/price-agent'),
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    GlassIconButton(
                      icon: Icons.logout,
                      onPressed: () =>
                          ref.read(authServiceProvider).signOut(),
                      size: 20,
                    ),
                  ],
                ),
              ),
            ),

            // Analytics cards
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
                child: soldAsync.when(
                  data: (sold) {
                    final totalRevenue =
                        sold.fold<double>(0, (sum, c) => sum + c.price);
                    final inventoryCount =
                        inventoryAsync.valueOrNull?.length ?? 0;
                    final totalInventoryValue =
                        inventoryAsync.valueOrNull?.fold<double>(
                                0, (sum, c) => sum + c.price) ??
                            0;

                    // Category breakdown for popular items
                    final categoryCount = <String, int>{};
                    for (final c in sold) {
                      categoryCount[c.categoryLabel] =
                          (categoryCount[c.categoryLabel] ?? 0) + 1;
                    }
                    final topCategory = categoryCount.entries.isEmpty
                        ? 'N/A'
                        : (categoryCount.entries.toList()
                              ..sort((a, b) => b.value.compareTo(a.value)))
                            .first
                            .key;

                    return Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: _statCard(theme, 'REVENUE',
                                  currencyFmt.format(totalRevenue),
                                  CardVaultColors.gold500),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _statCard(theme, 'SOLD',
                                  '${sold.length}', CardVaultColors.gradeGem),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _statCard(theme, 'INVENTORY',
                                  '$inventoryCount', CardVaultColors.dim),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _statCard(theme, 'STOCK VALUE',
                                  currencyFmt.format(totalInventoryValue),
                                  CardVaultColors.gold700),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _statCard(theme, 'TOP CATEGORY',
                                  topCategory, CardVaultColors.accentLight),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: GlassCard(
                                padding: const EdgeInsets.all(16),
                                accentColor: CardVaultColors.gold500,
                                onTap: () => _showBulkImportDialog(context),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(Icons.upload_file,
                                        color: CardVaultColors.gold500,
                                        size: 20),
                                    const SizedBox(height: 8),
                                    Text('BULK IMPORT',
                                        style:
                                            theme.textTheme.labelSmall?.copyWith(
                                          color: CardVaultColors.gold500,
                                          letterSpacing: 1.5,
                                        )),
                                    const SizedBox(height: 2),
                                    Text('CSV upload',
                                        style:
                                            theme.textTheme.bodySmall?.copyWith(
                                          color: CardVaultColors.dim,
                                        )),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    );
                  },
                  loading: () => const Center(
                      child: CupertinoActivityIndicator(
                          color: CardVaultColors.gold500)),
                  error: (e, _) => Text('Error: $e'),
                ),
              ),
            ),

            // Inventory header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
                child: Row(
                  children: [
                    Text(
                      'INVENTORY',
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: CardVaultColors.gold500,
                        letterSpacing: 2,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '${inventoryAsync.valueOrNull?.length ?? 0} cards',
                      style: theme.textTheme.bodySmall
                          ?.copyWith(color: CardVaultColors.dim),
                    ),
                  ],
                ),
              ),
            ),

            // Inventory grid
            inventoryAsync.when(
              data: (cards) => SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverGrid(
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.68,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final card = cards[index];
                      return CardGridTile(
                        card: card,
                        showEditBadge: true,
                        onTap: () =>
                            context.push('/inventory/${card.id}'),
                      );
                    },
                    childCount: cards.length,
                  ),
                ),
              ),
              loading: () => const SliverFillRemaining(
                child: Center(
                    child: CupertinoActivityIndicator(
                        color: CardVaultColors.gold500)),
              ),
              error: (e, _) => SliverFillRemaining(
                child: Center(child: Text('Error: $e')),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 80)),
          ],
        ),
      ),
    );
  }

  Widget _statCard(
      ThemeData theme, String label, String value, Color color) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      accentColor: color,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: theme.textTheme.labelSmall?.copyWith(
                color: color,
                letterSpacing: 1.5,
              )),
          const SizedBox(height: 4),
          Text(value,
              style: theme.textTheme.titleLarge?.copyWith(
                color: CardVaultColors.text,
                fontWeight: FontWeight.w700,
              )),
        ],
      ),
    );
  }

  void _showBulkImportDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: CardVaultColors.vault600,
        title: const Text('Bulk Import',
            style: TextStyle(color: CardVaultColors.gold500)),
        content: const Text(
          'CSV bulk import is designed for desktop use. '
          'Prepare a CSV with columns: name, set, year, category, '
          'condition, grader, gradeValue, price, rarity, quantity.\n\n'
          'Upload coming in the next release.',
          style: TextStyle(color: CardVaultColors.dim),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('OK',
                style: TextStyle(color: CardVaultColors.gold500)),
          ),
        ],
      ),
    );
  }
}
