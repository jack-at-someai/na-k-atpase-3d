/// Catchball — hierarchical strategy alignment process.
/// 5 levels, 8 steps alternating throw (down) and catch (up).

class CatchballProcess {
  final List<CatchballLevel> levels;
  final List<CatchballRound> rounds;
  final int currentStep; // 0-7

  const CatchballProcess({
    this.levels = const [],
    this.rounds = const [],
    this.currentStep = 0,
  });

  CatchballProcess copyWith({
    List<CatchballLevel>? levels,
    List<CatchballRound>? rounds,
    int? currentStep,
  }) =>
      CatchballProcess(
        levels: levels ?? this.levels,
        rounds: rounds ?? this.rounds,
        currentStep: currentStep ?? this.currentStep,
      );

  Map<String, dynamic> toJson() => {
        'levels': levels.map((l) => l.toJson()).toList(),
        'rounds': rounds.map((r) => r.toJson()).toList(),
        'currentStep': currentStep,
      };

  factory CatchballProcess.fromJson(Map<String, dynamic> json) =>
      CatchballProcess(
        levels: (json['levels'] as List?)
                ?.map(
                    (l) => CatchballLevel.fromJson(l as Map<String, dynamic>))
                .toList() ??
            [],
        rounds: (json['rounds'] as List?)
                ?.map(
                    (r) => CatchballRound.fromJson(r as Map<String, dynamic>))
                .toList() ??
            [],
        currentStep: json['currentStep'] as int? ?? 0,
      );

  factory CatchballProcess.sample() => CatchballProcess(
        currentStep: 0,
        levels: const [
          CatchballLevel(
            role: 'Executive Leadership',
            description: 'Set 3-5 year breakthrough objectives',
          ),
          CatchballLevel(
            role: 'Senior Managers',
            description: 'Translate to annual objectives',
          ),
          CatchballLevel(
            role: 'Department Heads',
            description: 'Define department improvement priorities',
          ),
          CatchballLevel(
            role: 'Team Leaders',
            description: 'Create team-level action plans',
          ),
          CatchballLevel(
            role: 'Individual Contributors',
            description: 'Commit to personal improvement targets',
          ),
        ],
        rounds: const [
          CatchballRound(
              fromLevel: 0,
              toLevel: 1,
              label: 'Throw 3-yr breakthroughs',
              isThrow: true),
          CatchballRound(
              fromLevel: 1,
              toLevel: 0,
              label: 'Catch feedback on feasibility',
              isThrow: false),
          CatchballRound(
              fromLevel: 1,
              toLevel: 2,
              label: 'Throw annual objectives',
              isThrow: true),
          CatchballRound(
              fromLevel: 2,
              toLevel: 1,
              label: 'Catch feasibility concerns',
              isThrow: false),
          CatchballRound(
              fromLevel: 2,
              toLevel: 3,
              label: 'Throw department priorities',
              isThrow: true),
          CatchballRound(
              fromLevel: 3,
              toLevel: 2,
              label: 'Catch adjustments needed',
              isThrow: false),
          CatchballRound(
              fromLevel: 3,
              toLevel: 4,
              label: 'Throw individual targets',
              isThrow: true),
          CatchballRound(
              fromLevel: 4,
              toLevel: 3,
              label: 'Catch insights from frontline',
              isThrow: false),
        ],
      );
}

class CatchballLevel {
  final String role;
  final String description;

  const CatchballLevel({required this.role, required this.description});

  Map<String, dynamic> toJson() => {
        'role': role,
        'description': description,
      };

  factory CatchballLevel.fromJson(Map<String, dynamic> json) =>
      CatchballLevel(
        role: json['role'] as String? ?? '',
        description: json['description'] as String? ?? '',
      );
}

class CatchballRound {
  final int fromLevel;
  final int toLevel;
  final String label;
  final bool isThrow; // true = downward (solid), false = upward (dashed)

  const CatchballRound({
    required this.fromLevel,
    required this.toLevel,
    required this.label,
    required this.isThrow,
  });

  Map<String, dynamic> toJson() => {
        'fromLevel': fromLevel,
        'toLevel': toLevel,
        'label': label,
        'isThrow': isThrow,
      };

  factory CatchballRound.fromJson(Map<String, dynamic> json) =>
      CatchballRound(
        fromLevel: json['fromLevel'] as int? ?? 0,
        toLevel: json['toLevel'] as int? ?? 0,
        label: json['label'] as String? ?? '',
        isThrow: json['isThrow'] as bool? ?? true,
      );
}
