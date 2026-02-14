/// Store — a CardVault retail location.

import 'dart:math';

class Store {
  final String id;
  final String name;
  final String city;
  final String state;
  final String? venue;
  final String? address;
  final double latitude;
  final double longitude;
  final String status; // flagship, open, coming-soon
  final String ownerId; // Firebase Auth UID of the owner
  final DateTime createdAt;

  const Store({
    required this.id,
    required this.name,
    required this.city,
    required this.state,
    this.venue,
    this.address,
    required this.latitude,
    required this.longitude,
    this.status = 'open',
    required this.ownerId,
    required this.createdAt,
  });

  Store copyWith({
    String? id,
    String? name,
    String? city,
    String? state,
    String? venue,
    String? address,
    double? latitude,
    double? longitude,
    String? status,
    String? ownerId,
    DateTime? createdAt,
  }) =>
      Store(
        id: id ?? this.id,
        name: name ?? this.name,
        city: city ?? this.city,
        state: state ?? this.state,
        venue: venue ?? this.venue,
        address: address ?? this.address,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        status: status ?? this.status,
        ownerId: ownerId ?? this.ownerId,
        createdAt: createdAt ?? this.createdAt,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'city': city,
        'state': state,
        'venue': venue,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'status': status,
        'ownerId': ownerId,
        'createdAt': createdAt.toIso8601String(),
      };

  factory Store.fromJson(Map<String, dynamic> json) => Store(
        id: json['id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        city: json['city'] as String? ?? '',
        state: json['state'] as String? ?? '',
        venue: json['venue'] as String?,
        address: json['address'] as String?,
        latitude: (json['latitude'] as num?)?.toDouble() ?? 0,
        longitude: (json['longitude'] as num?)?.toDouble() ?? 0,
        status: json['status'] as String? ?? 'open',
        ownerId: json['ownerId'] as String? ?? '',
        createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ??
            DateTime.now(),
      );

  String get displayName => venue != null ? '$name - $venue' : name;

  String get locationLabel => '$city, $state';

  /// Haversine distance in miles to a given lat/lng.
  double distanceTo(double lat, double lng) {
    const r = 3958.8; // Earth radius in miles
    final dLat = _toRad(lat - latitude);
    final dLng = _toRad(lng - longitude);
    final a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_toRad(latitude)) *
            cos(_toRad(lat)) *
            sin(dLng / 2) *
            sin(dLng / 2);
    final c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return r * c;
  }

  static double _toRad(double deg) => deg * (pi / 180);
}
