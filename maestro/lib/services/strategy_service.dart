import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/strategy_document.dart';
import '../models/x_matrix.dart';
import '../models/bowling_chart.dart';
import '../models/a3_report.dart';
import '../models/kaizen_board.dart';
import '../models/catchball.dart';
import '../models/pdca_cycle.dart';

final strategyServiceProvider =
    Provider<StrategyService>((ref) => StrategyService());

class StrategyService {
  final _db = FirebaseFirestore.instance;

  CollectionReference<Map<String, dynamic>> _strategiesRef(String orgId) =>
      _db.collection('organizations').doc(orgId).collection('strategies');

  /// Watch a single strategy document in real-time.
  Stream<StrategyDocument?> watchStrategy(String strategyId) {
    // Strategy ID encodes orgId:strategyId
    final parts = strategyId.split(':');
    if (parts.length != 2) return Stream.value(null);
    final orgId = parts[0];
    final docId = parts[1];

    return _strategiesRef(orgId).doc(docId).snapshots().map((snap) {
      if (!snap.exists) return null;
      final data = snap.data()!;
      data['id'] = snap.id;
      data['orgId'] = orgId;
      return StrategyDocument.fromJson(data);
    });
  }

  /// Watch all strategies for an org.
  Stream<List<StrategyDocument>> watchOrgStrategies(String orgId) {
    return _strategiesRef(orgId)
        .orderBy('updatedAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs.map((doc) {
              final data = doc.data();
              data['id'] = doc.id;
              data['orgId'] = orgId;
              return StrategyDocument.fromJson(data);
            }).toList());
  }

  /// Create a new strategy document.
  Future<String> createStrategy(String orgId, StrategyDocument strategy) async {
    final ref = await _strategiesRef(orgId).add(strategy.toJson());
    return ref.id;
  }

  /// Delete a strategy document.
  Future<void> deleteStrategy(String orgId, String docId) {
    return _strategiesRef(orgId).doc(docId).delete();
  }

  /// Update the full strategy document.
  Future<void> updateStrategy(String orgId, String docId,
      StrategyDocument strategy) {
    return _strategiesRef(orgId).doc(docId).update({
      ...strategy.toJson(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  // ---------------------------------------------------------------------------
  // Per-module update helpers (debounced writes from providers)
  // ---------------------------------------------------------------------------

  Future<void> updateXMatrix(String strategyId, XMatrix xMatrix) {
    final parts = strategyId.split(':');
    if (parts.length != 2) return Future.value();
    return _strategiesRef(parts[0]).doc(parts[1]).update({
      'xMatrix': xMatrix.toJson(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateBowlingChart(String strategyId, BowlingChart chart) {
    final parts = strategyId.split(':');
    if (parts.length != 2) return Future.value();
    return _strategiesRef(parts[0]).doc(parts[1]).update({
      'bowlingChart': chart.toJson(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateA3Reports(String strategyId, List<A3Report> reports) {
    final parts = strategyId.split(':');
    if (parts.length != 2) return Future.value();
    return _strategiesRef(parts[0]).doc(parts[1]).update({
      'a3Reports': reports.map((r) => r.toJson()).toList(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateKaizenBoard(String strategyId, KaizenBoard board) {
    final parts = strategyId.split(':');
    if (parts.length != 2) return Future.value();
    return _strategiesRef(parts[0]).doc(parts[1]).update({
      'kaizenBoard': board.toJson(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateCatchball(
      String strategyId, CatchballProcess process) {
    final parts = strategyId.split(':');
    if (parts.length != 2) return Future.value();
    return _strategiesRef(parts[0]).doc(parts[1]).update({
      'catchball': process.toJson(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updatePdcaCycle(String strategyId, PdcaCycle cycle) {
    final parts = strategyId.split(':');
    if (parts.length != 2) return Future.value();
    return _strategiesRef(parts[0]).doc(parts[1]).update({
      'pdcaCycle': cycle.toJson(),
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }
}
