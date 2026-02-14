/// Organization — multi-tenant container for teams using Maestro.

enum OrgRole { admin, editor, viewer }

class Organization {
  final String id;
  final String name;
  final String ownerId;
  final String plan; // subscription tier id
  final int memberCount;

  const Organization({
    required this.id,
    required this.name,
    required this.ownerId,
    this.plan = 'free',
    this.memberCount = 1,
  });

  Organization copyWith({
    String? id,
    String? name,
    String? ownerId,
    String? plan,
    int? memberCount,
  }) =>
      Organization(
        id: id ?? this.id,
        name: name ?? this.name,
        ownerId: ownerId ?? this.ownerId,
        plan: plan ?? this.plan,
        memberCount: memberCount ?? this.memberCount,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'ownerId': ownerId,
        'plan': plan,
        'memberCount': memberCount,
      };

  factory Organization.fromJson(Map<String, dynamic> json) => Organization(
        id: json['id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        ownerId: json['ownerId'] as String? ?? '',
        plan: json['plan'] as String? ?? 'free',
        memberCount: json['memberCount'] as int? ?? 1,
      );
}

class OrgMember {
  final String userId;
  final String displayName;
  final String email;
  final OrgRole role;
  final DateTime joinedAt;

  const OrgMember({
    required this.userId,
    required this.displayName,
    required this.email,
    required this.role,
    required this.joinedAt,
  });

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'displayName': displayName,
        'email': email,
        'role': role.name,
        'joinedAt': joinedAt.toIso8601String(),
      };

  factory OrgMember.fromJson(Map<String, dynamic> json) => OrgMember(
        userId: json['userId'] as String? ?? '',
        displayName: json['displayName'] as String? ?? '',
        email: json['email'] as String? ?? '',
        role: OrgRole.values.firstWhere(
          (r) => r.name == json['role'],
          orElse: () => OrgRole.viewer,
        ),
        joinedAt: DateTime.tryParse(json['joinedAt'] as String? ?? '') ??
            DateTime.now(),
      );
}

class OrgInvite {
  final String id;
  final String email;
  final OrgRole role;
  final DateTime expiresAt;

  const OrgInvite({
    required this.id,
    required this.email,
    required this.role,
    required this.expiresAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'role': role.name,
        'expiresAt': expiresAt.toIso8601String(),
      };

  factory OrgInvite.fromJson(Map<String, dynamic> json) => OrgInvite(
        id: json['id'] as String? ?? '',
        email: json['email'] as String? ?? '',
        role: OrgRole.values.firstWhere(
          (r) => r.name == json['role'],
          orElse: () => OrgRole.viewer,
        ),
        expiresAt: DateTime.tryParse(json['expiresAt'] as String? ?? '') ??
            DateTime.now().add(const Duration(days: 7)),
      );
}
