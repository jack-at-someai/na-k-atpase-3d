/// A3 Report — structured problem-solving on a single page.
/// 7 sections mapping to PDCA (left = Plan, right = Do/Check/Act).

class A3Report {
  final String id;
  final String title; // 1. Title/Theme
  final String background; // 2. Context & relevance
  final String current; // 3. Current Condition
  final String analysis; // 4. Root Cause (5 Whys)
  final String target; // 5. Target Condition / Countermeasures
  final String plan; // 6. Implementation Plan
  final String followup; // 7. Follow-Up & Results

  const A3Report({
    this.id = '',
    this.title = '',
    this.background = '',
    this.current = '',
    this.analysis = '',
    this.target = '',
    this.plan = '',
    this.followup = '',
  });

  A3Report copyWith({
    String? id,
    String? title,
    String? background,
    String? current,
    String? analysis,
    String? target,
    String? plan,
    String? followup,
  }) =>
      A3Report(
        id: id ?? this.id,
        title: title ?? this.title,
        background: background ?? this.background,
        current: current ?? this.current,
        analysis: analysis ?? this.analysis,
        target: target ?? this.target,
        plan: plan ?? this.plan,
        followup: followup ?? this.followup,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'background': background,
        'current': current,
        'analysis': analysis,
        'target': target,
        'plan': plan,
        'followup': followup,
      };

  factory A3Report.fromJson(Map<String, dynamic> json) => A3Report(
        id: json['id'] as String? ?? '',
        title: json['title'] as String? ?? '',
        background: json['background'] as String? ?? '',
        current: json['current'] as String? ?? '',
        analysis: json['analysis'] as String? ?? '',
        target: json['target'] as String? ?? '',
        plan: json['plan'] as String? ?? '',
        followup: json['followup'] as String? ?? '',
      );

  factory A3Report.sample() => const A3Report(
        id: 'a3-sample',
        title: 'Reduce Setup Time on Line 3',
        background:
            'Line 3 changeover takes 45min average, causing 12% capacity loss. '
            'Customer demand requires 30% more SKU variety next quarter.',
        current:
            'Current setup involves 23 steps, 8 requiring machine stoppage. '
            'No standardized work instruction. Operators use different sequences.',
        analysis:
            'Why 1: Setup takes 45 min → many steps require machine stop\n'
            'Why 2: Steps require stop → tools not pre-staged\n'
            'Why 3: Tools not staged → no standard preparation checklist\n'
            'Why 4: No checklist → process never formally analyzed\n'
            'Why 5: Never analyzed → no dedicated improvement owner',
        target:
            'Target: 15-minute changeover (SMED methodology)\n'
            '• Convert 5 internal steps to external (pre-staging)\n'
            '• Standardize tool cart with shadow board\n'
            '• Create visual work instruction at station',
        plan:
            'Week 1-2: Video current changeover, classify internal/external\n'
            'Week 3-4: Build shadow board, pre-staging cart\n'
            'Week 5: Train operators, trial 3 runs\n'
            'Week 6: Measure, adjust, standardize',
        followup:
            'Measure setup time weekly for 8 weeks. '
            'Target: <15 min sustained. Share learnings with Lines 1 & 2.',
      );
}
