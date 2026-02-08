// ContextDrawer - Slide-out panel for node/edge details
//
// When a node or edge is focused, this drawer slides in to show
// detailed information, related data, and available actions.

import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';

// =============================================================================
// CONTEXT DATA - What the drawer displays
// =============================================================================

/// Data model for context drawer content.
class ContextData {
  /// Unique identifier
  final String id;

  /// Display type (e.g., "Animal", "Location", "Event")
  final String type;

  /// Primary label/title
  final String label;

  /// Category for theming
  final String category;

  /// Key-value attributes
  final Map<String, dynamic> attributes;

  /// Related items (edges)
  final List<ContextRelation> relations;

  /// Metrics/scores
  final List<ContextMetric> metrics;

  /// Available actions
  final List<DrawerAction> actions;

  /// Optional image/icon
  final String? imageUrl;

  /// Optional score (0.0 - 1.0)
  final double? score;

  const ContextData({
    required this.id,
    required this.type,
    required this.label,
    required this.category,
    this.attributes = const {},
    this.relations = const [],
    this.metrics = const [],
    this.actions = const [],
    this.imageUrl,
    this.score,
  });
}

/// A relationship/edge to display in context.
class ContextRelation {
  final String id;
  final String type;
  final String targetLabel;
  final String targetCategory;
  final String? description;

  const ContextRelation({
    required this.id,
    required this.type,
    required this.targetLabel,
    required this.targetCategory,
    this.description,
  });
}

/// A metric to display in context.
class ContextMetric {
  final String label;
  final double value;
  final double min;
  final double max;
  final String? unit;
  final List<double>? history;

  const ContextMetric({
    required this.label,
    required this.value,
    this.min = 0.0,
    this.max = 1.0,
    this.unit,
    this.history,
  });
}

/// An action available in context.
class DrawerAction {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool isPrimary;
  final bool isDestructive;

  const DrawerAction({
    required this.label,
    required this.icon,
    required this.onTap,
    this.isPrimary = false,
    this.isDestructive = false,
  });
}

// =============================================================================
// CONTEXT DRAWER
// =============================================================================

/// Slide-out drawer showing details for the focused graph element.
class ContextDrawer extends StatefulWidget {
  /// Data to display (null to hide drawer)
  final ContextData? data;

  /// Drawer width
  final double width;

  /// Which side the drawer appears on
  final ContextDrawerSide side;

  /// Callback when a relation is tapped
  final void Function(ContextRelation relation)? onRelationTap;

  /// Callback when drawer is dismissed
  final VoidCallback? onDismiss;

  const ContextDrawer({
    super.key,
    this.data,
    this.width = 320,
    this.side = ContextDrawerSide.right,
    this.onRelationTap,
    this.onDismiss,
  });

  @override
  State<ContextDrawer> createState() => _ContextDrawerState();
}

enum ContextDrawerSide { left, right }

class _ContextDrawerState extends State<ContextDrawer>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _updateSlideAnimation();

    if (widget.data != null) {
      _controller.forward();
    }
  }

  @override
  void didUpdateWidget(ContextDrawer oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (widget.data != null && oldWidget.data == null) {
      _controller.forward();
    } else if (widget.data == null && oldWidget.data != null) {
      _controller.reverse();
    }

    if (widget.side != oldWidget.side) {
      _updateSlideAnimation();
    }
  }

  void _updateSlideAnimation() {
    final beginOffset = widget.side == ContextDrawerSide.right
        ? const Offset(1.0, 0.0)
        : const Offset(-1.0, 0.0);

    _slideAnimation = Tween<Offset>(
      begin: beginOffset,
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _slideAnimation,
      child: ClipRRect(
        borderRadius: BorderRadius.horizontal(
          left: widget.side == ContextDrawerSide.right
              ? const Radius.circular(16)
              : Radius.zero,
          right: widget.side == ContextDrawerSide.left
              ? const Radius.circular(16)
              : Radius.zero,
        ),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
          child: Container(
            width: widget.width,
            decoration: BoxDecoration(
              color: CharlotteColors.glassFill,
              border: Border(
                left: widget.side == ContextDrawerSide.right
                    ? BorderSide(color: CharlotteColors.glassBorder)
                    : BorderSide.none,
                right: widget.side == ContextDrawerSide.left
                    ? BorderSide(color: CharlotteColors.glassBorder)
                    : BorderSide.none,
              ),
            ),
            child: widget.data != null
                ? _DrawerContent(
                    data: widget.data!,
                    onRelationTap: widget.onRelationTap,
                    onDismiss: widget.onDismiss,
                  )
                : const SizedBox.shrink(),
          ),
        ),
      ),
    );
  }
}

class _DrawerContent extends StatelessWidget {
  final ContextData data;
  final void Function(ContextRelation)? onRelationTap;
  final VoidCallback? onDismiss;

  const _DrawerContent({
    required this.data,
    this.onRelationTap,
    this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header
        _DrawerHeader(data: data, onDismiss: onDismiss),

        // Scrollable content
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Score if present
              if (data.score != null) ...[
                _ScoreSection(score: data.score!),
                const SizedBox(height: 24),
              ],

              // Attributes
              if (data.attributes.isNotEmpty) ...[
                _AttributesSection(attributes: data.attributes),
                const SizedBox(height: 24),
              ],

              // Metrics
              if (data.metrics.isNotEmpty) ...[
                _MetricsSection(metrics: data.metrics),
                const SizedBox(height: 24),
              ],

              // Relations
              if (data.relations.isNotEmpty) ...[
                _RelationsSection(
                  relations: data.relations,
                  onRelationTap: onRelationTap,
                ),
                const SizedBox(height: 24),
              ],
            ],
          ),
        ),

        // Actions
        if (data.actions.isNotEmpty)
          _ActionsSection(actions: data.actions),
      ],
    );
  }
}

