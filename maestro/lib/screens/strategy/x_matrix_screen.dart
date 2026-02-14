import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/x_matrix.dart';
import '../../providers/x_matrix_provider.dart';
import '../../theme/maestro_colors.dart';
import '../../widgets/painters/x_matrix_painter.dart';
import '../../widgets/section_header.dart';

class XMatrixScreen extends ConsumerWidget {
  final String strategyId;

  const XMatrixScreen({super.key, required this.strategyId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final xMatrix = ref.watch(xMatrixProvider(strategyId));
    final notifier = ref.read(xMatrixProvider(strategyId).notifier);

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 900;

        if (isWide) {
          return Row(
            children: [
              Expanded(
                flex: 3,
                child: _XMatrixCanvas(
                  data: xMatrix,
                  onCorrelationTap: (key, row, col) =>
                      notifier.cycleCorrelation(key, row, col),
                ),
              ),
              Container(width: 1, color: MaestroColors.border),
              Expanded(
                flex: 2,
                child: _EditorPanel(
                    strategyId: strategyId, data: xMatrix, notifier: notifier),
              ),
            ],
          );
        }

        return SingleChildScrollView(
          child: Column(
            children: [
              AspectRatio(
                aspectRatio: 1,
                child: _XMatrixCanvas(
                  data: xMatrix,
                  onCorrelationTap: (key, row, col) =>
                      notifier.cycleCorrelation(key, row, col),
                ),
              ),
              _EditorPanel(
                  strategyId: strategyId, data: xMatrix, notifier: notifier),
            ],
          ),
        );
      },
    );
  }
}

class _XMatrixCanvas extends StatelessWidget {
  final XMatrix data;
  final void Function(String key, int row, int col) onCorrelationTap;

  const _XMatrixCanvas({required this.data, required this.onCorrelationTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (details) {
        final box = context.findRenderObject() as RenderBox;
        final size = box.size;
        final hit = CorrelationHitTest.test(details.localPosition, size, data);
        if (hit != null) {
          onCorrelationTap(hit.matrixKey, hit.row, hit.col);
        }
      },
      child: AspectRatio(
        aspectRatio: 1,
        child: CustomPaint(
          painter: XMatrixPainter(data: data),
          size: Size.infinite,
        ),
      ),
    );
  }
}

class _EditorPanel extends StatefulWidget {
  final String strategyId;
  final XMatrix data;
  final XMatrixNotifier notifier;

  const _EditorPanel({
    required this.strategyId,
    required this.data,
    required this.notifier,
  });

  @override
  State<_EditorPanel> createState() => _EditorPanelState();
}

class _EditorPanelState extends State<_EditorPanel> {
  late TextEditingController _visionController;
  late List<TextEditingController> _metricNameControllers;
  late List<TextEditingController> _metricOwnerControllers;

  @override
  void initState() {
    super.initState();
    _visionController = TextEditingController(text: widget.data.vision);
    _metricNameControllers = widget.data.metrics
        .map((m) => TextEditingController(text: m.name))
        .toList();
    _metricOwnerControllers = widget.data.metrics
        .map((m) => TextEditingController(text: m.owner))
        .toList();
  }

  @override
  void didUpdateWidget(_EditorPanel oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncMetricControllers();
  }

  void _syncMetricControllers() {
    final metrics = widget.data.metrics;
    while (_metricNameControllers.length < metrics.length) {
      final i = _metricNameControllers.length;
      _metricNameControllers.add(TextEditingController(text: metrics[i].name));
      _metricOwnerControllers
          .add(TextEditingController(text: metrics[i].owner));
    }
    while (_metricNameControllers.length > metrics.length) {
      _metricNameControllers.removeLast().dispose();
      _metricOwnerControllers.removeLast().dispose();
    }
  }

