import 'package:flutter/services.dart' show rootBundle;

class ContentService {
  static final ContentService _instance = ContentService._();
  factory ContentService() => _instance;
  ContentService._();

  final Map<String, String> _cache = {};

  Future<String> loadMarkdown(String name) async {
    if (_cache.containsKey(name)) return _cache[name]!;
    final content = await rootBundle.loadString('assets/docs/$name');
    _cache[name] = content;
    return content;
  }

  Future<String> loadKrf(String filename) async {
    final key = 'krf:$filename';
    if (_cache.containsKey(key)) return _cache[key]!;
    final content = await rootBundle.loadString('assets/krf/$filename');
    _cache[key] = content;
    return content;
  }

  Future<List<String>> listKrfFiles() async {
    // KRF files organized by layer
    return const [
      // Kernel
      'primitives.krf',
      'types.krf',
      'valuation-layer.krf',
      'boot.krf',
      // Knowledge - Structural
      'taxonomy.krf',
      'mereology.krf',
      'relations.krf',
      // Knowledge - Declarative
      'entities.krf',
      'attributes.krf',
      // Knowledge - Procedural
      'protocols.krf',
      'constraints.krf',
      'storytelling.krf',
      'pitch-narratives.krf',
      // Knowledge - Heuristic
      'defaults.krf',
      'thresholds.krf',
      // Knowledge - Meta
      'schema.krf',
      'provenance.krf',
      'completeness.krf',
      // Spine - Temporal
      'epochs.krf',
      'units.krf',
      'lifecycle.krf',
      'encoding.krf',
      // Spine - Spatial
      'geospatial.krf',
      'topological.krf',
      'theoretical.krf',
      // Reference
      'knowledge-primitives.krf',
      'convex-hull.krf',
      // Agent
      'identity.krf',
      'observer.krf',
      'directives.krf',
      // README
      'README.krf',
    ];
  }

  static String layerForFile(String filename) {
    const kernelFiles = {'primitives.krf', 'types.krf', 'valuation-layer.krf', 'boot.krf'};
    const structuralFiles = {'taxonomy.krf', 'mereology.krf', 'relations.krf'};
    const declarativeFiles = {'entities.krf', 'attributes.krf'};
    const proceduralFiles = {'protocols.krf', 'constraints.krf', 'storytelling.krf', 'pitch-narratives.krf'};
    const heuristicFiles = {'defaults.krf', 'thresholds.krf'};
    const metaFiles = {'schema.krf', 'provenance.krf', 'completeness.krf'};
    const temporalFiles = {'epochs.krf', 'units.krf', 'lifecycle.krf', 'encoding.krf'};
    const spatialFiles = {'geospatial.krf', 'topological.krf', 'theoretical.krf'};
    const referenceFiles = {'knowledge-primitives.krf', 'convex-hull.krf'};
    const agentFiles = {'identity.krf', 'observer.krf', 'directives.krf'};

    if (kernelFiles.contains(filename)) return 'Kernel';
    if (structuralFiles.contains(filename)) return 'Structural';
    if (declarativeFiles.contains(filename)) return 'Declarative';
    if (proceduralFiles.contains(filename)) return 'Procedural';
    if (heuristicFiles.contains(filename)) return 'Heuristic';
    if (metaFiles.contains(filename)) return 'Meta';
    if (temporalFiles.contains(filename)) return 'Temporal';
    if (spatialFiles.contains(filename)) return 'Spatial';
    if (referenceFiles.contains(filename)) return 'Reference';
    if (agentFiles.contains(filename)) return 'Agent';
    return 'Other';
  }
}
