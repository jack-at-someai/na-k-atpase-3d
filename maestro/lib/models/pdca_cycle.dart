/// PDCA Cycle — Plan-Do-Check-Act continuous improvement loop.

enum PdcaPhase { plan, act, check, doPhase }

class PdcaCycle {
  final int activePhase; // 0-3: plan, do, check, act
  final List<PdcaStage> stages;
  final List<PdcaEntry> entries;

  const PdcaCycle({
    this.activePhase = 0,
    this.stages = const [],
    this.entries = const [],
  });

  PdcaCycle copyWith({
    int? activePhase,
    List<PdcaStage>? stages,
    List<PdcaEntry>? entries,
  }) =>
      PdcaCycle(
        activePhase: activePhase ?? this.activePhase,
        stages: stages ?? this.stages,
        entries: entries ?? this.entries,
      );

  Map<String, dynamic> toJson() => {
        'activePhase': activePhase,
        'stages': stages.map((s) => s.toJson()).toList(),
        'entries': entries.map((e) => e.toJson()).toList(),
      };

  factory PdcaCycle.fromJson(Map<String, dynamic> json) => PdcaCycle(
        activePhase: json['activePhase'] as int? ?? 0,
        stages: (json['stages'] as List?)
                ?.map((s) => PdcaStage.fromJson(s as Map<String, dynamic>))
                .toList() ??
            [],
        entries: (json['entries'] as List?)
                ?.map((e) => PdcaEntry.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
      );

  factory PdcaCycle.sample() => PdcaCycle(
        activePhase: 0,
        stages: const [
          PdcaStage(
            name: 'PLAN',
            description: 'Identify improvement opportunity and plan change',
            details: [
              'Define the problem clearly',
              'Collect baseline data',
              'Analyze root causes (5 Whys, Fishbone)',
              'Develop improvement hypothesis',
              'Create action plan with timeline',
            ],
            hoshinMapping: 'A3 Report (Left Side) — Problem Analysis',
          ),
          PdcaStage(
            name: 'DO',
            description: 'Implement the change on a small scale',
            details: [
              'Execute the plan in a controlled pilot',
              'Document what happens',
              'Collect data during implementation',
              'Note any deviations from plan',
            ],
            hoshinMapping: 'Kaizen Board — "Doing" Column',
          ),
          PdcaStage(
            name: 'CHECK',
            description: 'Study results and compare to predictions',
            details: [
              'Analyze collected data',
              'Compare results to targets',
              'Identify gaps and learnings',
              'Determine if hypothesis was correct',
            ],
            hoshinMapping: 'Bowling Chart — RAG Status Review',
          ),
          PdcaStage(
            name: 'ACT',
            description: 'Standardize or adjust based on learnings',
            details: [
              'If successful: standardize the new process',
              'If not: identify what to change',
              'Update documentation and training',
              'Begin next PDCA cycle',
            ],
            hoshinMapping: 'A3 Report (Right Side) — Countermeasures',
          ),
        ],
      );
}

class PdcaStage {
  final String name;
  final String description;
  final List<String> details;
  final String hoshinMapping;

  const PdcaStage({
    required this.name,
    required this.description,
    this.details = const [],
    this.hoshinMapping = '',
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'description': description,
        'details': details,
        'hoshinMapping': hoshinMapping,
      };

  factory PdcaStage.fromJson(Map<String, dynamic> json) => PdcaStage(
        name: json['name'] as String? ?? '',
        description: json['description'] as String? ?? '',
        details: List<String>.from(json['details'] ?? []),
        hoshinMapping: json['hoshinMapping'] as String? ?? '',
      );
}

class PdcaEntry {
  final String id;
  final int phase; // 0-3
  final String note;
  final DateTime createdAt;

  const PdcaEntry({
    required this.id,
    required this.phase,
    required this.note,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'phase': phase,
        'note': note,
        'createdAt': createdAt.toIso8601String(),
      };

  factory PdcaEntry.fromJson(Map<String, dynamic> json) => PdcaEntry(
        id: json['id'] as String? ?? '',
        phase: json['phase'] as int? ?? 0,
        note: json['note'] as String? ?? '',
        createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ??
            DateTime.now(),
      );
}
