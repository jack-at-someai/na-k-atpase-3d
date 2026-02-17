import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 32),
              // Header
              Center(
                child: Column(
                  children: [
                    Text(
                      'SomeAI',
                      style: TextStyle(
                        fontSize: 42,
                        fontWeight: FontWeight.w800,
                        color: config.primary.base,
                        letterSpacing: -2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Infrastructure for Observable Reality',
                      style: TextStyle(
                        fontSize: 15,
                        color: config.textSecondary,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),

              // Core Documents
              _SectionHeader(title: 'CORE DOCUMENTS', config: config),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _NavCard(
                    title: 'PRD',
                    subtitle: 'Product Requirements',
                    icon: Icons.description_outlined,
                    route: '/docs/prd',
                    config: config,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _NavCard(
                    title: 'SDD',
                    subtitle: 'Software Design',
                    icon: Icons.architecture_outlined,
                    route: '/docs/sdd',
                    config: config,
                  )),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _NavCard(
                    title: 'KRF Guide',
                    subtitle: 'Developer Guide',
                    icon: Icons.menu_book_outlined,
                    route: '/docs/krf-guide',
                    config: config,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _NavCard(
                    title: 'Boot Image',
                    subtitle: '31 KRF Files',
                    icon: Icons.memory_outlined,
                    route: '/charlotte/boot-image',
                    config: config,
                  )),
                ],
              ),
              const SizedBox(height: 32),

              // Charlotte OS
              _SectionHeader(title: 'CHARLOTTE OS', config: config),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _NavCard(
                    title: 'Primitives',
                    subtitle: '5 Irreducibles',
                    icon: Icons.hub_outlined,
                    route: '/charlotte/primitives',
                    config: config,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _NavCard(
                    title: 'Valuation',
                    subtitle: 'Two-Layer Split',
                    icon: Icons.layers_outlined,
                    route: '/charlotte/valuation-layer',
                    config: config,
                  )),
                ],
              ),
              const SizedBox(height: 32),

              // Clients
              _SectionHeader(title: 'CLIENTS', config: config),
              const SizedBox(height: 12),
              _WideNavCard(
                title: 'Client Hub',
                subtitle: 'ISG, Sounder, and pipeline',
                icon: Icons.business_outlined,
                route: '/clients',
                config: config,
              ),
              const SizedBox(height: 32),

              // Organization
              _SectionHeader(title: 'ORGANIZATION', config: config),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _NavCard(
                    title: 'Dual Engine',
                    subtitle: 'SomeAI + SumAI',
                    icon: Icons.sync_alt_outlined,
                    route: '/org/dual-engine',
                    config: config,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _NavCard(
                    title: 'Team',
                    subtitle: 'People',
                    icon: Icons.people_outlined,
                    route: '/org/team',
                    config: config,
                  )),
                ],
              ),
              const SizedBox(height: 32),

              // Research
              _SectionHeader(title: 'RESEARCH', config: config),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _NavCard(
                    title: 'SumAI',
                    subtitle: 'Research Arm',
                    icon: Icons.science_outlined,
                    route: '/research/sumai',
                    config: config,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _NavCard(
                    title: 'References',
                    subtitle: 'Library',
                    icon: Icons.library_books_outlined,
                    route: '/research/references',
                    config: config,
                  )),
                ],
              ),
              const SizedBox(height: 32),

              // Infrastructure
              _SectionHeader(title: 'INFRASTRUCTURE', config: config),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _NavCard(
                    title: 'Nervous System',
                    subtitle: 'IoT Architecture',
                    icon: Icons.sensors_outlined,
                    route: '/infra/nervous-system',
                    config: config,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _NavCard(
                    title: 'Design System',
                    subtitle: 'Liquid Glass',
                    icon: Icons.palette_outlined,
                    route: '/infra/design-system',
                    config: config,
                  )),
                ],
              ),
              const SizedBox(height: 12),
              _WideNavCard(
                title: 'Knowledge Graph',
                subtitle: 'D3 visualization of the Charlotte substrate',
                icon: Icons.account_tree_outlined,
                route: '/infra/knowledge-graph',
                config: config,
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final CharlotteThemeConfig config;

  const _SectionHeader({required this.title, required this.config});

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

class _NavCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final String route;
  final CharlotteThemeConfig config;

  const _NavCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.route,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go(route),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: config.surface.withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(config.radiusMedium),
          border: Border.all(
            color: Colors.white.withValues(alpha: config.glassBorderOpacity),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: config.primary.base, size: 24),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: config.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 12,
                color: config.textTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _WideNavCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final String route;
  final CharlotteThemeConfig config;

  const _WideNavCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.route,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go(route),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: config.surface.withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(config.radiusMedium),
          border: Border.all(
            color: Colors.white.withValues(alpha: config.glassBorderOpacity),
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: config.primary.base, size: 28),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: config.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: config.textTertiary,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: config.textTertiary, size: 20),
          ],
        ),
      ),
    );
  }
}
