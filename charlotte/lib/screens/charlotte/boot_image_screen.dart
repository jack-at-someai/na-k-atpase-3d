import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../theme.dart';

class BootImageScreen extends StatelessWidget {
  const BootImageScreen({super.key});

  static const _layers = {
    'Kernel': ['primitives.krf', 'types.krf', 'valuation-layer.krf', 'boot.krf'],
    'Structural': ['taxonomy.krf', 'mereology.krf', 'relations.krf'],
    'Declarative': ['entities.krf', 'attributes.krf'],
    'Procedural': ['protocols.krf', 'constraints.krf', 'storytelling.krf', 'pitch-narratives.krf'],
    'Heuristic': ['defaults.krf', 'thresholds.krf'],
    'Meta': ['schema.krf', 'provenance.krf', 'completeness.krf'],
    'Temporal': ['epochs.krf', 'units.krf', 'lifecycle.krf', 'encoding.krf'],
    'Spatial': ['geospatial.krf', 'topological.krf', 'theoretical.krf'],
    'Reference': ['knowledge-primitives.krf', 'convex-hull.krf'],
    'Agent': ['identity.krf', 'observer.krf', 'directives.krf'],
  };

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Boot Image', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            '31 KRF FILES',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
              color: config.textTertiary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'The Charlotte OS kernel — first-order logic organized by layer.',
            style: TextStyle(fontSize: 14, color: config.textSecondary),
          ),
          const SizedBox(height: 24),
          ..._layers.entries.map((entry) => _LayerSection(
            layer: entry.key,
            files: entry.value,
            config: config,
          )),
        ],
      ),
    );
  }
}

class _LayerSection extends StatelessWidget {
  final String layer;
  final List<String> files;
  final CharlotteThemeConfig config;

  const _LayerSection({
    required this.layer,
    required this.files,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Text(
            layer.toUpperCase(),
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
              color: config.primary.base,
            ),
          ),
        ),
        ...files.map((f) => _KrfFileTile(filename: f, config: config)),
        const SizedBox(height: 16),
      ],
    );
  }
}

class _KrfFileTile extends StatelessWidget {
  final String filename;
  final CharlotteThemeConfig config;

  const _KrfFileTile({required this.filename, required this.config});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      dense: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 12),
      leading: Icon(Icons.code, size: 18, color: config.textTertiary),
      title: Text(
        filename,
        style: TextStyle(
          fontSize: 14,
          fontFamily: 'monospace',
          color: config.textPrimary,
        ),
      ),
      trailing: Icon(Icons.chevron_right, size: 18, color: config.textTertiary),
      onTap: () => context.go('/charlotte/krf/${Uri.encodeComponent(filename)}'),
    );
  }
}