// =============================================================================
// DRAWER SECTIONS
// =============================================================================

class _DrawerHeader extends StatelessWidget {
  final ContextData data;
  final VoidCallback? onDismiss;

  const _DrawerHeader({required this.data, this.onDismiss});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: CharlotteColors.glassBorder),
        ),
      ),
      child: Row(
        children: [
          // Node indicator
          NodeAtom(
            category: data.category,
            size: 40,
            depth: 0,
          ),

          const SizedBox(width: 12),

          // Title and type
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  data.type.toUpperCase(),
                  style: TextStyle(
                    color: CharlotteColors.textTertiary,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                  ),
                ),
                Text(
                  data.label,
                  style: TextStyle(
                    color: CharlotteColors.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          // Close button
          if (onDismiss != null)
            GestureDetector(
              onTap: onDismiss,
              child: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: CharlotteColors.surface,
                ),
                child: Icon(
                  Icons.close,
                  size: 18,
                  color: CharlotteColors.textSecondary,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ScoreSection extends StatelessWidget {
  final double score;

  const _ScoreSection({required this.score});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SignalAtom(
        value: score,
        valueType: 'SCORE',
      ),
    );
  }
}

class _AttributesSection extends StatelessWidget {
  final Map<String, dynamic> attributes;

  const _AttributesSection({required this.attributes});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(label: 'ATTRIBUTES'),
        const SizedBox(height: 8),
        ...attributes.entries.map((entry) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: 100,
                    child: Text(
                      entry.key,
                      style: TextStyle(
                        color: CharlotteColors.textTertiary,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      '${entry.value}',
                      style: TextStyle(
                        color: CharlotteColors.textPrimary,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            )),
      ],
    );
  }
}

class _MetricsSection extends StatelessWidget {
  final List<ContextMetric> metrics;

  const _MetricsSection({required this.metrics});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(label: 'METRICS'),
        const SizedBox(height: 8),
        ...metrics.map((metric) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        metric.label,
                        style: TextStyle(
                          color: CharlotteColors.textSecondary,
                          fontSize: 12,
                        ),
                      ),
                      Text(
                        '${metric.value.toStringAsFixed(1)}${metric.unit ?? ''}',
                        style: TextStyle(
                          color: CharlotteColors.textPrimary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  // Progress bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(2),
                    child: LinearProgressIndicator(
                      value: (metric.value - metric.min) /
                          (metric.max - metric.min),
                      backgroundColor: CharlotteColors.surface,
                      valueColor: AlwaysStoppedAnimation(
                        CharlotteVisualizationColors.scoreColor(
                          metric.value,
                          metric.min,
                          metric.max,
                        ),
                      ),
                      minHeight: 4,
                    ),
                  ),
                  // Sparkline if history available
                  if (metric.history != null && metric.history!.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    GlassSparkline(
                      values: metric.history!,
                      height: 24,
                      width: double.infinity,
                      showArea: true,
                      color: CharlotteVisualizationColors.scoreColor(
                        metric.value,
                        metric.min,
                        metric.max,
                      ),
                    ),
                  ],
                ],
              ),
            )),
      ],
    );
  }
}

class _RelationsSection extends StatelessWidget {
  final List<ContextRelation> relations;
  final void Function(ContextRelation)? onRelationTap;

  const _RelationsSection({
    required this.relations,
    this.onRelationTap,
  });

  @override
  Widget build(BuildContext context) {
    // Group by type
    final grouped = <String, List<ContextRelation>>{};
    for (final relation in relations) {
      grouped.putIfAbsent(relation.type, () => []).add(relation);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(label: 'RELATIONS'),
        const SizedBox(height: 8),
        ...grouped.entries.map((entry) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.key.toUpperCase(),
                  style: TextStyle(
                    color: CharlotteColors.textTertiary,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 4),
                ...entry.value.map((relation) => GestureDetector(
                      onTap: () => onRelationTap?.call(relation),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: CharlotteColors.surface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: CharlotteColors.glassBorder),
                        ),
                        child: Row(
                          children: [
                            NodeAtom(
                              category: relation.targetCategory,
                              size: 24,
                              depth: 1,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                relation.targetLabel,
                                style: TextStyle(
                                  color: CharlotteColors.textPrimary,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                            Icon(
                              Icons.chevron_right,
                              size: 18,
                              color: CharlotteColors.textTertiary,
                            ),
                          ],
                        ),
                      ),
                    )),
                const SizedBox(height: 8),
              ],
            )),
      ],
    );
  }
}

class _ActionsSection extends StatelessWidget {
  final List<DrawerAction> actions;

  const _ActionsSection({required this.actions});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: CharlotteColors.glassBorder),
        ),
      ),
      child: Row(
        children: actions.map((action) {
          return Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: _ActionButton(action: action),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final DrawerAction action;

  const _ActionButton({required this.action});

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color fgColor;

    if (action.isPrimary) {
      bgColor = CharlotteColors.primary;
      fgColor = CharlotteColors.white;
    } else if (action.isDestructive) {
      bgColor = CharlotteColors.error.withValues(alpha: 0.2);
      fgColor = CharlotteColors.error;
    } else {
      bgColor = CharlotteColors.surface;
      fgColor = CharlotteColors.textSecondary;
    }

    return GestureDetector(
      onTap: action.onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(8),
          border: action.isPrimary
              ? null
              : Border.all(color: CharlotteColors.glassBorder),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(action.icon, size: 16, color: fgColor),
            const SizedBox(width: 6),
            Text(
              action.label,
              style: TextStyle(
                color: fgColor,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String label;

  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: TextStyle(
        color: CharlotteColors.textTertiary,
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 1,
      ),
    );
  }
}
