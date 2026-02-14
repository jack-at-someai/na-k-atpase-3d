import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/bowling_chart.dart';
import '../../providers/bowling_provider.dart';
import '../../theme/maestro_colors.dart';

class BowlingScreen extends ConsumerWidget {
  final String strategyId;

  const BowlingScreen({super.key, required this.strategyId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chart = ref.watch(bowlingProvider(strategyId));
    final notifier = ref.read(bowlingProvider(strategyId).notifier);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'BOWLING CHART',
                style: TextStyle(
                  color: MaestroColors.accent,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.5,
                ),
              ),
              const Spacer(),
              Text(
                'FY${chart.year}',
                style: TextStyle(color: MaestroColors.muted, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // RAG Legend
          Row(
            children: [
              _LegendDot(
                  MaestroColors.ragGreenBg, MaestroColors.ragGreenText, 'On Track'),
              const SizedBox(width: 12),
              _LegendDot(
                  MaestroColors.ragYellowBg, MaestroColors.ragYellowText, 'At Risk'),
              const SizedBox(width: 12),
              _LegendDot(
                  MaestroColors.ragRedBg, MaestroColors.ragRedText, 'Off Track'),
            ],
          ),
          const SizedBox(height: 16),

          // Bowling table
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: GlassContainer(
              padding: const EdgeInsets.all(8),
              child: DataTable(
                columnSpacing: 8,
                headingRowHeight: 32,
                dataRowMinHeight: 28,
                dataRowMaxHeight: 32,
                headingTextStyle: TextStyle(
                  color: MaestroColors.text,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
                columns: [
                  const DataColumn(label: Text('KPI')),
                  const DataColumn(label: Text('Row')),
                  ...months.map((m) => DataColumn(label: Text(m))),
                ],
                rows: chart.kpis.expand((kpi) {
                  final kpiIndex = chart.kpis.indexOf(kpi);
                  return [
                    // Target row
                    DataRow(cells: [
                      DataCell(Text(
                        kpi.name,
                        style: TextStyle(
                            color: MaestroColors.text,
                            fontSize: 11,
                            fontWeight: FontWeight.w600),
                      )),
                      DataCell(Text('T',
                          style: TextStyle(
                              color: MaestroColors.accent, fontSize: 10))),
                      ...List.generate(12, (m) {
                        return DataCell(Text(
                          kpi.targets[m].toStringAsFixed(
                              kpi.targets[m] == kpi.targets[m].roundToDouble()
                                  ? 0
                                  : 1),
                          style: TextStyle(
                              color: MaestroColors.accent, fontSize: 11),
                        ));
                      }),
                    ]),
                    // Actual row
                    DataRow(cells: [
                      const DataCell(SizedBox()),
                      DataCell(Text('A',
                          style: TextStyle(
                              color: MaestroColors.muted, fontSize: 10))),
                      ...List.generate(12, (m) {
                        final rag = kpi.ragAt(m);
                        final actual = kpi.actuals[m];
                        return DataCell(
                          GestureDetector(
                            onTap: () => _editActual(
                                context, notifier, kpiIndex, m, actual),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: _ragBg(rag),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                actual != null
                                    ? actual.toStringAsFixed(
                                        actual == actual.roundToDouble()
                                            ? 0
                                            : 1)
                                    : '-',
                                style: TextStyle(
                                  color: _ragText(rag),
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        );
                      }),
                    ]),
                  ];
                }).toList(),
              ),
            ),
          ),

          const SizedBox(height: 16),
          GlassOutlinedButton(
            onPressed: () => _addKpi(context, notifier),
            label: 'Add KPI',
            leadingIcon: Icons.add,
          ),
        ],
      ),
    );
  }

  Color _ragBg(RagStatus rag) => switch (rag) {
        RagStatus.green => MaestroColors.ragGreenBg,
        RagStatus.yellow => MaestroColors.ragYellowBg,
        RagStatus.red => MaestroColors.ragRedBg,
        RagStatus.none => Colors.transparent,
      };

  Color _ragText(RagStatus rag) => switch (rag) {
        RagStatus.green => MaestroColors.ragGreenText,
        RagStatus.yellow => MaestroColors.ragYellowText,
        RagStatus.red => MaestroColors.ragRedText,
        RagStatus.none => MaestroColors.muted,
      };

  void _editActual(BuildContext context, BowlingNotifier notifier,
      int kpiIndex, int month, double? current) {
    final controller =
        TextEditingController(text: current?.toString() ?? '');
    GlassBottomSheet.show(
      context,
      title: 'Enter Actual for ${months[month]}',
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            GlassTextField(
              controller: controller,
              autofocus: true,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              hintText: 'Value',
              onSubmitted: (v) {
                final val = double.tryParse(v);
                notifier.updateActual(kpiIndex, month, val);
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 16),
            GlassFilledButton(
              onPressed: () {
                final val = double.tryParse(controller.text);
                notifier.updateActual(kpiIndex, month, val);
                Navigator.pop(context);
              },
              label: 'Save',
            ),
          ],
        ),
      ),
    );
  }

  void _addKpi(BuildContext context, BowlingNotifier notifier) {
    final nameController = TextEditingController();
    GlassBottomSheet.show(
      context,
      title: 'New KPI',
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            GlassTextField(
              controller: nameController,
              autofocus: true,
              hintText: 'KPI Name',
            ),
            const SizedBox(height: 16),
            GlassFilledButton(
              onPressed: () {
                if (nameController.text.isNotEmpty) {
                  notifier.addKpi(KPI(
                    name: nameController.text,
                    unit: '',
                    baseline: 0,
                    direction: KpiDirection.up,
                    owner: '',
                    threshold: 0,
                    targets: List.filled(12, 0),
                    actuals: List.filled(12, null),
                  ));
                }
                Navigator.pop(context);
              },
              label: 'Add',
            ),
          ],
        ),
      ),
    );
  }
}

class _LegendDot extends StatelessWidget {
  final Color bg;
  final Color text;
  final String label;

  const _LegendDot(this.bg, this.text, this.label);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(color: text, fontSize: 11)),
      ],
    );
  }
}
