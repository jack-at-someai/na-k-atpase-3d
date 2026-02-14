import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/pdca_cycle.dart';
import '../services/strategy_service.dart';
import 'strategy_provider.dart';

class PdcaNotifier extends AutoDisposeFamilyNotifier<PdcaCycle, String> {
  Timer? _debounce;
  bool _hasLoaded = false;

  @override
  PdcaCycle build(String arg) {
    ref.onDispose(() {
      _debounce?.cancel();
      _hasLoaded = false;
    });
    ref.listen(strategyStreamProvider(arg), (_, next) {
      next.whenData((doc) {
        if (doc != null && !_hasLoaded) {
          _hasLoaded = true;
          state = doc.pdcaCycle;
        }
      });
    });
    return const PdcaCycle();
  }

  void selectPhase(int phase) {
    state = state.copyWith(activePhase: phase.clamp(0, 3));
    _persist();
  }

  void _persist() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      final service = ref.read(strategyServiceProvider);
      service.updatePdcaCycle(arg, state);
    });
  }
}

final pdcaProvider = NotifierProvider.autoDispose
    .family<PdcaNotifier, PdcaCycle, String>(
  PdcaNotifier.new,
);
