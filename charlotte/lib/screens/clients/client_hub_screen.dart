import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../theme.dart';

class ClientHubScreen extends StatelessWidget {
  const ClientHubScreen({super.key});

  static const _clients = [
    _ClientData(id: 'isg', name: 'Industrial Service Group', industry: 'Industrial Services', contract: '\$1.4M/2yr', status: 'Active', embeds: 'ServiceIQ'),
    _ClientData(id: 'sounder', name: 'Sounder', industry: 'Swine Agriculture', contract: 'First Client/MVP', status: 'Active', embeds: 'BarnOS'),
  ];

  static const _pipeline = [
    _ClientData(id: 'cardvault', name: 'CardVault', industry: 'Premium Retail', contract: '\$510K', status: 'Pipeline', embeds: ''),
    _ClientData(id: 'allstate', name: 'Allstate Manufacturing', industry: 'Metal Fixtures', contract: '\$105K', status: 'Pipeline', embeds: ''),
    _ClientData(id: 'sc-online', name: 'SC Online Sales', industry: 'Livestock Auctions', contract: '\$135K', status: 'Pipeline', embeds: ''),
    _ClientData(id: 'wendt', name: 'Wendt Group', industry: 'Show Livestock Genetics', contract: '\$156K', status: 'Pipeline', embeds: ''),
    _ClientData(id: 'top-tier', name: 'Top Tier Moving', industry: 'Logistics', contract: '\$93K', status: 'Pipeline', embeds: ''),
    _ClientData(id: 'ppp', name: 'PPP Instruments', industry: 'Rare Instruments', contract: '\$100M fund', status: 'Pipeline', embeds: ''),
  ];

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Clients', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('ACTIVE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.primary.base)),
          const SizedBox(height: 8),
          ..._clients.map((c) => _ClientTile(client: c, config: config)),
          const SizedBox(height: 24),
          Text('PIPELINE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.textTertiary)),
          const SizedBox(height: 8),
          ..._pipeline.map((c) => _ClientTile(client: c, config: config)),
        ],
      ),
    );
  }
}

class _ClientData {
  final String id, name, industry, contract, status, embeds;
  const _ClientData({required this.id, required this.name, required this.industry, required this.contract, required this.status, required this.embeds});
}

class _ClientTile extends StatelessWidget {
  final _ClientData client;
  final CharlotteThemeConfig config;

  const _ClientTile({required this.client, required this.config});

  @override
  Widget build(BuildContext context) {
    final isActive = client.status == 'Active';
    return GestureDetector(
      onTap: () => context.go('/clients/${client.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: config.surface,
          borderRadius: BorderRadius.circular(config.radiusMedium),
          border: Border.all(
            color: isActive ? config.primary.base.withValues(alpha: 0.3) : Colors.white.withValues(alpha: 0.1),
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(client.name, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: config.textPrimary)),
                  const SizedBox(height: 2),
                  Text(client.industry, style: TextStyle(fontSize: 12, color: config.textTertiary)),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(client.contract, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: isActive ? config.primary.base : config.textSecondary)),
                if (client.embeds.isNotEmpty)
                  Text(client.embeds, style: TextStyle(fontSize: 11, color: config.textTertiary)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
