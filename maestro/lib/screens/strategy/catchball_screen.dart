import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/catchball_provider.dart';
import '../../theme/maestro_colors.dart';
import '../../widgets/painters/catchball_painter.dart';

class CatchballScreen extends ConsumerWidget {
  final String strategyId;

  const CatchballScreen({super.key, required this.strategyId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final catchball = ref.watch(catchballProvider(strategyId));
    final notifier = ref.read(catchballProvider(strategyId).notifier);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'CATCHBALL PROCESS',
            style: TextStyle(
              color: MaestroColors.accent,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 16),

          // Controls
          Row(
            children: [
              GlassIconButton.outlined(
                icon: Icons.chevron_left,
                onPressed: notifier.stepBack,
                tooltip: 'Previous step',
              ),
              const SizedBox(width: 8),
              GlassIconButton.filled(
                icon: notifier.isPlaying ? Icons.pause : Icons.play_arrow,
                onPressed: notifier.toggleAutoPlay,
                color: MaestroColors.accent,
                tooltip: notifier.isPlaying ? 'Pause' : 'Auto play',
              ),
              const SizedBox(width: 8),
              GlassIconButton.outlined(
                icon: Icons.chevron_right,
                onPressed: notifier.stepForward,
                tooltip: 'Next step',
              ),
              const SizedBox(width: 16),
              Text(
                'Step ${catchball.currentStep + 1} / ${catchball.rounds.length + 1}',
                style: TextStyle(color: MaestroColors.muted, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Canvas
          AspectRatio(
            aspectRatio: 750 / 520,
            child: CustomPaint(
              painter: CatchballPainter(data: catchball),
              size: Size.infinite,
            ),
          ),

          // Current step description
          if (catchball.currentStep < catchball.rounds.length) ...[
            const SizedBox(height: 16),
            GlassContainer(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Icon(
                    catchball.rounds[catchball.currentStep].isThrow
                        ? Icons.arrow_downward
                        : Icons.arrow_upward,
                    color: MaestroColors.accent,
                    size: 18,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      catchball.rounds[catchball.currentStep].label,
                      style: TextStyle(
                          color: MaestroColors.text, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
