// Charlotte Substrate - Fact Model
//
// Everything is a FACT. This is the base structure for all data in Charlotte.
// See docs/SUBSTRATE.md for full architecture documentation.

/// The five types of facts in the substrate.
enum FactType {
  node,
  edge,
  metric,
  signal,
  protocol,
}

/// Extension to convert FactType to/from string for Firestore.
extension FactTypeExtension on FactType {
  String get value {
    switch (this) {
      case FactType.node:
        return 'NODE';
      case FactType.edge:
        return 'EDGE';
      case FactType.metric:
        return 'METRIC';
      case FactType.signal:
        return 'SIGNAL';
      case FactType.protocol:
        return 'PROTOCOL';
    }
  }

  static FactType fromString(String value) {
    switch (value.toUpperCase()) {
      case 'NODE':
        return FactType.node;
      case 'EDGE':
        return FactType.edge;
      case 'METRIC':
        return FactType.metric;
      case 'SIGNAL':
        return FactType.signal;
      case 'PROTOCOL':
        return FactType.protocol;
      default:
        throw ArgumentError('Unknown FactType: $value');
    }
  }
}

/// Base FACT structure.
///
/// All data in Charlotte is stored as FACTs with register-based structure.
/// Think of this as an instruction in a virtual machine.
///
/// Core registers (present on all facts):
/// - :ID      → Unique identifier
/// - :TYPE    → One of NODE, EDGE, METRIC, SIGNAL, PROTOCOL
/// - :CREATED → Temporal node reference (DATE node ID)
///
/// Positional registers (type-specific):
/// - P0, P1, P2, P3, ...
class Fact {
  /// Unique identifier for this fact.
  final String id;

  /// The type of fact.
  final FactType type;

  /// Temporal node reference (DATE node ID, not a timestamp).
  final String created;

  /// Positional registers - type-specific data.
  /// P0, P1, P2, P3, etc.
  final Map<String, dynamic> registers;

  const Fact({
    required this.id,
    required this.type,
    required this.created,
    this.registers = const {},
  });

  /// Get a positional register value.
  dynamic operator [](String key) => registers[key];

  /// Convenience getters for common registers.
  dynamic get p0 => registers['P0'];
  dynamic get p1 => registers['P1'];
  dynamic get p2 => registers['P2'];
  dynamic get p3 => registers['P3'];
  dynamic get p4 => registers['P4'];
  dynamic get p5 => registers['P5'];

  /// Convert to Firestore document.
  Map<String, dynamic> toFirestore() {
    return {
      ':ID': id,
      ':TYPE': type.value,
      ':CREATED': created,
      ...registers,
    };
  }

  /// Create from Firestore document.
  factory Fact.fromFirestore(Map<String, dynamic> data) {
    final id = data[':ID'] as String;
    final type = FactTypeExtension.fromString(data[':TYPE'] as String);
    final created = data[':CREATED'] as String;

    // Extract positional registers (everything that's not a core field)
    final registers = <String, dynamic>{};
    for (final entry in data.entries) {
      if (!entry.key.startsWith(':')) {
        registers[entry.key] = entry.value;
      }
    }

    return Fact(
      id: id,
      type: type,
      created: created,
      registers: registers,
    );
  }

  @override
  String toString() => 'Fact(${type.value}, $id)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is Fact && id == other.id;

  @override
  int get hashCode => id.hashCode;
}

// =============================================================================
// TYPE-SPECIFIC FACT CONSTRUCTORS
// =============================================================================

/// NODE fact - declares an entity exists.
///
/// Registers:
/// - P0: category (e.g., "PERSON", "CHAT", "MESSAGE", "DATE", "TIME")
class NodeFact extends Fact {
  NodeFact({
    required super.id,
    required super.created,
    required String category,
    Map<String, dynamic> extra = const {},
  }) : super(
          type: FactType.node,
          registers: {'P0': category, ...extra},
        );

  String get category => p0 as String;

  factory NodeFact.fromFact(Fact fact) {
    assert(fact.type == FactType.node);
    return NodeFact(
      id: fact.id,
      created: fact.created,
      category: fact.p0 as String,
      extra: Map.from(fact.registers)..remove('P0'),
    );
  }
}

/// EDGE fact - connects two nodes.
///
/// Registers:
/// - P0: from node ID
/// - P1: to node ID
/// - P2: edge type (e.g., "OWNS", "LOCATED_IN", "NEXT", "PREV")
class EdgeFact extends Fact {
  EdgeFact({
    required super.id,
    required super.created,
    required String fromNode,
    required String toNode,
    required String edgeType,
    Map<String, dynamic> extra = const {},
  }) : super(
          type: FactType.edge,
          registers: {'P0': fromNode, 'P1': toNode, 'P2': edgeType, ...extra},
        );

  String get fromNode => p0 as String;
  String get toNode => p1 as String;
  String get edgeType => p2 as String;

  factory EdgeFact.fromFact(Fact fact) {
    assert(fact.type == FactType.edge);
    return EdgeFact(
      id: fact.id,
      created: fact.created,
      fromNode: fact.p0 as String,
      toNode: fact.p1 as String,
      edgeType: fact.p2 as String,
      extra: Map.from(fact.registers)
        ..remove('P0')
        ..remove('P1')
        ..remove('P2'),
    );
  }
}

