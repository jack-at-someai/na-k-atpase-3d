import 'package:flutter/material.dart';

import '../atoms/types.dart';
import '../molecules/signal_data.dart';

/// Date range for timeline displays
class DateRange {
  final DateTime start;
  final DateTime end;

  const DateRange({required this.start, required this.end});

  Duration get duration => end.difference(start);

  double positionFor(DateTime date) {
    final totalMs = duration.inMilliseconds;
    if (totalMs == 0) return 0.5;
    final dateMs = date.difference(start).inMilliseconds;
    return (dateMs / totalMs).clamp(0.0, 1.0);
  }
}

/// Metric lane data for TimelineLane organism
class MetricLaneData {
  final String label;
  final String valueType;
  final List<SignalData> signals;
  final bool isExpanded;

  const MetricLaneData({
    required this.label,
    required this.valueType,
    required this.signals,
    this.isExpanded = false,
  });
}

/// Signal data for CalendarDay organism
class CalendarSignal {
  final String metricLabel;
  final Color color;

  const CalendarSignal({
    required this.metricLabel,
    required this.color,
  });
}

/// Checkpoint data for CalendarDay organism
class CalendarCheckpoint {
  final String label;
  final ProtocolState state;

  const CalendarCheckpoint({
    required this.label,
    required this.state,
  });
}

/// Checkpoint data for ProtocolItinerary organism
class ItineraryCheckpoint {
  final String label;
  final int dayNumber;
  final ProtocolState state;
  final DateTime? completedDate;

  const ItineraryCheckpoint({
    required this.label,
    required this.dayNumber,
    required this.state,
    this.completedDate,
  });
}

/// Edge data for LighthouseView organism
class LighthouseEdge {
  final String targetNodeId;
  final String targetCategory;
  final String targetLabel;
  final String edgeType;
  final bool isIncoming;

  const LighthouseEdge({
    required this.targetNodeId,
    required this.targetCategory,
    required this.targetLabel,
    required this.edgeType,
    this.isIncoming = false,
  });
}

/// Node data for HexRing organism
class HexNode {
  final String id;
  final String category;
  final String? label;
  final int position;

  const HexNode({
    required this.id,
    required this.category,
    this.label,
    required this.position,
  });
}
