/// Knowledge Base — 18 Hoshin Kanri concept cards (static content).

class KnowledgeCard {
  final String title;
  final String tag;
  final String description;

  const KnowledgeCard({
    required this.title,
    required this.tag,
    required this.description,
  });
}

const knowledgeCards = [
  KnowledgeCard(
    title: 'Hoshin Kanri',
    tag: 'Strategy',
    description:
        'Japanese strategic planning methodology meaning "compass management." '
        'Aligns organizational goals from top to bottom through systematic deployment.',
  ),
  KnowledgeCard(
    title: 'X-Matrix',
    tag: 'Tool',
    description:
        'Visual strategy deployment tool showing relationships between '
        'breakthrough objectives, annual goals, improvement priorities, and metrics on a single page.',
  ),
  KnowledgeCard(
    title: 'True North',
    tag: 'Concept',
    description:
        'The organization\'s ultimate purpose and ideal state — the guiding vision '
        'that all hoshin objectives should move toward.',
  ),
  KnowledgeCard(
    title: 'Catchball',
    tag: 'Process',
    description:
        'Iterative alignment process where strategy is "thrown" down the hierarchy '
        'and "caught" with feedback, ensuring buy-in at every level.',
  ),
  KnowledgeCard(
    title: 'PDCA Cycle',
    tag: 'Framework',
    description:
        'Plan-Do-Check-Act — the Deming cycle for continuous improvement. '
        'Each hoshin objective should be managed through PDCA iterations.',
  ),
  KnowledgeCard(
    title: 'A3 Thinking',
    tag: 'Tool',
    description:
        'Problem-solving methodology that fits analysis on a single A3-sized sheet. '
        'Forces concise, structured thinking: background → analysis → action.',
  ),
  KnowledgeCard(
    title: 'Bowling Chart',
    tag: 'Tool',
    description:
        'Monthly KPI tracking chart with Red-Amber-Green status indicators. '
        'Named for its resemblance to a bowling scorecard.',
  ),
  KnowledgeCard(
    title: 'Breakthrough Objectives',
    tag: 'Concept',
    description:
        '3-5 year stretch goals requiring fundamental changes in how the organization '
        'operates. Not incremental — these demand innovation.',
  ),
  KnowledgeCard(
    title: 'Annual Objectives',
    tag: 'Concept',
    description:
        'Yearly targets derived from breakthrough objectives. Specific, measurable, '
        'and owned by senior leaders. The bridge between vision and execution.',
  ),
  KnowledgeCard(
    title: 'Kaizen',
    tag: 'Practice',
    description:
        'Continuous incremental improvement. Five levels: Point (single process), '
        'Line (value stream), Plane (department), System (enterprise), Cube (ecosystem).',
  ),
  KnowledgeCard(
    title: 'Gemba',
    tag: 'Practice',
    description:
        '"The real place" — going to where work happens to observe, understand, '
        'and improve. Leaders practice gemba walks to stay connected to reality.',
  ),
  KnowledgeCard(
    title: 'Nemawashi',
    tag: 'Practice',
    description:
        'Building consensus through informal groundwork before formal decisions. '
        'Critical for successful hoshin deployment — no surprises in strategy meetings.',
  ),
  KnowledgeCard(
    title: 'Hansei',
    tag: 'Practice',
    description:
        'Deep reflection on failures and shortcomings. Not blame — honest assessment '
        'of gaps between plan and reality to drive the next PDCA cycle.',
  ),
  KnowledgeCard(
    title: 'Standard Work',
    tag: 'Technique',
    description:
        'Documented best-known method for performing a task. The baseline from which '
        'all improvement is measured. No standard = no improvement.',
  ),
  KnowledgeCard(
    title: 'Visual Management',
    tag: 'Technique',
    description:
        'Making the state of work visible at a glance — andon boards, kanban cards, '
        'bowling charts. If you can\'t see it, you can\'t manage it.',
  ),
  KnowledgeCard(
    title: 'Strategy Deployment vs. MBO',
    tag: 'Comparison',
    description:
        'Hoshin focuses on vital few objectives with means alignment (HOW), '
        'while MBO sets many objectives focused on results (WHAT). '
        'Hoshin uses catchball; MBO is top-down.',
  ),
  KnowledgeCard(
    title: 'Policy Deployment',
    tag: 'Strategy',
    description:
        'English translation of Hoshin Kanri. "Policy" means direction/purpose, '
        '"deployment" means cascading through levels with aligned resources.',
  ),
  KnowledgeCard(
    title: 'Correlation Matrix',
    tag: 'Tool',
    description:
        'Grid showing strength of relationships (none/weak/moderate/strong) between '
        'strategy elements. Ensures alignment — every metric traces to an objective.',
  ),
];
