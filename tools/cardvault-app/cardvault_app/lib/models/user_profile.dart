/// UserProfile — app user with role (customer or owner).

enum UserRole { customer, owner }

class UserProfile {
  final String uid;
  final String email;
  final String displayName;
  final UserRole role;
  final String? storeId; // Only for owners — which store they manage
  final double? latitude; // Customer location
  final double? longitude;
  final DateTime createdAt;

  const UserProfile({
    required this.uid,
    required this.email,
    this.displayName = '',
    this.role = UserRole.customer,
    this.storeId,
    this.latitude,
    this.longitude,
    required this.createdAt,
  });

  UserProfile copyWith({
    String? uid,
    String? email,
    String? displayName,
    UserRole? role,
    String? storeId,
    double? latitude,
    double? longitude,
    DateTime? createdAt,
  }) =>
      UserProfile(
        uid: uid ?? this.uid,
        email: email ?? this.email,
        displayName: displayName ?? this.displayName,
        role: role ?? this.role,
        storeId: storeId ?? this.storeId,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        createdAt: createdAt ?? this.createdAt,
      );

  Map<String, dynamic> toJson() => {
        'uid': uid,
        'email': email,
        'displayName': displayName,
        'role': role.name,
        'storeId': storeId,
        'latitude': latitude,
        'longitude': longitude,
        'createdAt': createdAt.toIso8601String(),
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        uid: json['uid'] as String? ?? '',
        email: json['email'] as String? ?? '',
        displayName: json['displayName'] as String? ?? '',
        role: UserRole.values.firstWhere(
          (r) => r.name == (json['role'] as String?),
          orElse: () => UserRole.customer,
        ),
        storeId: json['storeId'] as String?,
        latitude: (json['latitude'] as num?)?.toDouble(),
        longitude: (json['longitude'] as num?)?.toDouble(),
        createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ??
            DateTime.now(),
      );

  bool get isOwner => role == UserRole.owner;
  bool get isCustomer => role == UserRole.customer;
}
