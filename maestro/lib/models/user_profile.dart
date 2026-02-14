/// User profile with organization membership.

import 'subscription.dart';

class UserProfile {
  final String uid;
  final String displayName;
  final String email;
  final String? lastActiveOrgId;
  final SubscriptionTier subscriptionTier;

  const UserProfile({
    required this.uid,
    this.displayName = '',
    this.email = '',
    this.lastActiveOrgId,
    this.subscriptionTier = SubscriptionTier.free,
  });

  UserProfile copyWith({
    String? uid,
    String? displayName,
    String? email,
    String? lastActiveOrgId,
    SubscriptionTier? subscriptionTier,
  }) =>
      UserProfile(
        uid: uid ?? this.uid,
        displayName: displayName ?? this.displayName,
        email: email ?? this.email,
        lastActiveOrgId: lastActiveOrgId ?? this.lastActiveOrgId,
        subscriptionTier: subscriptionTier ?? this.subscriptionTier,
      );

  Map<String, dynamic> toJson() => {
        'uid': uid,
        'displayName': displayName,
        'email': email,
        'lastActiveOrgId': lastActiveOrgId,
        'subscriptionTier': subscriptionTier.name,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        uid: json['uid'] as String? ?? '',
        displayName: json['displayName'] as String? ?? '',
        email: json['email'] as String? ?? '',
        lastActiveOrgId: json['lastActiveOrgId'] as String?,
        subscriptionTier: SubscriptionTier.values.firstWhere(
          (t) => t.name == json['subscriptionTier'],
          orElse: () => SubscriptionTier.free,
        ),
      );
}
