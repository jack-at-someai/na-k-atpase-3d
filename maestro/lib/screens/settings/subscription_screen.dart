import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/subscription.dart';
import '../../providers/subscription_provider.dart';
import '../../services/subscription_service.dart';
import '../../theme/maestro_colors.dart';

class SubscriptionScreen extends ConsumerWidget {
  const SubscriptionScreen({super.key});

  static const _tiers = [
    (
      tier: SubscriptionTier.free,
      name: 'Free',
      price: '\$0',
      features: ['1 strategy', 'View only', 'Single user'],
    ),
    (
      tier: SubscriptionTier.individual,
      name: 'Individual',
      price: '\$25/mo',
      features: ['5 strategies', 'Full editing', 'Single user', 'Export PDF'],
    ),
    (
      tier: SubscriptionTier.team,
      name: 'Team',
      price: '\$49/mo',
      features: ['25 strategies', 'Full editing', 'Up to 5 members', 'Real-time collaboration', 'Export PDF'],
    ),
    (
      tier: SubscriptionTier.enterprise,
      name: 'Enterprise',
      price: '\$99/mo',
      features: ['Unlimited strategies', 'Full editing', 'Unlimited members', 'Real-time collaboration', 'Export PDF', 'Priority support'],
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final current = ref.watch(subscriptionProvider);
    final subService = ref.read(subscriptionServiceProvider);
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: MaestroColors.background,
      appBar: GlassAppBar(
        showBackButton: true,
        title: 'Subscription',
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Current Plan: ${current.tierName}',
              style: theme.textTheme.headlineSmall
                  ?.copyWith(color: MaestroColors.text),
            ),
            const SizedBox(height: 24),
            LayoutBuilder(
              builder: (context, constraints) {
                final columns = constraints.maxWidth > 900
                    ? 4
                    : constraints.maxWidth > 600
                        ? 2
                        : 1;
                final cardWidth =
                    (constraints.maxWidth - 16 * (columns - 1)) / columns;

                return Wrap(
                  spacing: 16,
                  runSpacing: 16,
                  children: _tiers.map((t) {
                    final isCurrentTier = t.tier == current.tier;
                    return SizedBox(
                      width: cardWidth,
                      child: GlassContainer(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              t.name,
                              style: TextStyle(
                                color: isCurrentTier
                                    ? MaestroColors.accent
                                    : MaestroColors.text,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              t.price,
                              style: TextStyle(
                                color: MaestroColors.accentBright,
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ...t.features.map((f) => Padding(
                                  padding: const EdgeInsets.only(bottom: 6),
                                  child: Row(
                                    children: [
                                      Icon(Icons.check,
                                          size: 14,
                                          color: MaestroColors.accent),
                                      const SizedBox(width: 8),
                                      Text(f,
                                          style: TextStyle(
                                              color: MaestroColors.text,
                                              fontSize: 12)),
                                    ],
                                  ),
                                )),
                            const SizedBox(height: 16),
                            if (isCurrentTier)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: MaestroColors.accent
                                      .withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text('Current Plan',
                                    style: TextStyle(
                                        color: MaestroColors.accent,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600)),
                              )
                            else if (t.tier != SubscriptionTier.free)
                              GlassFilledButton(
                                onPressed: () {
                                  final productId = switch (t.tier) {
                                    SubscriptionTier.individual =>
                                      MaestroProducts.individualMonthly,
                                    SubscriptionTier.team =>
                                      MaestroProducts.teamMonthly,
                                    SubscriptionTier.enterprise =>
                                      MaestroProducts.enterpriseMonthly,
                                    _ => '',
                                  };
                                  if (productId.isNotEmpty) {
                                    subService.purchase(productId);
                                  }
                                },
                                label: 'Subscribe',
                              ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                );
              },
            ),
            const SizedBox(height: 24),
            Center(
              child: GlassTextButton(
                onPressed: () => subService.restore(),
                label: 'Restore Purchases',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
