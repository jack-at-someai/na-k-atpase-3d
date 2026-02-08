// Temporal Spine Visualization
//
// Visualizes the temporal ontology structure across 2024-2026:
// YEAR → UNIQUE_QUARTER → UNIQUE_MONTH → DATE
// with mappings to generic nodes: QUARTER, MONTH, DAY_OF_WEEK

import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../organisms/organisms.dart';

// =============================================================================
// TEMPORAL NODE TYPES
// =============================================================================

enum TemporalNodeType {
  year,
  uniqueQuarter,
  uniqueMonth,
  uniqueWeek,
  date,
  quarter, // Generic Q1, Q2, Q3, Q4
  month, // Generic Jan, Feb, Mar...
  weekOfYear, // Generic Week 1, Week 2, ... Week 53
  dayOfWeek, // Generic Mon, Tue, Wed...
}

extension TemporalNodeTypeExtension on TemporalNodeType {
  String get label {
    switch (this) {
      case TemporalNodeType.year:
        return 'YEAR';
      case TemporalNodeType.uniqueQuarter:
        return 'UNIQUE_QUARTER';
      case TemporalNodeType.uniqueMonth:
        return 'UNIQUE_MONTH';
      case TemporalNodeType.uniqueWeek:
        return 'UNIQUE_WEEK';
      case TemporalNodeType.date:
        return 'DATE';
      case TemporalNodeType.quarter:
        return 'QUARTER';
      case TemporalNodeType.month:
        return 'MONTH';
      case TemporalNodeType.weekOfYear:
        return 'WEEK_OF_YEAR';
      case TemporalNodeType.dayOfWeek:
        return 'DAY_OF_WEEK';
    }
  }

  Color get color {
    switch (this) {
      case TemporalNodeType.year:
        return const Color(0xFF7200CB); // Primary purple
      case TemporalNodeType.uniqueQuarter:
        return const Color(0xFF9B4DCA);
      case TemporalNodeType.uniqueMonth:
        return const Color(0xFFBE7ADB);
      case TemporalNodeType.uniqueWeek:
        return const Color(0xFFD4A5E8);
      case TemporalNodeType.date:
        return const Color(0xFFE8C8F5);
      case TemporalNodeType.quarter:
        return const Color(0xFFF000D2); // Secondary magenta
      case TemporalNodeType.month:
        return const Color(0xFFFF66E8);
      case TemporalNodeType.weekOfYear:
        return const Color(0xFFFF99EE);
      case TemporalNodeType.dayOfWeek:
        return const Color(0xFF21D6C6); // Tertiary teal
    }
  }

  int get depth {
    switch (this) {
      case TemporalNodeType.year:
        return 0;
      case TemporalNodeType.uniqueQuarter:
      case TemporalNodeType.quarter:
        return 1;
      case TemporalNodeType.uniqueMonth:
      case TemporalNodeType.month:
        return 2;
      case TemporalNodeType.uniqueWeek:
      case TemporalNodeType.weekOfYear:
        return 3;
      case TemporalNodeType.dayOfWeek:
        return 3;
      case TemporalNodeType.date:
        return 4;
    }
  }
}

// =============================================================================
// TEMPORAL NODE
// =============================================================================

class TemporalNode {
  final String id;
  final String label;
  final TemporalNodeType type;
  final List<String> childIds;
  final List<String> mappedToIds; // For unique→generic mappings
  final Offset position;

  const TemporalNode({
    required this.id,
    required this.label,
    required this.type,
    this.childIds = const [],
    this.mappedToIds = const [],
    required this.position,
  });
}

// =============================================================================
// TEMPORAL SPINE SCREEN
// =============================================================================

class TemporalSpineScreen extends StatefulWidget {
  const TemporalSpineScreen({super.key});

  @override
  State<TemporalSpineScreen> createState() => _TemporalSpineScreenState();
}

class _TemporalSpineScreenState extends State<TemporalSpineScreen> {
  late GraphDirector _director;
  late Map<String, TemporalNode> _nodes;
  late List<_TemporalEdge> _edges;
  String? _focusedNodeId;
  String? _hoveredNodeId;

  // View controls
  double _scale = 0.8;
  Offset _offset = Offset.zero;