/// METRIC fact - defines what can be measured on a node.
///
/// Registers:
/// - P0: node ID this metric belongs to
/// - P1: value type (STRING, NUMBER, BOOLEAN, etc.)
/// - P2: label/name
/// - P3: constraints (optional - min, max, enum values, etc.)
class MetricFact extends Fact {
  MetricFact({
    required super.id,
    required super.created,
    required String nodeId,
    required String valueType,
    required String label,
    Map<String, dynamic>? constraints,
    Map<String, dynamic> extra = const {},
  }) : super(
          type: FactType.metric,
          registers: {
            'P0': nodeId,
            'P1': valueType,
            'P2': label,
            if (constraints != null) 'P3': constraints,
            ...extra,
          },
        );

  String get nodeId => p0 as String;
  String get valueType => p1 as String;
  String get label => p2 as String;
  Map<String, dynamic>? get constraints => p3 as Map<String, dynamic>?;

  factory MetricFact.fromFact(Fact fact) {
    assert(fact.type == FactType.metric);
    return MetricFact(
      id: fact.id,
      created: fact.created,
      nodeId: fact.p0 as String,
      valueType: fact.p1 as String,
      label: fact.p2 as String,
      constraints: fact.p3 as Map<String, dynamic>?,
      extra: Map.from(fact.registers)
        ..remove('P0')
        ..remove('P1')
        ..remove('P2')
        ..remove('P3'),
    );
  }
}

/// SIGNAL fact - records a measurement value.
///
/// Registers:
/// - P0: node ID
/// - P1: metric ID
/// - P2: value (interpreted by metric's value type)
/// - P3: protocol ID (optional - if created by a protocol)
class SignalFact extends Fact {
  SignalFact({
    required super.id,
    required super.created,
    required String nodeId,
    required String metricId,
    required dynamic value,
    String? protocolId,
    Map<String, dynamic> extra = const {},
  }) : super(
          type: FactType.signal,
          registers: {
            'P0': nodeId,
            'P1': metricId,
            'P2': value,
            if (protocolId != null) 'P3': protocolId,
            ...extra,
          },
        );

  String get nodeId => p0 as String;
  String get metricId => p1 as String;
  dynamic get value => p2;
  String? get protocolId => p3 as String?;

  factory SignalFact.fromFact(Fact fact) {
    assert(fact.type == FactType.signal);
    return SignalFact(
      id: fact.id,
      created: fact.created,
      nodeId: fact.p0 as String,
      metricId: fact.p1 as String,
      value: fact.p2,
      protocolId: fact.p3 as String?,
      extra: Map.from(fact.registers)
        ..remove('P0')
        ..remove('P1')
        ..remove('P2')
        ..remove('P3'),
    );
  }
}

/// PROTOCOL fact - agent-generated behavior plan.
///
/// Registers:
/// - P0: node ID this protocol applies to
/// - P1: schedule definition
/// - P2: requirements (optional - proposed nodes, edges, metrics, signals)
class ProtocolFact extends Fact {
  ProtocolFact({
    required super.id,
    required super.created,
    required String nodeId,
    required Map<String, dynamic> schedule,
    Map<String, dynamic>? requirements,
    Map<String, dynamic> extra = const {},
  }) : super(
          type: FactType.protocol,
          registers: {
            'P0': nodeId,
            'P1': schedule,
            if (requirements != null) 'P2': requirements,
            ...extra,
          },
        );

  String get nodeId => p0 as String;
  Map<String, dynamic> get schedule => p1 as Map<String, dynamic>;
  Map<String, dynamic>? get requirements => p2 as Map<String, dynamic>?;

  factory ProtocolFact.fromFact(Fact fact) {
    assert(fact.type == FactType.protocol);
    return ProtocolFact(
      id: fact.id,
      created: fact.created,
      nodeId: fact.p0 as String,
      schedule: fact.p1 as Map<String, dynamic>,
      requirements: fact.p2 as Map<String, dynamic>?,
      extra: Map.from(fact.registers)
        ..remove('P0')
        ..remove('P1')
        ..remove('P2'),
    );
  }
}

// =============================================================================
// TEMPORAL HELPERS
// =============================================================================

/// Generate a DATE node ID from a DateTime.
String dateNodeId(DateTime dt) {
  return 'DATE:${dt.month}-${dt.day}-${dt.year}';
}

/// Generate a TIME node ID from a DateTime (minutes after midnight).
String timeNodeId(DateTime dt) {
  final minutes = dt.hour * 60 + dt.minute;
  return 'TIME:$minutes';
}

/// Parse a DATE node ID back to its components.
/// Returns (month, day, year) or null if invalid.
(int, int, int)? parseDateNodeId(String id) {
  if (!id.startsWith('DATE:')) return null;
  final parts = id.substring(5).split('-');
  if (parts.length != 3) return null;
  try {
    return (int.parse(parts[0]), int.parse(parts[1]), int.parse(parts[2]));
  } catch (_) {
    return null;
  }
}

/// Parse a TIME node ID back to minutes after midnight.
int? parseTimeNodeId(String id) {
  if (!id.startsWith('TIME:')) return null;
  try {
    return int.parse(id.substring(5));
  } catch (_) {
    return null;
  }
}
