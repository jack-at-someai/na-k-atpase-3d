import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import 'signal_data.dart';

/// MetricLane - Swimming lane with MetricAtom label and signals on track.
class MetricLane extends StatelessWidget {
  final String metricLabel;
  final String valueType;
  final List<SignalData> signals;
  final bool isExpanded;
  final VoidCallback? onTap;

  const MetricLane({
    super.key,
    required this.metricLabel,
    required this.valueType,
    required this.signals,
    this.isExpanded = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassTrack(
        height: isExpanded ? 80 : 56,
        isExpanded: isExpanded,
        leading: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: MetricAtom(
            label: metricLabel,
            valueType: valueType,
            isActive: isExpanded,
          ),
        ),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final width = constraints.maxWidth;

            return Stack(
              children: [
                // Track line
                Positioned(
                  left: 0,
                  right: 16,
                  top: (isExpanded ? 80 : 56) / 2 - 1,
                  child: Container(
                    height: 2,
                    decoration: BoxDecoration(
                      color: CharlotteColors.trackBorder,
                      borderRadius: BorderRadius.circular(1),
                    ),
                  ),
                ),
                // Signals
                ...signals.map((signal) {
                  final xOffset = signal.position.clamp(0.0, 1.0) * (width - 48);
                  return Positioned(
                    left: xOffset,
                    top: isExpanded ? 20 : 8,
                    child: SignalAtom(
                      value: signal.value,
                      valueType: valueType,
                      state: signal.state,
                    ),
                  );
                }),
              ],
            );
          },
        ),
      ),
    );
  }
}
