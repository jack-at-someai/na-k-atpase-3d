import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/strategy_provider.dart';
import '../../providers/subscription_provider.dart';
import '../../theme/maestro_colors.dart';

/// Tab shell wrapping the 7 Hoshin Kanri module screens.
class StrategyShell extends ConsumerWidget {
  final Widget child;

  const StrategyShell({super.key, required this.child});

  static const _tabs = [
    _Tab('X-Matrix', Icons.grid_4x4, 'x-matrix'),
    _Tab('Bowling', Icons.table_chart_outlined, 'bowling'),
    _Tab('A3', Icons.description_outlined, 'a3'),
    _Tab('Kaizen', Icons.view_kanban_outlined, 'kaizen'),
    _Tab('PDCA', Icons.autorenew, 'pdca'),
    _Tab('Catchball', Icons.swap_vert, 'catchball'),
    _Tab('Knowledge', Icons.menu_book_outlined, 'knowledge'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).matchedLocation;
    final currentTab = _tabs.indexWhere((t) => location.endsWith(t.path));

    // Extract strategy ID from the path
    final segments = location.split('/');
    final strategyId = segments.length > 2 ? segments[2] : 'sample';

    final strategyAsync = ref.watch(strategyStreamProvider(strategyId));
    final subscription = ref.watch(subscriptionProvider);
    final canEdit = subscription.canEdit;

    return Scaffold(
      backgroundColor: MaestroColors.background,
      appBar: GlassAppBar(
        showBackButton: true,
        onBack: () => context.go('/'),
        titleWidget: Text(
          'MAESTRO',
          style: TextStyle(
            color: MaestroColors.accent,
            letterSpacing: 3,
            fontWeight: FontWeight.w700,
            fontSize: 16,
          ),
        ),
        bottom: Padding(
          padding: const EdgeInsets.only(bottom: 8, left: 12, right: 12),
          child: GlassTabs(
            tabs: _tabs
                .map((t) => GlassTabItem(label: t.label, icon: t.icon))
                .toList(),
            selectedIndex: currentTab >= 0 ? currentTab : 0,
            onChanged: (i) =>
                context.go('/strategy/$strategyId/${_tabs[i].path}'),
            scrollable: true,
            alignment: GlassTabAlignment.start,
            indicatorColor: MaestroColors.accent,
            selectedColor: MaestroColors.accent,
            unselectedColor: MaestroColors.muted,
          ),
        ),
      ),
      body: strategyAsync.when(
        loading: () => const Center(child: CupertinoActivityIndicator()),
        error: (e, _) => Center(
          child: Text('Error loading strategy: $e',
              style: TextStyle(color: MaestroColors.muted)),
        ),
        data: (doc) {
          if (doc == null) {
            return const Center(child: CupertinoActivityIndicator());
          }
          return Column(
            children: [
              if (!canEdit)
                Container(
                  padding: const EdgeInsets.all(8),
                  color: Colors.amber.withValues(alpha: 0.15),
                  child: Row(
                    children: [
                      const Icon(Icons.lock, size: 14,
                          color: MaestroColors.muted),
                      const SizedBox(width: 8),
                      Text(
                        'View-only mode. Upgrade to edit.',
                        style: TextStyle(
                          color: MaestroColors.muted,
                          fontSize: 12,
                        ),
                      ),
                      const Spacer(),
                      GlassTextButton(
                        label: 'Upgrade',
                        onPressed: () =>
                            context.push('/settings/subscription'),
                      ),
                    ],
                  ),
                ),
              Expanded(
                child: IgnorePointer(
                  ignoring: !canEdit,
                  child: child,
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _Tab {
  final String label;
  final IconData icon;
  final String path;

  const _Tab(this.label, this.icon, this.path);
}
