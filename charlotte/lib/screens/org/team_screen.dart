import 'package:flutter/material.dart';
import '../../theme.dart';

class TeamScreen extends StatelessWidget {
  const TeamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Team', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _PersonCard(
            name: 'Jack Richard',
            role: 'Founder & CEO',
            detail: 'Northwestern University — Masters in AI, PhD in Swarm Intelligence. Learned KRF directly from Ken Forbus.',
            config: config,
          ),
          _SectionLabel(title: 'KEY INFLUENCES', config: config),
          _PersonCard(
            name: 'Ken Forbus',
            role: 'Advisor / Intellectual Origin',
            detail: 'Northwestern. Creator of Companions cognitive architecture, CycL, Structure Mapping Engine. Charlotte\'s intellectual lineage.',
            config: config,
          ),
          _PersonCard(
            name: 'Kristian Hammond',
            role: 'Advisor',
            detail: 'Northwestern CS. Natural language generation, AI systems.',
            config: config,
          ),
          _SectionLabel(title: 'ORGANIZATIONAL', config: config),
          _PersonCard(
            name: 'Richard Enterprises',
            role: 'Family Holding Company',
            detail: 'Umbrella entity. Never front-line facing. Owns SomeAI.',
            config: config,
          ),
          _PersonCard(
            name: 'Serengeti',
            role: 'Retirement Pool / Flywheel',
            detail: 'Mentors and engineers cycle through: research lab \u2192 retire into Serengeti \u2192 fund next generation.',
            config: config,
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
    return Padding(
      padding: const EdgeInsets.only(top: 24, bottom: 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.5,
          color: config.textTertiary,
        ),
      ),
    );
  }
}

class _PersonCard extends StatelessWidget {
  final String name;
  final String role;
  final String detail;
  final CharlotteThemeConfig config;

  const _PersonCard({
    required this.name,
    required this.role,
    required this.detail,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: config.surface,
        borderRadius: BorderRadius.circular(config.radiusMedium),
        border: Border.all(color: Colors.white.withValues(alpha: config.glassBorderOpacity)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(name, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: config.textPrimary)),
          const SizedBox(height: 2),
          Text(role, style: TextStyle(fontSize: 12, color: config.primary.base)),
          const SizedBox(height: 8),
          Text(detail, style: TextStyle(fontSize: 13, color: config.textSecondary, height: 1.5)),
        ],
      ),
    );
  }
}