  @override
  void dispose() {
    _visionController.dispose();
    for (final c in _metricNameControllers) {
      c.dispose();
    }
    for (final c in _metricOwnerControllers) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Vision
          MaestroSectionHeader('TRUE NORTH', MaestroColors.accent),
          const SizedBox(height: 8),
          GlassTextArea(
            controller: _visionController,
            labelText: 'Organization Vision',
            hintText: 'What does your True North look like?',
            minLines: 2,
            maxLines: 4,
            onChanged: widget.notifier.updateVision,
          ),

          const SizedBox(height: 20),

          // Breakthroughs
          MaestroSectionHeader(
              'BREAKTHROUGHS (3-Year)', MaestroColors.xSouth),
          const SizedBox(height: 8),
          _EditableList(
            items: widget.data.breakthroughs,
            onChanged: widget.notifier.updateBreakthroughs,
            onAdd: () => widget.notifier.addBreakthrough('New breakthrough'),
          ),

          const SizedBox(height: 20),

          // Annual Objectives
          MaestroSectionHeader('ANNUAL OBJECTIVES', MaestroColors.xWest),
          const SizedBox(height: 8),
          _EditableList(
            items: widget.data.annuals,
            onChanged: widget.notifier.updateAnnuals,
            onAdd: () => widget.notifier.addAnnual('New objective'),
          ),

          const SizedBox(height: 20),

          // Improvement Priorities
          MaestroSectionHeader(
              'IMPROVEMENT PRIORITIES', MaestroColors.xNorth),
          const SizedBox(height: 8),
          _EditableList(
            items: widget.data.priorities,
            onChanged: widget.notifier.updatePriorities,
            onAdd: () => widget.notifier.addPriority('New priority'),
          ),

          const SizedBox(height: 20),

          // Metrics
          MaestroSectionHeader('TARGETS / KPIs', MaestroColors.xEast),
          const SizedBox(height: 8),
          ...widget.data.metrics.asMap().entries.map((entry) {
            final i = entry.key;
            final m = entry.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: GlassTextField(
                      controller: _metricNameControllers[i],
                      hintText: 'Metric name',
                      onChanged: (v) {
                        final list = List<MetricEntry>.from(widget.data.metrics);
                        list[i] = m.copyWith(name: v);
                        widget.notifier.updateMetrics(list);
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 2,
                    child: GlassTextField(
                      controller: _metricOwnerControllers[i],
                      hintText: 'Owner',
                      onChanged: (v) {
                        final list = List<MetricEntry>.from(widget.data.metrics);
                        list[i] = m.copyWith(owner: v);
                        widget.notifier.updateMetrics(list);
                      },
                    ),
                  ),
                ],
              ),
            );
          }),
          GlassOutlinedButton(
            onPressed: () =>
                widget.notifier.addMetric(const MetricEntry(name: '', owner: '')),
            label: 'Add Metric',
            leadingIcon: Icons.add,
          ),
        ],
      ),
    );
  }
}

class _EditableList extends StatefulWidget {
  final List<String> items;
  final ValueChanged<List<String>> onChanged;
  final VoidCallback onAdd;

  const _EditableList({
    required this.items,
    required this.onChanged,
    required this.onAdd,
  });

  @override
  State<_EditableList> createState() => _EditableListState();
}

class _EditableListState extends State<_EditableList> {
  late List<TextEditingController> _controllers;

  @override
  void initState() {
    super.initState();
    _controllers = widget.items
        .map((text) => TextEditingController(text: text))
        .toList();
  }

  @override
  void didUpdateWidget(_EditableList oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Add controllers for externally added items
    while (_controllers.length < widget.items.length) {
      final i = _controllers.length;
      _controllers.add(TextEditingController(text: widget.items[i]));
    }
    // Safety: trim if items removed externally
    while (_controllers.length > widget.items.length) {
      _controllers.removeLast().dispose();
    }
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    super.dispose();
  }

  void _removeAt(int i) {
    _controllers[i].dispose();
    _controllers.removeAt(i);
    final list = List<String>.from(widget.items)..removeAt(i);
    widget.onChanged(list);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ...widget.items.asMap().entries.map((entry) {
          final i = entry.key;
          return Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: GlassTextField(
              controller: _controllers[i],
              hintText: 'Enter item...',
              suffixIconData: Icons.close,
              onSuffixTap: () => _removeAt(i),
              onChanged: (v) {
                final list = List<String>.from(widget.items);
                list[i] = v;
                widget.onChanged(list);
              },
            ),
          );
        }),
        GlassOutlinedButton(
          onPressed: widget.onAdd,
          label: 'Add',
          leadingIcon: Icons.add,
        ),
      ],
    );
  }
}
