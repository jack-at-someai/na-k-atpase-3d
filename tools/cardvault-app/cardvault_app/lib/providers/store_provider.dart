import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/store.dart';
import '../services/store_service.dart';

/// Stream of all stores.
final allStoresProvider = StreamProvider<List<Store>>((ref) {
  final service = ref.watch(storeServiceProvider);
  return service.watchAllStores();
});

/// Currently selected store ID (for customer browsing).
final selectedStoreIdProvider = StateProvider<String?>((ref) => null);

/// Watch a single store by ID.
final storeByIdProvider =
    StreamProvider.family<Store?, String>((ref, storeId) {
  final service = ref.watch(storeServiceProvider);
  return service.watchStore(storeId);
});

/// Stores sorted by distance from a given lat/lng.
final storesByDistanceProvider =
    Provider.family<List<Store>, ({double lat, double lng})>((ref, coords) {
  final stores = ref.watch(allStoresProvider).valueOrNull ?? [];
  final sorted = [...stores];
  sorted.sort(
      (a, b) => a.distanceTo(coords.lat, coords.lng)
          .compareTo(b.distanceTo(coords.lat, coords.lng)));
  return sorted;
});
