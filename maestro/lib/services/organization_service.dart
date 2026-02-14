import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/organization.dart';

final organizationServiceProvider =
    Provider<OrganizationService>((ref) => OrganizationService());

class OrganizationService {
  final _db = FirebaseFirestore.instance;

  CollectionReference<Map<String, dynamic>> get _orgsRef =>
      _db.collection('organizations');

  /// Create a new organization.
  Future<String> createOrganization({
    required String name,
    required String ownerId,
  }) async {
    final ref = await _orgsRef.add({
      'name': name,
      'ownerId': ownerId,
      'plan': 'free',
      'memberCount': 1,
    });
    // Add owner as admin member
    await _orgsRef.doc(ref.id).collection('members').doc(ownerId).set({
      'userId': ownerId,
      'role': OrgRole.admin.name,
      'joinedAt': DateTime.now().toIso8601String(),
    });
    return ref.id;
  }

  /// Watch organizations the user is a member of.
  Stream<List<Organization>> watchUserOrgs(String userId) {
    return _db
        .collectionGroup('members')
        .where('userId', isEqualTo: userId)
        .snapshots()
        .asyncMap((snap) async {
      final orgs = <Organization>[];
      for (final doc in snap.docs) {
        final orgRef = doc.reference.parent.parent;
        if (orgRef == null) continue;
        final orgSnap = await orgRef.get();
        if (orgSnap.exists) {
          final data = orgSnap.data() as Map<String, dynamic>;
          data['id'] = orgSnap.id;
          orgs.add(Organization.fromJson(data));
        }
      }
      return orgs;
    });
  }

  /// Get members of an organization.
  Stream<List<OrgMember>> watchMembers(String orgId) {
    return _orgsRef
        .doc(orgId)
        .collection('members')
        .snapshots()
        .map((snap) => snap.docs.map((doc) {
              final data = doc.data();
              data['userId'] = doc.id;
              return OrgMember.fromJson(data);
            }).toList());
  }

  /// Invite a user by email.
  Future<void> inviteMember({
    required String orgId,
    required String email,
    required OrgRole role,
  }) {
    return _orgsRef.doc(orgId).collection('invites').add({
      'email': email,
      'role': role.name,
      'expiresAt':
          DateTime.now().add(const Duration(days: 7)).toIso8601String(),
    });
  }

  /// Remove a member.
  Future<void> removeMember(String orgId, String userId) {
    return _orgsRef.doc(orgId).collection('members').doc(userId).delete();
  }
}
