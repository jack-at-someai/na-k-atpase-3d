/// Bowling Chart — monthly KPI tracking with RAG status.

enum RagStatus { green, yellow, red, none }

enum KpiDirection { up, down }

class BowlingChart {
  final int year;
  final List<KPI> kpis;

  const BowlingChart({
    required this.year,
    this.kpis = const [],
  });

  BowlingChart copyWith({int? year, List<KPI>? kpis}) => BowlingChart(
        year: year ?? this.year,
        kpis: kpis ?? this.kpis,
      );

  Map<String, dynamic> toJson() => {
        'year': year,
        'kpis': kpis.map((k) => k.toJson()).toList(),
      };

  factory BowlingChart.fromJson(Map<String, dynamic> json) => BowlingChart(
        year: json['year'] as int? ?? DateTime.now().year,
        kpis: (json['kpis'] as List?)
                ?.map((k) => KPI.fromJson(k as Map<String, dynamic>))
                .toList() ??
            [],
      );

  factory BowlingChart.sample() => BowlingChart(
        year: 2026,
        kpis: [
          KPI(
            name: 'OEE',
            unit: '%',
            baseline: 72,
            direction: KpiDirection.up,
            owner: 'VP Operations',
            threshold: 3,
            targets: [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85],
            actuals: [73.5, 75.2, 76.8, null, null, null, null, null, null, null, null, null],
          ),
          KPI(
            name: 'Defect Rate',
            unit: 'ppm',
            baseline: 4500,
            direction: KpiDirection.down,
            owner: 'Quality Dir',
            threshold: 200,
            targets: [4200, 4000, 3800, 3600, 3400, 3200, 3000, 2800, 2600, 2400, 2200, 2000],
            actuals: [4300, 3900, 3700, null, null, null, null, null, null, null, null, null],
          ),
          KPI(
            name: 'Lead Time',
            unit: 'days',
            baseline: 14,
            direction: KpiDirection.down,
            owner: 'VP Supply Chain',
            threshold: 1,
            targets: [13.5, 13, 12.5, 12, 11.5, 11, 10.5, 10, 9.5, 9, 8.5, 8],
            actuals: [13.8, 13.1, null, null, null, null, null, null, null, null, null, null],
          ),
          KPI(
            name: 'Suggestions',
            unit: 'count',
            baseline: 12,
            direction: KpiDirection.up,
            owner: 'HR Dir',
            threshold: 3,
            targets: [15, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40],
            actuals: [14, 19, 22, null, null, null, null, null, null, null, null, null],
          ),
        ],
      );
}

class KPI {
  final String name;
  final String unit;
  final double baseline;
  final KpiDirection direction;
  final String owner;
  final double threshold;
  final List<double> targets; // 12 months
  final List<double?> actuals; // 12 months, null = not yet entered

  const KPI({
    required this.name,
    required this.unit,
    required this.baseline,
    required this.direction,
    required this.owner,
    required this.threshold,
    required this.targets,
    required this.actuals,
  });

  KPI copyWith({
    String? name,
    String? unit,
    double? baseline,
    KpiDirection? direction,
    String? owner,
    double? threshold,
    List<double>? targets,
    List<double?>? actuals,
  }) =>
      KPI(
        name: name ?? this.name,
        unit: unit ?? this.unit,
        baseline: baseline ?? this.baseline,
        direction: direction ?? this.direction,
        owner: owner ?? this.owner,
        threshold: threshold ?? this.threshold,
        targets: targets ?? this.targets,
        actuals: actuals ?? this.actuals,
      );

  /// Compute RAG status for a given month index.
  RagStatus ragAt(int month) {
    if (month < 0 || month >= 12) return RagStatus.none;
    final actual = actuals[month];
    if (actual == null) return RagStatus.none;
    final target = targets[month];

    if (direction == KpiDirection.up) {
      if (actual >= target) return RagStatus.green;
      if (actual >= target - threshold) return RagStatus.yellow;
      return RagStatus.red;
    } else {
      if (actual <= target) return RagStatus.green;
      if (actual <= target + threshold) return RagStatus.yellow;
      return RagStatus.red;
    }
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'unit': unit,
        'baseline': baseline,
        'direction': direction.name,
        'owner': owner,
        'threshold': threshold,
        'targets': targets,
        'actuals': actuals,
      };

  factory KPI.fromJson(Map<String, dynamic> json) => KPI(
        name: json['name'] as String? ?? '',
        unit: json['unit'] as String? ?? '',
        baseline: (json['baseline'] as num?)?.toDouble() ?? 0,
        direction: json['direction'] == 'down'
            ? KpiDirection.down
            : KpiDirection.up,
        owner: json['owner'] as String? ?? '',
        threshold: (json['threshold'] as num?)?.toDouble() ?? 0,
        targets: (json['targets'] as List?)
                ?.map((e) => (e as num).toDouble())
                .toList() ??
            List.filled(12, 0),
        actuals: (json['actuals'] as List?)
                ?.map((e) => e == null ? null : (e as num).toDouble())
                .toList() ??
            List.filled(12, null),
      );
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
