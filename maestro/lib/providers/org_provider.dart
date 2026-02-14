import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/organization.dart';
import '../services/organization_service.dart';
import 'auth_provider.dart';

/// Auto-creates an org on first sign-in. Returns the user's active org.
final activeOrgProvider = FutureProvider<Organization?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  final orgService = ref.read(organizationServiceProvider);
  final orgs = await orgService.watchUserOrgs(user.uid).first;
  if (orgs.isNotEmpty) return orgs.first;

  // Auto-create personal org
  final name = "${user.displayName ?? 'My'}'s Organization";
  final orgId = await orgService.createOrganization(
    name: name,
    ownerId: user.uid,
  );
  return Organization(id: orgId, name: name, ownerId: user.uid);
});
