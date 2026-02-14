import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/strategy_document.dart';
import '../services/strategy_service.dart';

/// Currently selected strategy ID.
final activeStrategyIdProvider = StateProvider<String?>((ref) => null);

/// Stream of strategy document for a given ID.
final strategyStreamProvider =
    StreamProvider.family<StrategyDocument?, String>((ref, strategyId) {
  final service = ref.watch(strategyServiceProvider);
  return service.watchStrategy(strategyId);
});

/// List of strategies for the current org.
final strategiesListProvider =
    StreamProvider.family<List<StrategyDocument>, String>((ref, orgId) {
  final service = ref.watch(strategyServiceProvider);
  return service.watchOrgStrategies(orgId);
});
