import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';

/// SignalOnTrack - A SignalAtom positioned along a horizontal track.
class SignalOnTrack extends StatelessWidget {
  final dynamic value;
  final String valueType;
  final double xPosition; // 0.0 to 1.0
  final double trackHeight;
  final SignalState state;
  final bool isFromProtocol;

  const SignalOnTrack({
    super.key,
    required this.value,
    required this.valueType,
    required this.xPosition,
    this.trackHeight = 56,
    this.state = SignalState.normal,
    this.isFromProtocol = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: trackHeight,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final width = constraints.maxWidth;
          final clampedPosition = xPosition.clamp(0.0, 1.0);
          final xOffset = clampedPosition * (width - 32); // 32 for padding

          return Stack(
            children: [
              // Track line
              Positioned(
                left: 0,
                right: 0,
                top: trackHeight / 2,
                child: Container(
                  height: 2,
                  decoration: BoxDecoration(
                    color: CharlotteColors.trackBorder,
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
              ),
              // Vertical indicator line
              Positioned(
                left: xOffset + 14,
                top: 0,
                bottom: trackHeight / 2,
                child: Container(
                  width: 2,
                  decoration: BoxDecoration(
                    color: CharlotteColors.primary.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
              ),
              // Signal atom at position
              Positioned(
                left: xOffset,
                top: 4,
                child: SignalAtom(
                  value: value,
                  valueType: valueType,
                  state: state,
                  isFromProtocol: isFromProtocol,
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
