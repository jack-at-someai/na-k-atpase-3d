import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

import '../models/subscription.dart';
import '../providers/subscription_provider.dart';

final subscriptionServiceProvider =
    Provider<SubscriptionService>((ref) => SubscriptionService(ref));

class SubscriptionService {
  final Ref _ref;

  SubscriptionService(this._ref);

  /// Initialize RevenueCat SDK.
  Future<void> init(String userId) async {
    try {
      await Purchases.setLogLevel(LogLevel.debug);
      // TODO: Replace with actual RevenueCat API key
      final config = PurchasesConfiguration('revcat_api_key_placeholder')
        ..appUserID = userId;
      await Purchases.configure(config);
      await _syncSubscriptionState();
    } catch (e) {
      debugPrint('RevenueCat init error: $e');
    }
  }

  /// Purchase a subscription product.
  Future<bool> purchase(String productId) async {
    try {
      final offerings = await Purchases.getOfferings();
      final packages = offerings.current?.availablePackages ?? [];
      final pkg = packages.firstWhere(
        (p) => p.storeProduct.identifier == productId,
      );
      await Purchases.purchasePackage(pkg);
      await _syncSubscriptionState();
      return true;
    } catch (e) {
      debugPrint('Purchase error: $e');
      return false;
    }
  }

  /// Restore previous purchases.
  Future<void> restore() async {
    try {
      await Purchases.restorePurchases();
      await _syncSubscriptionState();
    } catch (e) {
      debugPrint('Restore error: $e');
    }
  }

  /// Sync RevenueCat entitlements to local state.
  Future<void> _syncSubscriptionState() async {
    try {
      final info = await Purchases.getCustomerInfo();
      final entitlement = info.entitlements.active['maestro_pro'];
      if (entitlement != null) {
        final tier =
            MaestroProducts.tierFromProductId(entitlement.productIdentifier);
        _ref.read(subscriptionProvider.notifier).state = SubscriptionInfo(
          tier: tier,
          isActive: true,
          expiresAt: entitlement.expirationDate != null
              ? DateTime.tryParse(entitlement.expirationDate!)
              : null,
          productId: entitlement.productIdentifier,
        );
      }
    } catch (e) {
      debugPrint('Sync subscription error: $e');
    }
  }
}
