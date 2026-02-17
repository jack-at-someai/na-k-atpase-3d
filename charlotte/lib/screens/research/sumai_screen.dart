import 'package:flutter/material.dart';
import '../../theme.dart';

class SumaiScreen extends StatelessWidget {
  const SumaiScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('SumAI', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'The Divergent Engine',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: config.tertiary.base),
          ),
          const SizedBox(height: 8),
          Text(
            'SumAI discovers capabilities. SomeAI ships them. The research makes the product better. The product funds the research.',
            style: TextStyle(fontSize: 15, color: config.textSecondary, height: 1.6, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 32),

          _SectionLabel(title: 'OASIS FRAMEWORK', config: config),
          const SizedBox(height: 8),
          Text(
            'Observation, Abstraction, Synthesis, Integration, Simulation — the five cognitive operations that define how Charlotte perceives and reasons about reality.',
            style: TextStyle(fontSize: 14, color: config.textSecondary, height: 1.6),
          ),
          const SizedBox(height: 16),

          _SenseCard(
            name: 'Vision',
            icon: Icons.visibility_outlined,
            description: 'Camera arrays, LIDAR, satellite imagery. Spatial awareness from photons to point clouds.',
            config: config,
          ),
          _SenseCard(
            name: 'Audition',
            icon: Icons.hearing_outlined,
            description: 'Acoustic monitoring, vibration analysis, ultrasonic sensing. Equipment health from sound signatures.',
            config: config,
          ),
          _SenseCard(
            name: 'Touch',
            icon: Icons.touch_app_outlined,
            description: 'Pressure, temperature, humidity, strain gauges. Physical state from contact sensors.',
            config: config,
          ),
          _SenseCard(
            name: 'Chemical',
            icon: Icons.science_outlined,
            description: 'Gas analysis, pH monitoring, spectrometry. Molecular state from chemical sensors.',
            config: config,
          ),
          _SenseCard(
            name: 'Proprioception',
            icon: Icons.sensors_outlined,
            description: 'IMU, accelerometer, gyroscope. Self-awareness of position and motion in space.',
            config: config,
          ),

          const SizedBox(height: 24),
          _SectionLabel(title: 'THE BRAIN', config: config),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.tertiary.base.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(config.radiusLarge),
              border: Border.all(color: config.tertiary.base.withValues(alpha: 0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Charlotte OS', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: config.tertiary.base)),
                const SizedBox(height: 8),
                Text(
                  'The five senses feed raw data. The brain — Charlotte OS itself — runs the valuation pipeline. '
                  'METRIC captures the measurement. SIGNAL detects the pattern. PROTOCOL fires the action. '
                  'Every conclusion has a dive line back to a sensor frame.',
                  style: TextStyle(fontSize: 14, color: config.textSecondary, height: 1.6),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),
          _SectionLabel(title: 'HEX CAMPUS VISION', config: config),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.surface,
              borderRadius: BorderRadius.circular(config.radiusMedium),
            ),
            child: Text(
              'A physical research campus built on hexagonal geometry. Labs for each sense. '
              'A central brain building running Charlotte instances. Researchers cycle through — '
              'discover capabilities, ship them through SomeAI, retire into Serengeti, fund the next generation. '
              'The recursive flywheel made physical.',
              style: TextStyle(fontSize: 14, color: config.textSecondary, height: 1.6),
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
      style: TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 1.5,
        color: config.textTertiary,
      ),
    );
  }
}

class _SenseCard extends StatelessWidget {
  final String name;
  final IconData icon;
  final String description;
  final CharlotteThemeConfig config;

  const _SenseCard({
    required this.name,
    required this.icon,
    required this.description,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: config.surface,
        borderRadius: BorderRadius.circular(config.radiusMedium),
        border: Border.all(color: Colors.white.withValues(alpha: config.glassBorderOpacity)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: config.tertiary.base.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 20, color: config.tertiary.base),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: config.textPrimary)),
                const SizedBox(height: 2),
                Text(description, style: TextStyle(fontSize: 12, color: config.textSecondary, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
