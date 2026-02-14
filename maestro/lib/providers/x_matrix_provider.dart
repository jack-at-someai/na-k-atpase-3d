import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/x_matrix.dart';
import '../services/strategy_service.dart';
import 'strategy_provider.dart';

/// Local X-Matrix state with debounced Firestore persistence.
class XMatrixNotifier extends AutoDisposeFamilyNotifier<XMatrix, String> {
  Timer? _debounce;
  bool _hasLoaded = false;

  @override
  XMatrix build(String arg) {
    ref.onDispose(() {
      _debounce?.cancel();
      _hasLoaded = false;
    });
    ref.listen(strategyStreamProvider(arg), (_, next) {
      next.whenData((doc) {
        if (doc != null && !_hasLoaded) {
          _hasLoaded = true;
          state = doc.xMatrix;
        }
      });
    });
    return const XMatrix();
  }

  void updateVision(String vision) {
    state = state.copyWith(vision: vision);
    _persist();
  }

  void updateBreakthroughs(List<String> items) {
    state = state.copyWith(breakthroughs: items).withResizedCorrelations();
    _persist();
  }

  void updateAnnuals(List<String> items) {
    state = state.copyWith(annuals: items).withResizedCorrelations();
    _persist();
  }

  void updatePriorities(List<String> items) {
    state = state.copyWith(priorities: items).withResizedCorrelations();
    _persist();
  }

  void updateMetrics(List<MetricEntry> items) {
    state = state.copyWith(metrics: items).withResizedCorrelations();
    _persist();
  }

  void addBreakthrough(String text) {
    updateBreakthroughs([...state.breakthroughs, text]);
  }

  void addAnnual(String text) {
    updateAnnuals([...state.annuals, text]);
  }

  void addPriority(String text) {
    updatePriorities([...state.priorities, text]);
  }

  void addMetric(MetricEntry entry) {
    updateMetrics([...state.metrics, entry]);
  }

  /// Cycle correlation value: 0 -> 1 -> 2 -> 3 -> 0
  void cycleCorrelation(String matrixKey, int row, int col) {
    List<List<int>> matrix;
    switch (matrixKey) {
      case 'SW':
        matrix = state.corrSW.map((r) => List<int>.from(r)).toList();
        break;
      case 'NW':
        matrix = state.corrNW.map((r) => List<int>.from(r)).toList();
        break;
      case 'NE':
        matrix = state.corrNE.map((r) => List<int>.from(r)).toList();
        break;
      default:
        return;
    }

    if (row < matrix.length && col < matrix[row].length) {
      matrix[row][col] = (matrix[row][col] + 1) % 4;
    }

    switch (matrixKey) {
      case 'SW':
        state = state.copyWith(corrSW: matrix);
        break;
      case 'NW':
        state = state.copyWith(corrNW: matrix);
        break;
      case 'NE':
        state = state.copyWith(corrNE: matrix);
        break;
    }
    _persist();
  }

  void _persist() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      final service = ref.read(strategyServiceProvider);
      service.updateXMatrix(arg, state);
    });
  }
}

final xMatrixProvider =
    NotifierProvider.autoDispose.family<XMatrixNotifier, XMatrix, String>(
  XMatrixNotifier.new,
);
