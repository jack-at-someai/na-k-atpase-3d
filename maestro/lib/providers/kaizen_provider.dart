import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

import '../models/kaizen_board.dart';
import '../services/strategy_service.dart';
import 'strategy_provider.dart';

class KaizenNotifier extends AutoDisposeFamilyNotifier<KaizenBoard, String> {
  Timer? _debounce;
  bool _hasLoaded = false;
  static const _uuid = Uuid();

  @override
  KaizenBoard build(String arg) {
    ref.onDispose(() {
      _debounce?.cancel();
      _hasLoaded = false;
    });
    ref.listen(strategyStreamProvider(arg), (_, next) {
      next.whenData((doc) {
        if (doc != null && !_hasLoaded) {
          _hasLoaded = true;
          state = doc.kaizenBoard;
        }
      });
    });
    return const KaizenBoard();
  }

  void addItem({
    required String title,
    required KaizenType type,
    required String owner,
  }) {
    final item = KaizenItem(
      id: _uuid.v4(),
      title: title,
      type: type,
      owner: owner,
      column: KaizenColumn.ideas,
    );
    state = state.copyWith(items: [...state.items, item]);
    _persist();
  }

  void moveItem(String itemId, KaizenColumn toColumn) {
    final items = state.items.map((i) {
      if (i.id == itemId) return i.copyWith(column: toColumn);
      return i;
    }).toList();
    state = state.copyWith(items: items);
    _persist();
  }

  void moveForward(String itemId) {
    final item = state.items.firstWhere((i) => i.id == itemId);
    final next = switch (item.column) {
      KaizenColumn.ideas => KaizenColumn.planned,
      KaizenColumn.planned => KaizenColumn.doing,
      KaizenColumn.doing => KaizenColumn.done,
      KaizenColumn.done => KaizenColumn.done,
    };
    moveItem(itemId, next);
  }

  void moveBack(String itemId) {
    final item = state.items.firstWhere((i) => i.id == itemId);
    final prev = switch (item.column) {
      KaizenColumn.ideas => KaizenColumn.ideas,
      KaizenColumn.planned => KaizenColumn.ideas,
      KaizenColumn.doing => KaizenColumn.planned,
      KaizenColumn.done => KaizenColumn.doing,
    };
    moveItem(itemId, prev);
  }

  void deleteItem(String itemId) {
    final items = state.items.where((i) => i.id != itemId).toList();
    state = state.copyWith(items: items);
    _persist();
  }

  void _persist() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      final service = ref.read(strategyServiceProvider);
      service.updateKaizenBoard(arg, state);
    });
  }
}

final kaizenProvider = NotifierProvider.autoDispose
    .family<KaizenNotifier, KaizenBoard, String>(
  KaizenNotifier.new,
);
