import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/a3_report.dart';
import '../services/strategy_service.dart';
import 'strategy_provider.dart';

class A3Notifier extends AutoDisposeFamilyNotifier<List<A3Report>, String> {
  Timer? _debounce;
  bool _hasLoaded = false;

  @override
  List<A3Report> build(String arg) {
    ref.onDispose(() {
      _debounce?.cancel();
      _hasLoaded = false;
    });
    ref.listen(strategyStreamProvider(arg), (_, next) {
      next.whenData((doc) {
        if (doc != null && !_hasLoaded) {
          _hasLoaded = true;
          state = doc.a3Reports;
        }
      });
    });
    return const [];
  }

  void updateReport(int index, A3Report report) {
    final list = List<A3Report>.from(state);
    if (index < list.length) {
      list[index] = report;
    }
    state = list;
    _persist();
  }

  void addReport(A3Report report) {
    state = [...state, report];
    _persist();
  }

  void removeReport(int index) {
    final list = List<A3Report>.from(state)..removeAt(index);
    state = list;
    _persist();
  }

  void _persist() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      final service = ref.read(strategyServiceProvider);
      service.updateA3Reports(arg, state);
    });
  }
}

final a3Provider = NotifierProvider.autoDispose
    .family<A3Notifier, List<A3Report>, String>(
  A3Notifier.new,
);
