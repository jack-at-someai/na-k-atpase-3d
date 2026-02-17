import 'package:flutter/material.dart';
import '../../theme.dart';

class ReferenceLibraryScreen extends StatelessWidget {
  const ReferenceLibraryScreen({super.key});

  static const _references = [
    _RefTopic(title: 'Knowledge Primitives', subtitle: 'NODE, EDGE, METRIC, SIGNAL, PROTOCOL — the five irreducible elements', category: 'Core'),
    _RefTopic(title: 'Convex Hull Theorem', subtitle: 'Five knowledge types form the minimal boundary enclosing all knowledge', category: 'Core'),
    _RefTopic(title: 'First-Order Logic', subtitle: 'Predicate logic foundations for knowledge representation', category: 'Foundations'),
    _RefTopic(title: 'CycL', subtitle: 'The language Charlotte inherits from Cyc and Companions', category: 'Foundations'),
    _RefTopic(title: 'Microtheory Model', subtitle: 'Scoped truth — facts are true within contexts', category: 'Foundations'),
    _RefTopic(title: 'Structure Mapping', subtitle: 'Gentner\'s theory of analogical reasoning', category: 'Foundations'),
    _RefTopic(title: 'Temporal Spine', subtitle: '2048-year epochs, zoom levels, CT scan metaphor', category: 'Architecture'),
    _RefTopic(title: 'Spatial Spine', subtitle: 'Geospatial, topological, and Kd-space planes', category: 'Architecture'),
    _RefTopic(title: 'Observer Model', subtitle: 'Perceive \u2192 PlaceSignal \u2192 Zoom \u2192 Traverse \u2192 Reflect', category: 'Architecture'),
    _RefTopic(title: 'Lifecycle States', subtitle: 'Nascent \u2192 Active \u2192 Dormant \u2192 Archived \u2192 Deceased', category: 'Architecture'),
    _RefTopic(title: 'Valuation Layer', subtitle: 'Serial pipeline: METRIC \u2192 SIGNAL \u2192 PROTOCOL', category: 'Architecture'),
    _RefTopic(title: 'Dive Line', subtitle: 'Every protocol traces to a sensor reading', category: 'Architecture'),
    _RefTopic(title: 'Region Connection Calculus', subtitle: 'RCC-8 topological spatial relations', category: 'Math'),
    _RefTopic(title: 'Graph Theory', subtitle: 'Centrality, shortest path, connected components', category: 'Math'),
    _RefTopic(title: 'Signal Processing', subtitle: 'Threshold detection, anomaly detection, freshness decay', category: 'Math'),
    _RefTopic(title: 'Mereology', subtitle: 'Part-whole relations, transitivity, containment', category: 'Math'),
    _RefTopic(title: 'Taxonomy', subtitle: 'Thing \u2192 Entity/Event hierarchy, Operation subtypes', category: 'Ontology'),
    _RefTopic(title: 'Relations', subtitle: 'EDGE types, symmetry, inverse declarations', category: 'Ontology'),
    _RefTopic(title: 'Attributes', subtitle: 'Typed attribute system: Text, Numeric, Boolean, Date, Enum, Reference', category: 'Ontology'),
    _RefTopic(title: 'Constraints', subtitle: 'Referential integrity, signal immutability, protocol completeness', category: 'Ontology'),
    _RefTopic(title: 'Heuristics', subtitle: 'Signal freshness, activity detection, anomaly thresholds', category: 'Ontology'),
    _RefTopic(title: 'Provenance', subtitle: 'Source types, confidence scores, provenance chains', category: 'Meta'),
    _RefTopic(title: 'Completeness', subtitle: 'Open World Assumption, completeness levels, known unknowns', category: 'Meta'),
    _RefTopic(title: 'Schema', subtitle: 'Meta-definitions for all five primitives, versioning', category: 'Meta'),
    _RefTopic(title: 'Boot Sequence', subtitle: '6 phases from Kernel to Agent initialization', category: 'System'),
    _RefTopic(title: 'Domain Binding', subtitle: 'How Charlotte boots unbound and receives a domain seed', category: 'System'),
  ];

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;

    // Group by category
    final grouped = <String, List<_RefTopic>>{};
    for (final ref in _references) {
      grouped.putIfAbsent(ref.category, () => []).add(ref);
    }

    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Reference Library', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            '${_references.length} topics across ${grouped.length} categories',
            style: TextStyle(fontSize: 13, color: config.textTertiary),
          ),
          const SizedBox(height: 16),
          for (final entry in grouped.entries) ...[
            Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 8),
              child: Text(
                entry.key.toUpperCase(),
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1.5,
                  color: config.primary.base,
                ),
              ),
            ),
            ...entry.value.map((ref) => _RefTile(ref: ref, config: config)),
          ],
        ],
      ),
    );
  }
}

class _RefTopic {
  final String title;
  final String subtitle;
  final String category;
  const _RefTopic({required this.title, required this.subtitle, required this.category});
}

class _RefTile extends StatelessWidget {
  final _RefTopic ref;
  final CharlotteThemeConfig config;

  const _RefTile({required this.ref, required this.config});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: config.surface,
        borderRadius: BorderRadius.circular(config.radiusMedium),
        border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(ref.title, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: config.textPrimary)),
          const SizedBox(height: 2),
          Text(ref.subtitle, style: TextStyle(fontSize: 12, color: config.textTertiary, height: 1.4)),
        ],
      ),
    );
  }
}
