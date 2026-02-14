import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/pdca_provider.dart';
import '../../theme/maestro_colors.dart';
import '../../widgets/painters/pdca_painter.dart';

class PdcaScreen extends ConsumerWidget {
  final String strategyId;

  const PdcaScreen({super.key, required this.strategyId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pdca = ref.watch(pdcaProvider(strategyId));
    final notifier = ref.read(pdcaProvider(strategyId).notifier);
    final theme = Theme.of(context);

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 800;

        final wheel = GestureDetector(
          onTapDown: (details) {
            final box = context.findRenderObject() as RenderBox;
            final size = box.size;
            final canvasSize = Size(
              isWide ? size.width * 0.5 : size.width,
              isWide ? size.height : size.width,
            );
            final phase = PdcaPainter.hitTestQuadrant(details.localPosition, canvasSize);
            if (phase != null) notifier.selectPhase(phase);
          },
          child: AspectRatio(
            aspectRatio: 1,
            child: CustomPaint(
              painter: PdcaPainter(activePhase: pdca.activePhase),
              size: Size.infinite,
            ),
          ),
        );

        final detail = AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child: _PdcaDetail(
            key: ValueKey(pdca.activePhase),
            stage: pdca.stages.isNotEmpty ? pdca.stages[pdca.activePhase] : null,
            phaseIndex: pdca.activePhase,
          ),
        );

        if (isWide) {
          return Row(
            children: [
              Expanded(flex: 1, child: Padding(
                padding: const EdgeInsets.all(24),
                child: wheel,
              )),
              Container(width: 1, color: MaestroColors.border),
              Expanded(flex: 1, child: detail),
            ],
          );
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              SizedBox(
                height: 300,
                child: wheel,
              ),
              const SizedBox(height: 16),
              detail,
            ],
          ),
        );
      },
    );
  }
}

class _PdcaDetail extends StatelessWidget {
  final dynamic stage; // PdcaStage?
  final int phaseIndex;

  static const _phaseColors = [
    MaestroColors.pdcaPlan,
    MaestroColors.pdcaDo,
    MaestroColors.pdcaCheck,
    MaestroColors.pdcaAct,
  ];

  const _PdcaDetail({super.key, required this.stage, required this.phaseIndex});

  @override
  Widget build(BuildContext context) {
    if (stage == null) {
      return Center(
        child: Text('Select a phase',
            style: TextStyle(color: MaestroColors.muted)),
      );
    }

    final color = _phaseColors[phaseIndex];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            stage.name,
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.w700,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            stage.description,
            style: TextStyle(color: MaestroColors.text, fontSize: 14),
          ),
          const SizedBox(height: 20),
          ...stage.details.map<Widget>((String detail) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    margin: const EdgeInsets.only(top: 6, right: 10),
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      detail,
                      style: TextStyle(
                          color: MaestroColors.text, fontSize: 13),
                    ),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 16),
          GlassContainer(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Icon(Icons.link, size: 14, color: MaestroColors.muted),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    stage.hoshinMapping,
                    style: TextStyle(
                        color: MaestroColors.mauveLt, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