  static const _monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  static const _dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  @override
  void initState() {
    super.initState();
    _buildTemporalSpine();
    _buildScenes();
  }

  void _buildTemporalSpine() {
    final nodes = <String, TemporalNode>{};
    final edges = <_TemporalEdge>[];

    // Layout constants
    const yearY = 50.0;
    const quarterY = 150.0;
    const monthY = 280.0;
    const weekY = 420.0;
    const dateY = 560.0;
    const genericY = 100.0;
    const startX = 100.0;
    const yearSpacing = 600.0;
    const quarterSpacing = 140.0;
    const monthSpacing = 45.0;

    // Generic nodes (on the right side)
    const genericX = 2000.0;

    // Add generic QUARTER nodes
    for (int q = 1; q <= 4; q++) {
      final id = 'quarter_$q';
      nodes[id] = TemporalNode(
        id: id,
        label: 'Q$q',
        type: TemporalNodeType.quarter,
        position: Offset(genericX, genericY + (q - 1) * 45),
      );
    }

    // Add generic MONTH nodes
    for (int m = 1; m <= 12; m++) {
      final id = 'month_$m';
      nodes[id] = TemporalNode(
        id: id,
        label: _monthNames[m - 1],
        type: TemporalNodeType.month,
        position: Offset(genericX + 100, genericY - 50 + (m - 1) * 32),
      );
    }

    // Add generic WEEK_OF_YEAR nodes (1-53)
    for (int w = 1; w <= 53; w++) {
      final id = 'woy_$w';
      final col = (w - 1) ~/ 18; // 3 columns of ~18 weeks
      final row = (w - 1) % 18;
      nodes[id] = TemporalNode(
        id: id,
        label: 'W$w',
        type: TemporalNodeType.weekOfYear,
        position: Offset(genericX + 200 + col * 60, genericY - 50 + row * 32),
      );
    }

    // Add generic DAY_OF_WEEK nodes
    for (int d = 0; d < 7; d++) {
      final id = 'dow_$d';
      nodes[id] = TemporalNode(
        id: id,
        label: _dayNames[d],
        type: TemporalNodeType.dayOfWeek,
        position: Offset(genericX + 400, genericY + 50 + d * 40),
      );
    }

    // Build years 2024, 2025, 2026
    for (int yearIdx = 0; yearIdx < 3; yearIdx++) {
      final year = 2024 + yearIdx;
      final yearId = 'year_$year';
      final yearX = startX + yearIdx * yearSpacing;

      final quarterIds = <String>[];
      final allWeekIds = <String>[];

      // Add quarters for this year
      for (int q = 1; q <= 4; q++) {
        final quarterId = 'uq_${year}_q$q';
        final quarterX = yearX + (q - 1) * quarterSpacing - 200;
        quarterIds.add(quarterId);

        final monthIds = <String>[];
        final startMonth = (q - 1) * 3 + 1;

        // Add months for this quarter
        for (int m = startMonth; m < startMonth + 3; m++) {
          final monthId = 'um_${year}_$m';
          final monthOffset = (m - 1) * monthSpacing;
          monthIds.add(monthId);

          // Calculate weeks in this month
          final weekIds = <String>[];
          final firstDay = DateTime(year, m, 1);
          final lastDay = DateTime(year, m + 1, 0);
          final weeksInMonth = <int>{};

          for (var d = firstDay; !d.isAfter(lastDay); d = d.add(const Duration(days: 1))) {
            weeksInMonth.add(_isoWeekNumber(d));
          }

          for (final weekNum in weeksInMonth) {
            final weekId = 'uw_${year}_$weekNum';
            if (!nodes.containsKey(weekId)) {
              final weekX = yearX - 250 + (weekNum - 1) * 12;
              weekIds.add(weekId);
              allWeekIds.add(weekId);

              nodes[weekId] = TemporalNode(
                id: weekId,
                label: 'W$weekNum',
                type: TemporalNodeType.uniqueWeek,
                mappedToIds: ['woy_$weekNum'],
                position: Offset(weekX, weekY),
              );

              // Edge: UNIQUE_WEEK → WEEK_OF_YEAR (mapping)
              edges.add(_TemporalEdge(
                fromId: weekId,
                toId: 'woy_$weekNum',
                type: _EdgeType.mapsTo,
              ));
            }

            // Edge: UNIQUE_MONTH → UNIQUE_WEEK
            edges.add(_TemporalEdge(
              fromId: monthId,
              toId: weekId,
              type: _EdgeType.contains,
            ));
          }

          nodes[monthId] = TemporalNode(
            id: monthId,
            label: '${_monthNames[m - 1]} $year',
            type: TemporalNodeType.uniqueMonth,
            childIds: weekIds,
            mappedToIds: ['month_$m'],
            position: Offset(yearX - 220 + monthOffset, monthY),
          );

          // Edge: UNIQUE_MONTH → MONTH (mapping)
          edges.add(_TemporalEdge(
            fromId: monthId,
            toId: 'month_$m',
            type: _EdgeType.mapsTo,
          ));
        }

        nodes[quarterId] = TemporalNode(
          id: quarterId,
          label: 'Q$q $year',
          type: TemporalNodeType.uniqueQuarter,
          childIds: monthIds,
          mappedToIds: ['quarter_$q'],
          position: Offset(quarterX, quarterY),
        );

        // Edge: UNIQUE_QUARTER → QUARTER (mapping)
        edges.add(_TemporalEdge(
          fromId: quarterId,
          toId: 'quarter_$q',
          type: _EdgeType.mapsTo,
        ));

        // Edges: UNIQUE_QUARTER → UNIQUE_MONTHs
        for (final monthId in monthIds) {
          edges.add(_TemporalEdge(
            fromId: quarterId,
            toId: monthId,
            type: _EdgeType.contains,
          ));
        }
      }

      // Add sample DATE nodes (first day of each month)
      for (int m = 1; m <= 12; m++) {
        final date = DateTime(year, m, 1);
        final dateId = 'date_${year}_${m}_1';
        final dateX = yearX - 220 + (m - 1) * monthSpacing;
        final weekNum = _isoWeekNumber(date);
        final dow = (date.weekday - 1) % 7; // 0 = Monday

        nodes[dateId] = TemporalNode(
          id: dateId,
          label: '${m.toString().padLeft(2, '0')}/01',
          type: TemporalNodeType.date,
          mappedToIds: ['dow_$dow', 'woy_$weekNum'],
          position: Offset(dateX, dateY),
        );

        // Edge: DATE → DAY_OF_WEEK
        edges.add(_TemporalEdge(
          fromId: dateId,
          toId: 'dow_$dow',
          type: _EdgeType.mapsTo,
        ));

        // Edge: UNIQUE_WEEK → DATE
        final weekId = 'uw_${year}_$weekNum';
        if (nodes.containsKey(weekId)) {
          edges.add(_TemporalEdge(
            fromId: weekId,
            toId: dateId,
            type: _EdgeType.contains,
          ));
        }

        // Edge: UNIQUE_MONTH → DATE
        final monthId = 'um_${year}_$m';
        edges.add(_TemporalEdge(
          fromId: monthId,
          toId: dateId,
          type: _EdgeType.contains,
        ));
      }

      // Add year node
      nodes[yearId] = TemporalNode(
        id: yearId,
        label: '$year',
        type: TemporalNodeType.year,
        childIds: quarterIds,
        position: Offset(yearX, yearY),
      );

      // Edges: YEAR → UNIQUE_QUARTERs
      for (final qId in quarterIds) {
        edges.add(_TemporalEdge(
          fromId: yearId,
          toId: qId,
          type: _EdgeType.contains,
        ));
      }
    }

    _nodes = nodes;
    _edges = edges;
  }

