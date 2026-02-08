import '../atoms/types.dart';

/// Helper class for signal data in MetricLane
class SignalData {
  final dynamic value;
  final double position; // 0.0 to 1.0
  final SignalState state;

  const SignalData({
    required this.value,
    required this.position,
    this.state = SignalState.normal,
  });
}
