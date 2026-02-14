/// StrategyDocument — top-level container holding all 7 Hoshin Kanri modules.

import 'x_matrix.dart';
import 'bowling_chart.dart';
import 'a3_report.dart';
import 'kaizen_board.dart';
import 'catchball.dart';
import 'pdca_cycle.dart';

class StrategyDocument {
  final String id;
  final String orgId;
  final String name;
  final DateTime createdAt;
  final DateTime updatedAt;
  final XMatrix xMatrix;
  final BowlingChart bowlingChart;
  final List<A3Report> a3Reports;
  final KaizenBoard kaizenBoard;
  final CatchballProcess catchball;
  final PdcaCycle pdcaCycle;

  const StrategyDocument({
    required this.id,
    required this.orgId,
    this.name = 'Untitled Strategy',
    required this.createdAt,
    required this.updatedAt,
    this.xMatrix = const XMatrix(),
    this.bowlingChart = const BowlingChart(year: 2026),
    this.a3Reports = const [],
    this.kaizenBoard = const KaizenBoard(),
    this.catchball = const CatchballProcess(),
    this.pdcaCycle = const PdcaCycle(),
  });

  StrategyDocument copyWith({
    String? id,
    String? orgId,
    String? name,
    DateTime? createdAt,
    DateTime? updatedAt,
    XMatrix? xMatrix,
    BowlingChart? bowlingChart,
    List<A3Report>? a3Reports,
    KaizenBoard? kaizenBoard,
    CatchballProcess? catchball,
    PdcaCycle? pdcaCycle,
  }) =>
      StrategyDocument(
        id: id ?? this.id,
        orgId: orgId ?? this.orgId,
        name: name ?? this.name,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        xMatrix: xMatrix ?? this.xMatrix,
        bowlingChart: bowlingChart ?? this.bowlingChart,
        a3Reports: a3Reports ?? this.a3Reports,
        kaizenBoard: kaizenBoard ?? this.kaizenBoard,
        catchball: catchball ?? this.catchball,
        pdcaCycle: pdcaCycle ?? this.pdcaCycle,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'orgId': orgId,
        'name': name,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        'xMatrix': xMatrix.toJson(),
        'bowlingChart': bowlingChart.toJson(),
        'a3Reports': a3Reports.map((r) => r.toJson()).toList(),
        'kaizenBoard': kaizenBoard.toJson(),
        'catchball': catchball.toJson(),
        'pdcaCycle': pdcaCycle.toJson(),
      };

  factory StrategyDocument.fromJson(Map<String, dynamic> json) =>
      StrategyDocument(
        id: json['id'] as String? ?? '',
        orgId: json['orgId'] as String? ?? '',
        name: json['name'] as String? ?? 'Untitled Strategy',
        createdAt:
            DateTime.tryParse(json['createdAt'] as String? ?? '') ??
                DateTime.now(),
        updatedAt:
            DateTime.tryParse(json['updatedAt'] as String? ?? '') ??
                DateTime.now(),
        xMatrix: json['xMatrix'] != null
            ? XMatrix.fromJson(json['xMatrix'] as Map<String, dynamic>)
            : const XMatrix(),
        bowlingChart: json['bowlingChart'] != null
            ? BowlingChart.fromJson(
                json['bowlingChart'] as Map<String, dynamic>)
            : const BowlingChart(year: 2026),
        a3Reports: (json['a3Reports'] as List?)
                ?.map((r) => A3Report.fromJson(r as Map<String, dynamic>))
                .toList() ??
            [],
        kaizenBoard: json['kaizenBoard'] != null
            ? KaizenBoard.fromJson(
                json['kaizenBoard'] as Map<String, dynamic>)
            : const KaizenBoard(),
        catchball: json['catchball'] != null
            ? CatchballProcess.fromJson(
                json['catchball'] as Map<String, dynamic>)
            : const CatchballProcess(),
        pdcaCycle: json['pdcaCycle'] != null
            ? PdcaCycle.fromJson(json['pdcaCycle'] as Map<String, dynamic>)
            : const PdcaCycle(),
      );

  /// Sample document with all modules populated.
  factory StrategyDocument.sample() {
    final now = DateTime.now();
    return StrategyDocument(
      id: 'sample-strategy',
      orgId: 'sample-org',
      name: 'FY2026 Hoshin Plan',
      createdAt: now,
      updatedAt: now,
      xMatrix: XMatrix.sample(),
      bowlingChart: BowlingChart.sample(),
      a3Reports: [A3Report.sample()],
      kaizenBoard: KaizenBoard.sample(),
      catchball: CatchballProcess.sample(),
      pdcaCycle: PdcaCycle.sample(),
    );
  }
}
