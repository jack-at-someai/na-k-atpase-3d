import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/store.dart';
import '../models/user_profile.dart';

final storeServiceProvider = Provider<StoreService>((ref) => StoreService());

class StoreService {
  final _db = FirebaseFirestore.instance;

  CollectionReference<Map<String, dynamic>> get _storesRef =>
      _db.collection('stores');

  CollectionReference<Map<String, dynamic>> get _usersRef =>
      _db.collection('users');

  // ---------------------------------------------------------------------------
  // Store CRUD
  // ---------------------------------------------------------------------------

  /// Watch all stores.
  Stream<List<Store>> watchAllStores() {
    return _storesRef.snapshots().map((snap) => snap.docs.map((doc) {
          final data = doc.data();
          data['id'] = doc.id;
          return Store.fromJson(data);
        }).toList());
  }

  /// Watch a single store.
  Stream<Store?> watchStore(String storeId) {
    return _storesRef.doc(storeId).snapshots().map((snap) {
      if (!snap.exists) return null;
      final data = snap.data()!;
      data['id'] = snap.id;
      return Store.fromJson(data);
    });
  }

  /// Create a new store.
  Future<String> createStore(Store store) async {
    final json = store.toJson();
    json.remove('id');
    final ref = await _storesRef.add(json);
    return ref.id;
  }

  /// Update a store.
  Future<void> updateStore(Store store) {
    final json = store.toJson();
    json.remove('id');
    return _storesRef.doc(store.id).update(json);
  }

  // ---------------------------------------------------------------------------
  // User Profile
  // ---------------------------------------------------------------------------

  /// Get or create a user profile.
  Future<UserProfile> getOrCreateProfile(String uid, String email) async {
    final doc = await _usersRef.doc(uid).get();
    if (doc.exists) {
      final data = doc.data()!;
      data['uid'] = uid;
      return UserProfile.fromJson(data);
    }
    // Create default customer profile
    final profile = UserProfile(
      uid: uid,
      email: email,
      createdAt: DateTime.now(),
    );
    await _usersRef.doc(uid).set(profile.toJson());
    return profile;
  }

  /// Watch a user profile.
  Stream<UserProfile?> watchProfile(String uid) {
    return _usersRef.doc(uid).snapshots().map((snap) {
      if (!snap.exists) return null;
      final data = snap.data()!;
      data['uid'] = snap.id;
      return UserProfile.fromJson(data);
    });
  }

  /// Update user profile.
  Future<void> updateProfile(UserProfile profile) {
    return _usersRef.doc(profile.uid).update(profile.toJson());
  }

  /// Set user role (admin function).
  Future<void> setUserRole(String uid, UserRole role, {String? storeId}) {
    return _usersRef.doc(uid).update({
      'role': role.name,
      if (storeId != null) 'storeId': storeId,
    });
  }
}
