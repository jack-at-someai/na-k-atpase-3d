/// Subscription tiers and entitlement checks.

enum SubscriptionTier { free, individual, team, enterprise }

class SubscriptionInfo {
  final SubscriptionTier tier;
  final bool isActive;
  final DateTime? expiresAt;
  final String? productId;

  const SubscriptionInfo({
    this.tier = SubscriptionTier.free,
    this.isActive = false,
    this.expiresAt,
    this.productId,
  });

  /// Max strategies allowed for this tier.
  int get maxStrategies => switch (tier) {
        SubscriptionTier.free => 1,
        SubscriptionTier.individual => 5,
        SubscriptionTier.team => 25,
        SubscriptionTier.enterprise => -1, // unlimited
      };

  /// Max team members for this tier.
  int get maxMembers => switch (tier) {
        SubscriptionTier.free => 1,
        SubscriptionTier.individual => 1,
        SubscriptionTier.team => 5,
        SubscriptionTier.enterprise => -1, // unlimited
      };

  /// Whether the user can create new strategies.
  bool canCreateStrategy(int currentCount) {
    if (!isActive && tier != SubscriptionTier.free) return false;
    if (maxStrategies < 0) return true;
    return currentCount < maxStrategies;
  }

  /// Whether the user can edit (not just view).
  bool get canEdit => tier != SubscriptionTier.free || isActive;

  /// Display name for the tier.
  String get tierName => switch (tier) {
        SubscriptionTier.free => 'Free',
        SubscriptionTier.individual => 'Individual',
        SubscriptionTier.team => 'Team',
        SubscriptionTier.enterprise => 'Enterprise',
      };

  /// Monthly price string.
  String get priceLabel => switch (tier) {
        SubscriptionTier.free => 'Free',
        SubscriptionTier.individual => '\$25/mo',
        SubscriptionTier.team => '\$49/mo',
        SubscriptionTier.enterprise => '\$99/mo',
      };

  Map<String, dynamic> toJson() => {
        'tier': tier.name,
        'isActive': isActive,
        'expiresAt': expiresAt?.toIso8601String(),
        'productId': productId,
      };

  factory SubscriptionInfo.fromJson(Map<String, dynamic> json) =>
      SubscriptionInfo(
        tier: SubscriptionTier.values.firstWhere(
          (t) => t.name == json['tier'],
          orElse: () => SubscriptionTier.free,
        ),
        isActive: json['isActive'] as bool? ?? false,
        expiresAt: json['expiresAt'] != null
            ? DateTime.tryParse(json['expiresAt'] as String)
            : null,
        productId: json['productId'] as String?,
      );
}

/// RevenueCat product identifiers.
class MaestroProducts {
  MaestroProducts._();

  static const individualMonthly = 'maestro_individual_monthly';
  static const teamMonthly = 'maestro_team_monthly';
  static const enterpriseMonthly = 'maestro_enterprise_monthly';

  static SubscriptionTier tierFromProductId(String productId) {
    return switch (productId) {
      individualMonthly => SubscriptionTier.individual,
      teamMonthly => SubscriptionTier.team,
      enterpriseMonthly => SubscriptionTier.enterprise,
      _ => SubscriptionTier.free,
    };
  }
}
