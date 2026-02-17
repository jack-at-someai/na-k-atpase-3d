import 'package:flutter/material.dart';
import '../../theme.dart';

class DesignSystemScreen extends StatelessWidget {
  const DesignSystemScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Design System', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'Liquid Glass',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: config.textPrimary),
          ),
          const SizedBox(height: 4),
          Text(
            'Apple iOS 26 inspired glassmorphic design system',
            style: TextStyle(fontSize: 14, color: config.textTertiary),
          ),
          const SizedBox(height: 24),

          // Color Palette
          _SectionLabel(title: 'COLOR PALETTE', config: config),
          const SizedBox(height: 8),
          _ColorRow(name: 'Primary', swatch: config.primary, config: config),
          _ColorRow(name: 'Secondary', swatch: config.secondary, config: config),
          _ColorRow(name: 'Tertiary', swatch: config.tertiary, config: config),
          const SizedBox(height: 24),

          // Glass Effects
          _SectionLabel(title: 'GLASS EFFECTS', config: config),
          const SizedBox(height: 8),
          _GlassDemo(
            label: 'Fill Opacity: ${config.glassFillOpacity}',
            sublabel: 'Background fill transparency',
            config: config,
          ),
          _GlassDemo(
            label: 'Border Opacity: ${config.glassBorderOpacity}',
            sublabel: 'Glass border edge highlight',
            config: config,
          ),
          _GlassDemo(
            label: 'Blur: ${config.glassBlurSubtle} / ${config.glassBlurStandard} / ${config.glassBlurFrosted} / ${config.glassBlurDeep}',
            sublabel: 'Subtle / Standard / Frosted / Deep',
            config: config,
          ),
          const SizedBox(height: 24),

          // Typography
          _SectionLabel(title: 'TYPOGRAPHY', config: config),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.surface,
              borderRadius: BorderRadius.circular(config.radiusMedium),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Heading: ${config.headingFontFamily}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: config.textPrimary)),
                const SizedBox(height: 4),
                Text('Body: ${config.bodyFontFamily}', style: TextStyle(fontSize: 14, color: config.textSecondary)),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Radii
          _SectionLabel(title: 'BORDER RADIUS', config: config),
          const SizedBox(height: 8),
          Row(
            children: [
              _RadiusDemo(label: 'S', value: config.radiusSmall, config: config),
              const SizedBox(width: 12),
              _RadiusDemo(label: 'M', value: config.radiusMedium, config: config),
              const SizedBox(width: 12),
              _RadiusDemo(label: 'L', value: config.radiusLarge, config: config),
            ],
          ),
          const SizedBox(height: 24),

          // Component Count
          _SectionLabel(title: 'FLUTTER COMPONENTS', config: config),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.surface,
              borderRadius: BorderRadius.circular(config.radiusMedium),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _ComponentRow(category: 'Atoms', count: 15, examples: 'GlassContainer, GlassCard, GlassChip, GlassDivider', config: config),
                _ComponentRow(category: 'Molecules', count: 18, examples: 'GlassAppBar, GlassSearchBar, GlassTextField, GlassNavRail', config: config),
                _ComponentRow(category: 'Organisms', count: 14, examples: 'StatCard, ChartCard, KpiGrid, GlassDataTable', config: config),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Token Pipeline
          _SectionLabel(title: 'TOKEN PIPELINE', config: config),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.surface,
              borderRadius: BorderRadius.circular(config.radiusMedium),
            ),
            child: Text(
              'tokens.json \u2192 compile-tokens.mjs \u2192 brand_theme.css + brand_theme.dart\n\n'
              'Each brand (SomeAI, ISG, Sounder, Sea Lion, RE) has its own tokens.json. '
              'The compiler generates both CSS custom properties (--lg-*) for web brandbooks '
              'and Dart CharlotteThemeConfig for Flutter apps.',
              style: TextStyle(fontSize: 13, color: config.textSecondary, fontFamily: 'monospace', height: 1.6),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String title;
  final CharlotteThemeConfig config;
  const _SectionLabel({required this.title, required this.config});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.textTertiary),
    );
  }
}

class _ColorRow extends StatelessWidget {
  final String name;
  final ColorSwatch9 swatch;
  final CharlotteThemeConfig config;
  const _ColorRow({required this.name, required this.swatch, required this.config});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          SizedBox(width: 80, child: Text(name, style: TextStyle(fontSize: 13, color: config.textSecondary))),
          Expanded(
            child: SizedBox(
              height: 32,
              child: Row(
                children: [
                  for (final shade in [swatch.shade100, swatch.shade300, swatch.base, swatch.shade700, swatch.shade900])
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: shade,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        margin: const EdgeInsets.symmetric(horizontal: 1),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _GlassDemo extends StatelessWidget {
  final String label;
  final String sublabel;
  final CharlotteThemeConfig config;
  const _GlassDemo({required this.label, required this.sublabel, required this.config});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: config.surface,
        borderRadius: BorderRadius.circular(config.radiusMedium),
        border: Border.all(color: Colors.white.withValues(alpha: config.glassBorderOpacity)),
      ),
      child: Row(
        children: [
          Expanded(child: Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: config.textPrimary))),
          Text(sublabel, style: TextStyle(fontSize: 11, color: config.textTertiary)),
        ],
      ),
    );
  }
}

class _RadiusDemo extends StatelessWidget {
  final String label;
  final double value;
  final CharlotteThemeConfig config;
  const _RadiusDemo({required this.label, required this.value, required this.config});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: config.primary.base.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(value),
            border: Border.all(color: config.primary.base.withValues(alpha: 0.3)),
          ),
          child: Center(child: Text('${value.toInt()}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: config.primary.base))),
        ),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 11, color: config.textTertiary)),
      ],
    );
  }
}

class _ComponentRow extends StatelessWidget {
  final String category;
  final int count;
  final String examples;
  final CharlotteThemeConfig config;
  const _ComponentRow({required this.category, required this.count, required this.examples, required this.config});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text('$category ($count)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: config.textPrimary)),
          ),
          Expanded(child: Text(examples, style: TextStyle(fontSize: 12, color: config.textTertiary))),
        ],
      ),
    );
  }
}