  /// Calculate ISO week number
  int _isoWeekNumber(DateTime date) {
    // ISO week date: weeks start on Monday
    final dayOfYear = date.difference(DateTime(date.year, 1, 1)).inDays + 1;
    final weekday = date.weekday; // 1 = Monday, 7 = Sunday
    final weekNumber = ((dayOfYear - weekday + 10) / 7).floor();

    if (weekNumber < 1) {
      // Last week of previous year
      return _isoWeekNumber(DateTime(date.year - 1, 12, 31));
    } else if (weekNumber > 52) {
      // Check if it's week 1 of next year
      final dec31 = DateTime(date.year, 12, 31);
      if (dec31.weekday < 4) {
        return 1;
      }
    }
    return weekNumber;
  }

  void _buildScenes() {
    final scenes = <GraphScene>[
      GraphScene.overview(label: 'Full Spine', scale: 0.35),

      // Year scenes
      GraphScene(
        id: 'year_2024',
        label: '2024',
        focusNodeId: 'year_2024',
        highlightedNodes: {'year_2024'},
        scale: 0.7,
        center: const Offset(-50, 0),
      ),
      GraphScene(
        id: 'year_2025',
        label: '2025',
        focusNodeId: 'year_2025',
        highlightedNodes: {'year_2025'},
        scale: 0.7,
        center: const Offset(-650, 0),
      ),
      GraphScene(
        id: 'year_2026',
        label: '2026',
        focusNodeId: 'year_2026',
        highlightedNodes: {'year_2026'},
        scale: 0.7,
        center: const Offset(-1250, 0),
      ),

      // Q1 2025 deep dive with weeks
      GraphScene(
        id: 'q1_2025',
        label: 'Q1 2025',
        focusNodeId: 'uq_2025_q1',
        highlightedNodes: {
          'uq_2025_q1',
          'um_2025_1', 'um_2025_2', 'um_2025_3',
          'uw_2025_1', 'uw_2025_2', 'uw_2025_3', 'uw_2025_4',
          'uw_2025_5', 'uw_2025_6', 'uw_2025_7', 'uw_2025_8',
          'uw_2025_9', 'uw_2025_10', 'uw_2025_11', 'uw_2025_12', 'uw_2025_13',
        },
        scale: 0.9,
        center: const Offset(-450, -200),
      ),

      // Weeks view
      GraphScene(
        id: 'weeks_2025',
        label: 'Weeks 2025',
        highlightedNodes: {
          for (int w = 1; w <= 52; w++) 'uw_2025_$w',
        },
        scale: 0.5,
        center: const Offset(-400, -350),
      ),

      // Dates view
      GraphScene(
        id: 'dates_2025',
        label: 'Dates 2025',
        highlightedNodes: {
          for (int m = 1; m <= 12; m++) 'date_2025_${m}_1',
        },
        scale: 0.6,
        center: const Offset(-500, -450),
      ),

      // Generic nodes view
      GraphScene(
        id: 'generics',
        label: 'Generic Nodes',
        highlightedNodes: {
          'quarter_1', 'quarter_2', 'quarter_3', 'quarter_4',
          'month_1', 'month_2', 'month_3', 'month_4', 'month_5', 'month_6',
          'month_7', 'month_8', 'month_9', 'month_10', 'month_11', 'month_12',
          for (int w = 1; w <= 53; w++) 'woy_$w',
          'dow_0', 'dow_1', 'dow_2', 'dow_3', 'dow_4', 'dow_5', 'dow_6',
        },
        scale: 0.6,
        center: const Offset(-1900, 0),
      ),
    ];

    _director = GraphDirector(scenes: scenes);
    _director.addListener(() {
      setState(() {
        _focusedNodeId = _director.currentScene.focusNodeId;
      });
    });
  }

