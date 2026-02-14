import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/bowling_chart.dart';
import '../services/strategy_service.dart';
import 'strategy_provider.dart';

class BowlingNotifier extends AutoDisposeFamilyNotifier<BowlingChart, String> {
  Timer? _debounce;
  bool _hasLoaded = false;

  @override
  BowlingChart build(String arg) {
    ref.onDispose(() {
      _debounce?.cancel();
      _hasLoaded = false;
    });
    ref.listen(strategyStreamProvider(arg), (_, next) {
      next.whenData((doc) {
        if (doc != null && !_hasLoaded) {
          _hasLoaded = true;
          state = doc.bowlingChart;
        }
      });
    });
    return const BowlingChart(year: 2026);
  }

  void updateActual(int kpiIndex, int month, double? value) {
    final kpis = List<KPI>.from(state.kpis);
    final kpi = kpis[kpiIndex];
    final actuals = List<double?>.from(kpi.actuals);
    actuals[month] = value;
    kpis[kpiIndex] = kpi.copyWith(actuals: actuals);
    state = state.copyWith(kpis: kpis);
    _persist();
  }

  void addKpi(KPI kpi) {
    state = state.copyWith(kpis: [...state.kpis, kpi]);
    _persist();
  }

  void removeKpi(int index) {
    final kpis = List<KPI>.from(state.kpis)..removeAt(index);
    state = state.copyWith(kpis: kpis);
    _persist();
  }

  void _persist() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      final service = ref.read(strategyServiceProvider);
      service.updateBowlingChart(arg, state);
    });
  }
}

final bowlingProvider = NotifierProvider.autoDispose
    .family<BowlingNotifier, BowlingChart, String>(
  BowlingNotifier.new,
);
