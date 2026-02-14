/// X-Matrix — the core Hoshin Kanri strategy deployment artifact.
/// Four quadrants + three correlation matrices connect vision to execution.

class XMatrix {
  final String vision;
  final List<String> breakthroughs; // South — 3-Year Horizon
  final List<String> annuals; // West  — Annual Objectives
  final List<String> priorities; // North — Improvement Priorities
  final List<MetricEntry> metrics; // East  — Targets/KPIs
  final List<List<int>> corrSW; // annuals ↔ breakthroughs
  final List<List<int>> corrNW; // priorities ↔ breakthroughs
  final List<List<int>> corrNE; // metrics ↔ priorities

  const XMatrix({
    this.vision = '',
    this.breakthroughs = const [],
    this.annuals = const [],
    this.priorities = const [],
    this.metrics = const [],
    this.corrSW = const [],
    this.corrNW = const [],
    this.corrNE = const [],
  });

  XMatrix copyWith({
    String? vision,
    List<String>? breakthroughs,
    List<String>? annuals,
    List<String>? priorities,
    List<MetricEntry>? metrics,
    List<List<int>>? corrSW,
    List<List<int>>? corrNW,
    List<List<int>>? corrNE,
  }) {
    return XMatrix(
      vision: vision ?? this.vision,
      breakthroughs: breakthroughs ?? this.breakthroughs,
      annuals: annuals ?? this.annuals,
      priorities: priorities ?? this.priorities,
      metrics: metrics ?? this.metrics,
      corrSW: corrSW ?? this.corrSW,
      corrNW: corrNW ?? this.corrNW,
      corrNE: corrNE ?? this.corrNE,
    );
  }

  Map<String, dynamic> toJson() => {
        'vision': vision,
        'breakthroughs': breakthroughs,
        'annuals': annuals,
        'priorities': priorities,
        'metrics': metrics.map((m) => m.toJson()).toList(),
        'corrSW': corrSW.map((r) => List<int>.from(r)).toList(),
        'corrNW': corrNW.map((r) => List<int>.from(r)).toList(),
        'corrNE': corrNE.map((r) => List<int>.from(r)).toList(),
      };

  factory XMatrix.fromJson(Map<String, dynamic> json) => XMatrix(
        vision: json['vision'] as String? ?? '',
        breakthroughs: List<String>.from(json['breakthroughs'] ?? []),
        annuals: List<String>.from(json['annuals'] ?? []),
        priorities: List<String>.from(json['priorities'] ?? []),
        metrics: (json['metrics'] as List?)
                ?.map((m) => MetricEntry.fromJson(m as Map<String, dynamic>))
                .toList() ??
            [],
        corrSW: (json['corrSW'] as List?)
                ?.map((r) => List<int>.from(r as List))
                .toList() ??
            [],
        corrNW: (json['corrNW'] as List?)
                ?.map((r) => List<int>.from(r as List))
                .toList() ??
            [],
        corrNE: (json['corrNE'] as List?)
                ?.map((r) => List<int>.from(r as List))
                .toList() ??
            [],
      );

  /// Build empty correlation matrices sized to current item counts.
  XMatrix withResizedCorrelations() {
    return copyWith(
      corrSW: _resize(corrSW, annuals.length, breakthroughs.length),
      corrNW: _resize(corrNW, priorities.length, breakthroughs.length),
      corrNE: _resize(corrNE, metrics.length, priorities.length),
    );
  }

  static List<List<int>> _resize(
      List<List<int>> old, int rows, int cols) {
    return List.generate(rows, (r) {
      return List.generate(cols, (c) {
        if (r < old.length && c < old[r].length) return old[r][c];
        return 0;
      });
    });
  }

  /// Sample data matching the JS prototype defaults.
  factory XMatrix.sample() => XMatrix(
        vision: 'Become the industry leader in sustainable manufacturing',
        breakthroughs: [
          'Zero waste production by 2027',
          'Digital twin for all product lines',
          '50% reduction in lead time',
        ],
        annuals: [
          'Implement lean value streams',
          'Deploy IoT sensor network',
          'Launch continuous improvement program',
          'Achieve ISO 14001 certification',
        ],
        priorities: [
          'Standardize work processes',
          'Real-time quality monitoring',
          'Cross-functional kaizen teams',
        ],
        metrics: [
          MetricEntry(name: 'OEE', owner: 'VP Operations'),
          MetricEntry(name: 'Defect Rate (ppm)', owner: 'Quality Dir'),
          MetricEntry(name: 'Lead Time (days)', owner: 'VP Supply Chain'),
          MetricEntry(name: 'Employee Suggestions/mo', owner: 'HR Dir'),
        ],
        corrSW: [
          [3, 2, 1],
          [1, 3, 2],
          [2, 1, 3],
          [1, 2, 1],
        ],
        corrNW: [
          [3, 1, 2],
          [1, 3, 1],
          [2, 2, 3],
        ],
        corrNE: [
          [3, 2, 1],
          [1, 3, 2],
          [2, 1, 3],
          [1, 1, 2],
        ],
      );
}

class MetricEntry {
  final String name;
  final String owner;

  const MetricEntry({required this.name, required this.owner});

  MetricEntry copyWith({String? name, String? owner}) =>
      MetricEntry(name: name ?? this.name, owner: owner ?? this.owner);

  Map<String, dynamic> toJson() => {'name': name, 'owner': owner};

  factory MetricEntry.fromJson(Map<String, dynamic> json) => MetricEntry(
        name: json['name'] as String? ?? '',
        owner: json['owner'] as String? ?? '',
      );
}
