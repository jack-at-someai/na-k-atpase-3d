import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/subscription.dart';

/// Current user's subscription info.
final subscriptionProvider = StateProvider<SubscriptionInfo>((ref) {
  return const SubscriptionInfo(); // Default: free tier
});
