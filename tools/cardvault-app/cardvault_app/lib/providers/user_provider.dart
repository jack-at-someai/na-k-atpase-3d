import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/user_profile.dart';
import '../services/store_service.dart';
import 'auth_provider.dart';

/// Stream of the current user's profile from Firestore.
final userProfileProvider = StreamProvider<UserProfile?>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value(null);

  final service = ref.watch(storeServiceProvider);
  return service.watchProfile(user.uid);
});

/// Current user role — derived from profile.
final userRoleProvider = Provider<UserRole?>((ref) {
  final profile = ref.watch(userProfileProvider).valueOrNull;
  return profile?.role;
});

/// Whether the current user is a store owner.
final isOwnerProvider = Provider<bool>((ref) {
  return ref.watch(userRoleProvider) == UserRole.owner;
});

/// The store ID the current owner manages.
final ownerStoreIdProvider = Provider<String?>((ref) {
  final profile = ref.watch(userProfileProvider).valueOrNull;
  return profile?.storeId;
});
