import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/catchball.dart';
import '../services/strategy_service.dart';
import 'strategy_provider.dart';

class CatchballNotifier extends AutoDisposeFamilyNotifier<CatchballProcess, String> {
  Timer? _autoPlayTimer;
  Timer? _debounce;
  bool _isPlaying = false;
  bool _hasLoaded = false;

  @override
  CatchballProcess build(String arg) {
    ref.onDispose(() {
      _autoPlayTimer?.cancel();
      _debounce?.cancel();
      _hasLoaded = false;
    });
    ref.listen(strategyStreamProvider(arg), (_, next) {
      next.whenData((doc) {
        if (doc != null && !_hasLoaded) {
          _hasLoaded = true;
          state = doc.catchball;
        }
      });
    });
    return const CatchballProcess();
  }

  bool get isPlaying => _isPlaying;

  void stepForward() {
    final next = (state.currentStep + 1) % (state.rounds.length + 1);
    state = state.copyWith(currentStep: next);
  }

  void stepBack() {
    final prev = state.currentStep > 0
        ? state.currentStep - 1
        : state.rounds.length;
    state = state.copyWith(currentStep: prev);
  }

  void reset() {
    state = state.copyWith(currentStep: 0);
  }

  void toggleAutoPlay() {
    if (_isPlaying) {
      _autoPlayTimer?.cancel();
      _isPlaying = false;
    } else {
      _isPlaying = true;
      _autoPlayTimer = Timer.periodic(const Duration(milliseconds: 1200), (_) {
        stepForward();
      });
    }
  }

  void _persist() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      final service = ref.read(strategyServiceProvider);
      service.updateCatchball(arg, state);
    });
  }
}

final catchballProvider = NotifierProvider.autoDispose
    .family<CatchballNotifier, CatchballProcess, String>(
  CatchballNotifier.new,
);
