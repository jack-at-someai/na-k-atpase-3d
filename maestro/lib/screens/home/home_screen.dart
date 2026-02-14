import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/strategy_document.dart';
import '../../providers/auth_provider.dart';
import '../../providers/org_provider.dart';
import '../../providers/strategy_provider.dart';
import '../../providers/subscription_provider.dart';
import '../../services/auth_service.dart';
import '../../services/strategy_service.dart';
import '../../theme/maestro_colors.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final orgAsync = ref.watch(activeOrgProvider);

    return Scaffold(
      backgroundColor: MaestroColors.background,
      appBar: GlassAppBar(
        titleWidget: Text(
          'MAESTRO',
          style: TextStyle(
            color: MaestroColors.accent,
            letterSpacing: 3,
            fontWeight: FontWeight.w700,
            fontSize: 20,
          ),
        ),
        actions: [
          GlassIconButton(
            icon: Icons.settings_outlined,
            tooltip: 'Settings',
            onPressed: () => context.push('/settings/subscription'),
          ),
          GlassIconButton(
            icon: Icons.logout,
            tooltip: 'Sign Out',
            onPressed: () => ref.read(authServiceProvider).signOut(),
          ),
        ],
      ),
      body: orgAsync.when(
        loading: () => const Center(child: CupertinoActivityIndicator()),
        error: (e, _) => Center(
          child: Text('Error loading organization: $e',
              style: TextStyle(color: MaestroColors.muted)),
        ),
        data: (org) {
          if (org == null) {
            return const Center(child: CupertinoActivityIndicator());
          }
          return _OrgHome(orgId: org.id, userEmail: user?.email);
        },
      ),
    );
  }
}

class _OrgHome extends ConsumerWidget {
  final String orgId;
  final String? userEmail;

  const _OrgHome({required this.orgId, this.userEmail});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strategiesAsync = ref.watch(strategiesListProvider(orgId));
    final subscription = ref.watch(subscriptionProvider);
    final theme = Theme.of(context);

    return strategiesAsync.when(
      loading: () => const Center(child: CupertinoActivityIndicator()),
      error: (e, _) => Center(
        child: Text('Error loading strategies: $e',
            style: TextStyle(color: MaestroColors.muted)),
      ),
      data: (strategies) {
        // Derive stat counts from real data
        int annualCount = 0;
        int priorityCount = 0;
        int kaizenCount = 0;
        int kpiCount = 0;
        for (final s in strategies) {
          annualCount += s.xMatrix.annuals.length;
          priorityCount += s.xMatrix.priorities.length;
          kaizenCount += s.kaizenBoard.items
              .where((i) => i.column.name != 'done')
              .length;
          kpiCount += s.bowlingChart.kpis.length;
        }

        final canCreate =
            subscription.canCreateStrategy(strategies.length);

        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              StatCardRow(stats: [
                StatData(
                    label: 'Annual Objectives',
                    value: '$annualCount',
                    color: MaestroColors.xWest),
                StatData(
                    label: 'Improvement Priorities',
                    value: '$priorityCount',
                    color: MaestroColors.xNorth),
                StatData(
                    label: 'Active Kaizen',
                    value: '$kaizenCount',
                    color: MaestroColors.kaizenDoing),
                StatData(
                    label: 'KPIs Tracked',
                    value: '$kpiCount',
                    color: MaestroColors.xEast),
              ]),
              const SizedBox(height: 24),
              Text(
                'Your Strategies',
                style: theme.textTheme.headlineSmall?.copyWith(
                  color: MaestroColors.text,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                userEmail ?? 'Anonymous',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: MaestroColors.muted,
                ),
              ),
              const SizedBox(height: 24),
              if (strategies.isEmpty)
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.lightbulb_outline,
                            size: 48, color: MaestroColors.muted),
                        const SizedBox(height: 16),
                        Text(
                          'Create your first strategy',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: MaestroColors.muted,
                          ),
                        ),
                        const SizedBox(height: 16),
                        GlassOutlinedButton(
                          onPressed: () =>
                              _showNewStrategyDialog(context, ref, orgId),
                          label: 'New Strategy',
                          leadingIcon: Icons.add,
                        ),
                      ],
                    ),
                  ),
                )
              else ...[
                Expanded(
                  child: ListView.separated(
                    itemCount: strategies.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final s = strategies[index];
                      return _StrategyCard(
                        name: s.name,
                        updatedAt: s.updatedAt,
                        onTap: () =>
                            context.go('/strategy/${orgId}:${s.id}/x-matrix'),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 16),
                GlassOutlinedButton(
                  onPressed: canCreate
                      ? () => _showNewStrategyDialog(context, ref, orgId)
                      : null,
                  label: 'New Strategy',
                  leadingIcon: Icons.add,
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  void _showNewStrategyDialog(
      BuildContext context, WidgetRef ref, String orgId) {
    final nameController = TextEditingController();
    GlassDialog.showCustom<void>(
      context,
      title: 'New Strategy',
      content: GlassTextField(
        controller: nameController,
        labelText: 'Strategy Name',
        hintText: 'e.g. FY2027 Hoshin Plan',
        autofocus: true,
      ),
      actions: [
        GlassTextButton(
          label: 'Cancel',
          onPressed: () => Navigator.pop(context),
        ),
        GlassFilledButton(
          label: 'Create',
          onPressed: () async {
            final name = nameController.text;
            Navigator.pop(context);
            if (name.isNotEmpty) {
              final service = ref.read(strategyServiceProvider);
              final now = DateTime.now();
              final docId = await service.createStrategy(
                orgId,
                StrategyDocument(
                  id: '',
                  orgId: orgId,
                  name: name,
                  createdAt: now,
                  updatedAt: now,
                ),
              );
              if (context.mounted) {
                context.go('/strategy/$orgId:$docId/x-matrix');
              }
            }
          },
        ),
      ],
    ).then((_) => nameController.dispose());
  }
}

class _StrategyCard extends StatelessWidget {
  final String name;
  final DateTime updatedAt;
  final VoidCallback onTap;

  const _StrategyCard({
    required this.name,
    required this.updatedAt,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onTap,
        child: GlassContainer(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: MaestroColors.accent.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.grid_view_rounded,
                    color: MaestroColors.accent),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: theme.textTheme.titleMedium?.copyWith(
                        color: MaestroColors.text,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Updated ${_timeAgo(updatedAt)}',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: MaestroColors.muted,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: MaestroColors.muted),
            ],
          ),
        ),
      ),
    );
  }

  String _timeAgo(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inHours < 1) return '${diff.inMinutes}m ago';
    if (diff.inDays < 1) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
