import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/a3_report.dart';
import '../../providers/a3_provider.dart';
import '../../theme/maestro_colors.dart';

/// A3 Report — 7 sections in a 2-column responsive grid.
/// Left = PLAN (observe, understand). Right = DO/CHECK/ACT.
class A3Screen extends ConsumerStatefulWidget {
  final String strategyId;

  const A3Screen({super.key, required this.strategyId});

  @override
  ConsumerState<A3Screen> createState() => _A3ScreenState();
}

class _A3ScreenState extends ConsumerState<A3Screen> {
  late TextEditingController _titleController;
  late TextEditingController _backgroundController;
  late TextEditingController _currentController;
  late TextEditingController _analysisController;
  late TextEditingController _targetController;
  late TextEditingController _planController;
  late TextEditingController _followupController;
  bool _syncedFromProvider = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _backgroundController = TextEditingController();
    _currentController = TextEditingController();
    _analysisController = TextEditingController();
    _targetController = TextEditingController();
    _planController = TextEditingController();
    _followupController = TextEditingController();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _backgroundController.dispose();
    _currentController.dispose();
    _analysisController.dispose();
    _targetController.dispose();
    _planController.dispose();
    _followupController.dispose();
    super.dispose();
  }

  void _syncControllers(A3Report report) {
    _titleController.text = report.title;
    _backgroundController.text = report.background;
    _currentController.text = report.current;
    _analysisController.text = report.analysis;
    _targetController.text = report.target;
    _planController.text = report.plan;
    _followupController.text = report.followup;
  }

  void _update(A3Report Function(A3Report) updater) {
    final reports = ref.read(a3Provider(widget.strategyId));
    if (reports.isEmpty) return;
    final updated = updater(reports.first);
    ref.read(a3Provider(widget.strategyId).notifier).updateReport(0, updated);
  }

  @override
  Widget build(BuildContext context) {
    final reports = ref.watch(a3Provider(widget.strategyId));

    // Sync controllers once when provider first loads data
    if (reports.isNotEmpty && !_syncedFromProvider) {
      _syncedFromProvider = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _syncControllers(reports.first);
      });
    }

    if (reports.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.description_outlined,
                size: 48, color: MaestroColors.muted),
            const SizedBox(height: 16),
            Text(
              'No A3 reports yet',
              style: TextStyle(color: MaestroColors.muted, fontSize: 16),
            ),
            const SizedBox(height: 16),
            GlassOutlinedButton(
              onPressed: () {
                ref
                    .read(a3Provider(widget.strategyId).notifier)
                    .addReport(const A3Report(title: 'New A3 Report'));
              },
              label: 'Add A3 Report',
              leadingIcon: Icons.add,
            ),
          ],
        ),
      );
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 700;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Title — spans full width
              _A3Section(
                header: '1. TITLE / THEME',
                color: MaestroColors.accent,
                controller: _titleController,
                onChanged: (v) => _update((r) => r.copyWith(title: v)),
                maxLines: 1,
              ),
              const SizedBox(height: 2),
              if (isWide)
                IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Left column — PLAN side
                      Expanded(
                        child: Column(
                          children: [
                            _A3Section(
                              header: '2. BACKGROUND',
                              color: MaestroColors.pdcaPlan,
                              controller: _backgroundController,
                              onChanged: (v) =>
                                  _update((r) => r.copyWith(background: v)),
                            ),
                            _A3Section(
                              header: '3. CURRENT CONDITION',
                              color: MaestroColors.pdcaPlan,
                              controller: _currentController,
                              onChanged: (v) =>
                                  _update((r) => r.copyWith(current: v)),
                            ),
                            _A3Section(
                              header: '4. ROOT CAUSE ANALYSIS',
                              color: MaestroColors.pdcaPlan,
                              controller: _analysisController,
                              onChanged: (v) =>
                                  _update((r) => r.copyWith(analysis: v)),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 2),
                      // Right column — DO/CHECK/ACT side
                      Expanded(
                        child: Column(
                          children: [
                            _A3Section(
                              header: '5. TARGET / COUNTERMEASURES',
                              color: MaestroColors.pdcaDo,
                              controller: _targetController,
                              onChanged: (v) =>
                                  _update((r) => r.copyWith(target: v)),
                            ),
                            _A3Section(
                              header: '6. IMPLEMENTATION PLAN',
                              color: MaestroColors.pdcaCheck,
                              controller: _planController,
                              onChanged: (v) =>
                                  _update((r) => r.copyWith(plan: v)),
                            ),
                            _A3Section(
                              header: '7. FOLLOW-UP & RESULTS',
                              color: MaestroColors.pdcaAct,
                              controller: _followupController,
                              onChanged: (v) =>
                                  _update((r) => r.copyWith(followup: v)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )
              else
                ...[
                  _A3Section(
                    header: '2. BACKGROUND',
                    color: MaestroColors.pdcaPlan,
                    controller: _backgroundController,
                    onChanged: (v) =>
                        _update((r) => r.copyWith(background: v)),
                  ),
                  _A3Section(
                    header: '3. CURRENT CONDITION',
                    color: MaestroColors.pdcaPlan,
                    controller: _currentController,
                    onChanged: (v) =>
                        _update((r) => r.copyWith(current: v)),
                  ),
                  _A3Section(
                    header: '4. ROOT CAUSE ANALYSIS',
                    color: MaestroColors.pdcaPlan,
                    controller: _analysisController,
                    onChanged: (v) =>
                        _update((r) => r.copyWith(analysis: v)),
                  ),
                  _A3Section(
                    header: '5. TARGET / COUNTERMEASURES',
                    color: MaestroColors.pdcaDo,
                    controller: _targetController,
                    onChanged: (v) =>
                        _update((r) => r.copyWith(target: v)),
                  ),
                  _A3Section(
                    header: '6. IMPLEMENTATION PLAN',
                    color: MaestroColors.pdcaCheck,
                    controller: _planController,
                    onChanged: (v) =>
                        _update((r) => r.copyWith(plan: v)),
                  ),
                  _A3Section(
                    header: '7. FOLLOW-UP & RESULTS',
                    color: MaestroColors.pdcaAct,
                    controller: _followupController,
                    onChanged: (v) =>
                        _update((r) => r.copyWith(followup: v)),
                  ),
                ],
            ],
          ),
        );
      },
    );
  }
}

class _A3Section extends StatelessWidget {
  final String header;
  final Color color;
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final int maxLines;

  const _A3Section({
    required this.header,
    required this.color,
    required this.controller,
    required this.onChanged,
    this.maxLines = 5,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            header,
            style: TextStyle(
              color: color,
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 8),
          if (maxLines == 1)
            GlassTextField(
              controller: controller,
              hintText: 'Enter details...',
              onChanged: onChanged,
            )
          else
            GlassTextArea(
              controller: controller,
              hintText: 'Enter details...',
              minLines: 3,
              maxLines: maxLines,
              onChanged: onChanged,
            ),
        ],
      ),
    );
  }
}