  @override
  void dispose() {
    _director.dispose();
    super.dispose();
  }

  void _onNodeTap(String nodeId) {
    setState(() {
      _focusedNodeId = nodeId;
    });

    // Find scene for this node
    final sceneIndex = _director.scenes.indexWhere(
      (s) => s.focusNodeId == nodeId,
    );
    if (sceneIndex >= 0) {
      _director.goToScene(sceneIndex);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CharlotteColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: Row(
                children: [
                  // Main visualization
                  Expanded(
                    child: _buildSpineVisualization(),
                  ),
                  // Legend and stats
                  _buildSidebar(),
                ],
              ),
            ),
            _buildControls(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            child: Icon(Icons.arrow_back, color: CharlotteColors.textSecondary),
          ),
          const SizedBox(width: 16),
          Text(
            'TEMPORAL SPINE',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: CharlotteColors.primary.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              '2024-2026',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: CharlotteColors.primary,
                    letterSpacing: 1,
                  ),
            ),
          ),
          const Spacer(),
          // Node count
          _StatChip(
            label: 'Nodes',
            value: '${_nodes.length}',
            color: CharlotteColors.primary,
          ),
          const SizedBox(width: 8),
          _StatChip(
            label: 'Edges',
            value: '${_edges.length}',
            color: CharlotteColors.secondary,
          ),
        ],
      ),
    );
  }

  Widget _buildSpineVisualization() {
    return GestureDetector(
      onScaleUpdate: (details) {
        setState(() {
          _scale = (_scale * details.scale).clamp(0.3, 2.0);
          _offset += details.focalPointDelta;
        });
      },
      child: ClipRect(
        child: CustomPaint(
          painter: _TemporalSpinePainter(
            nodes: _nodes,
            edges: _edges,
            scale: _scale,
            offset: _offset,
            focusedNodeId: _focusedNodeId,
            hoveredNodeId: _hoveredNodeId,
            highlightedNodes: _director.currentScene.highlightedNodes,
          ),
          child: Stack(
            children: [
              // Interactive node overlays
              ..._nodes.entries.map((entry) {
                final node = entry.value;
                final pos = (node.position * _scale) + _offset;
                final size = _getNodeSize(node.type) * _scale;

                return Positioned(
                  left: pos.dx - size / 2,
                  top: pos.dy - size / 2,
                  child: MouseRegion(
                    onEnter: (_) => setState(() => _hoveredNodeId = node.id),
                    onExit: (_) => setState(() => _hoveredNodeId = null),
                    child: GestureDetector(
                      onTap: () => _onNodeTap(node.id),
                      child: Container(
                        width: size,
                        height: size,
                        color: Colors.transparent,
                      ),
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

  double _getNodeSize(TemporalNodeType type) {
    switch (type) {
      case TemporalNodeType.year:
        return 60;
      case TemporalNodeType.uniqueQuarter:
      case TemporalNodeType.quarter:
        return 45;
      case TemporalNodeType.uniqueMonth:
      case TemporalNodeType.month:
        return 35;
      case TemporalNodeType.dayOfWeek:
      case TemporalNodeType.uniqueWeek:
      case TemporalNodeType.weekOfYear:
      case TemporalNodeType.date:
        return 28;
    }
  }

  Widget _buildSidebar() {
    return Container(
      width: 280,
      margin: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Legend
          GlassContainer(
            intensity: GlassIntensity.subtle,
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'NODE TYPES',
                  style: TextStyle(
                    color: CharlotteColors.textTertiary,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 12),
                ...TemporalNodeType.values.map((type) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: type.color,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              type.label,
                              style: TextStyle(
                                color: CharlotteColors.textSecondary,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          Text(
                            '${_nodes.values.where((n) => n.type == type).length}',
                            style: TextStyle(
                              color: CharlotteColors.textTertiary,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    )),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Focused node info
          if (_focusedNodeId != null && _nodes.containsKey(_focusedNodeId))
            Expanded(
              child: GlassContainer(
                intensity: GlassIntensity.subtle,
                padding: const EdgeInsets.all(16),
                child: _buildNodeInfo(_nodes[_focusedNodeId]!),
              ),
            )
          else
            Expanded(
              child: GlassContainer(
                intensity: GlassIntensity.subtle,
                padding: const EdgeInsets.all(16),
                child: Center(
                  child: Text(
                    'Tap a node to see details',
                    style: TextStyle(
                      color: CharlotteColors.textTertiary,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNodeInfo(TemporalNode node) {
    final children = _nodes.values.where((n) => node.childIds.contains(n.id)).toList();
    final mappedTo = _nodes.values.where((n) => node.mappedToIds.contains(n.id)).toList();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Type badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: node.type.color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              node.type.label,
              style: TextStyle(
                color: node.type.color,
                fontSize: 10,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.5,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            node.label,
            style: TextStyle(
              color: CharlotteColors.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'ID: ${node.id}',
            style: TextStyle(
              color: CharlotteColors.textTertiary,
              fontSize: 11,
              fontFamily: 'monospace',
            ),
          ),

          if (children.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(
              'CONTAINS',
              style: TextStyle(
                color: CharlotteColors.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: children.map((child) => GestureDetector(
                    onTap: () => _onNodeTap(child.id),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: child.type.color.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color: child.type.color.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Text(
                        child.label,
                        style: TextStyle(
                          color: child.type.color,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  )).toList(),
            ),
          ],

          if (mappedTo.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text(
              'MAPS TO',
              style: TextStyle(
                color: CharlotteColors.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 8),
            ...mappedTo.map((generic) => Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: CharlotteColors.surface,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: CharlotteColors.glassBorder),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: generic.type.color,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        generic.label,
                        style: TextStyle(
                          color: CharlotteColors.textPrimary,
                          fontSize: 12,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        generic.type.label,
                        style: TextStyle(
                          color: CharlotteColors.textTertiary,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                )),
          ],
        ],
      ),
    );
  }

  Widget _buildControls() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Scene navigation
          Expanded(
            child: GlassContainer(
              intensity: GlassIntensity.subtle,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.skip_previous, color: CharlotteColors.textSecondary),
                    onPressed: _director.canGoPrevious ? _director.previous : null,
                  ),
                  IconButton(
                    icon: Icon(
                      _director.isPlaying ? Icons.pause : Icons.play_arrow,
                      color: CharlotteColors.primary,
                    ),
                    onPressed: _director.togglePlayback,
                  ),
                  IconButton(
                    icon: Icon(Icons.skip_next, color: CharlotteColors.textSecondary),
                    onPressed: _director.canGoNext ? _director.next : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Row(
                      children: [
                        for (int i = 0; i < _director.sceneCount; i++)
                          Expanded(
                            child: GestureDetector(
                              onTap: () => _director.goToScene(i),
                              child: Container(
                                height: 6,
                                margin: const EdgeInsets.symmetric(horizontal: 2),
                                decoration: BoxDecoration(
                                  color: i == _director.currentIndex
                                      ? CharlotteColors.primary
                                      : CharlotteColors.surface,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    _director.currentScene.label ?? 'Scene ${_director.currentIndex + 1}',
                    style: TextStyle(
                      color: CharlotteColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 16),
          // Zoom controls
          GlassContainer(
            intensity: GlassIntensity.subtle,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(Icons.remove, color: CharlotteColors.textSecondary, size: 18),
                  onPressed: () => setState(() => _scale = (_scale - 0.1).clamp(0.3, 2.0)),
                ),
                Text(
                  '${(_scale * 100).toInt()}%',
                  style: TextStyle(
                    color: CharlotteColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.add, color: CharlotteColors.textSecondary, size: 18),
                  onPressed: () => setState(() => _scale = (_scale + 0.1).clamp(0.3, 2.0)),
                ),
                IconButton(
                  icon: Icon(Icons.fit_screen, color: CharlotteColors.textSecondary, size: 18),
                  onPressed: () => setState(() {
                    _scale = 0.6;
                    _offset = Offset.zero;
                  }),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// HELPER WIDGETS
// =============================================================================

class _StatChip extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatChip({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: color.withValues(alpha: 0.7),
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// EDGE TYPES
// =============================================================================

enum _EdgeType {
  contains, // YEAR→QUARTER, QUARTER→MONTH
  mapsTo, // UNIQUE_MONTH→MONTH
}

class _TemporalEdge {
  final String fromId;
  final String toId;
  final _EdgeType type;

  const _TemporalEdge({
    required this.fromId,
    required this.toId,
    required this.type,
  });
}

// =============================================================================
// CUSTOM PAINTER
// =============================================================================

class _TemporalSpinePainter extends CustomPainter {
  final Map<String, TemporalNode> nodes;
  final List<_TemporalEdge> edges;
  final double scale;
  final Offset offset;
  final String? focusedNodeId;
  final String? hoveredNodeId;
  final Set<String> highlightedNodes;

  _TemporalSpinePainter({
    required this.nodes,
    required this.edges,
    required this.scale,
    required this.offset,
    this.focusedNodeId,
    this.hoveredNodeId,
    required this.highlightedNodes,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Draw edges first
    for (final edge in edges) {
      final from = nodes[edge.fromId];
      final to = nodes[edge.toId];
      if (from == null || to == null) continue;

      final fromPos = (from.position * scale) + offset;
      final toPos = (to.position * scale) + offset;

      final isHighlighted = highlightedNodes.contains(edge.fromId) ||
          highlightedNodes.contains(edge.toId);

      final paint = Paint()
        ..color = (edge.type == _EdgeType.mapsTo
                ? const Color(0xFFFF66E8)
                : const Color(0xFF666666))
            .withValues(alpha: isHighlighted ? 0.6 : 0.2)
        ..strokeWidth = isHighlighted ? 2 : 1
        ..style = PaintingStyle.stroke;

      if (edge.type == _EdgeType.mapsTo) {
        // Dashed line for mappings
        _drawDashedLine(canvas, fromPos, toPos, paint);
      } else {
        // Curved line for containment
        final path = Path();
        path.moveTo(fromPos.dx, fromPos.dy);
        final midY = (fromPos.dy + toPos.dy) / 2;
        path.quadraticBezierTo(fromPos.dx, midY, toPos.dx, toPos.dy);
        canvas.drawPath(path, paint);
      }
    }

    // Draw nodes
    for (final node in nodes.values) {
      final pos = (node.position * scale) + offset;
      final nodeSize = _getNodeSize(node.type) * scale;
      final isHighlighted = highlightedNodes.contains(node.id) ||
          focusedNodeId == node.id ||
          hoveredNodeId == node.id;

      // Glow for highlighted nodes
      if (isHighlighted) {
        final glowPaint = Paint()
          ..color = node.type.color.withValues(alpha: 0.4)
          ..maskFilter = MaskFilter.blur(BlurStyle.normal, nodeSize * 0.4);
        canvas.drawCircle(pos, nodeSize / 2, glowPaint);
      }

      // Node background
      final bgPaint = Paint()
        ..color = node.type.color.withValues(alpha: isHighlighted ? 0.9 : 0.6);
      canvas.drawCircle(pos, nodeSize / 2, bgPaint);

      // Node border
      final borderPaint = Paint()
        ..color = node.type.color
        ..style = PaintingStyle.stroke
        ..strokeWidth = isHighlighted ? 2 : 1;
      canvas.drawCircle(pos, nodeSize / 2, borderPaint);

      // Node label
      final textPainter = TextPainter(
        text: TextSpan(
          text: node.label,
          style: TextStyle(
            color: Colors.white,
            fontSize: (nodeSize * 0.3).clamp(8, 14),
            fontWeight: isHighlighted ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(pos.dx - textPainter.width / 2, pos.dy + nodeSize / 2 + 4),
      );
    }
  }

  double _getNodeSize(TemporalNodeType type) {
    switch (type) {
      case TemporalNodeType.year:
        return 60;
      case TemporalNodeType.uniqueQuarter:
      case TemporalNodeType.quarter:
        return 45;
      case TemporalNodeType.uniqueMonth:
      case TemporalNodeType.month:
        return 35;
      case TemporalNodeType.dayOfWeek:
      case TemporalNodeType.uniqueWeek:
      case TemporalNodeType.weekOfYear:
      case TemporalNodeType.date:
        return 28;
    }
  }

  void _drawDashedLine(Canvas canvas, Offset from, Offset to, Paint paint) {
    const dashLength = 5.0;
    const gapLength = 3.0;
    final totalLength = (to - from).distance;
    final direction = (to - from) / totalLength;

    var currentPos = from;
    var drawn = 0.0;
    var isDash = true;

    while (drawn < totalLength) {
      final segmentLength = isDash ? dashLength : gapLength;
      final nextPos = currentPos + direction * math.min(segmentLength, totalLength - drawn);

      if (isDash) {
        canvas.drawLine(currentPos, nextPos, paint);
      }

      currentPos = nextPos;
      drawn += segmentLength;
      isDash = !isDash;
    }
  }

  @override
  bool shouldRepaint(_TemporalSpinePainter oldDelegate) {
    return scale != oldDelegate.scale ||
        offset != oldDelegate.offset ||
        focusedNodeId != oldDelegate.focusedNodeId ||
        hoveredNodeId != oldDelegate.hoveredNodeId ||
        highlightedNodes != oldDelegate.highlightedNodes;
  }
}
