import 'package:flutter/material.dart';
import '../../theme.dart';

class ClientDetailScreen extends StatelessWidget {
  final String clientId;

  const ClientDetailScreen({super.key, required this.clientId});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    final data = _clientInfo[clientId];
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text(data?['name'] ?? clientId, style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: data == null
          ? Center(child: Text('Client not found', style: TextStyle(color: config.textTertiary)))
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                Text(data['name']!, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: config.textPrimary)),
                const SizedBox(height: 4),
                Text(data['industry']!, style: TextStyle(fontSize: 14, color: config.primary.base)),
                const SizedBox(height: 20),
                _InfoRow(label: 'Contract', value: data['contract']!, config: config),
                _InfoRow(label: 'Revenue', value: data['revenue']!, config: config),
                _InfoRow(label: 'Embeds As', value: data['embeds']!, config: config),
                const SizedBox(height: 24),
                Text('BEFORE CHARLOTTE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.textTertiary)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: config.surface,
                    borderRadius: BorderRadius.circular(config.radiusMedium),
                  ),
                  child: Text(data['before']!, style: TextStyle(fontSize: 13, color: config.textSecondary, height: 1.6)),
                ),
                const SizedBox(height: 16),
                Text('AFTER CHARLOTTE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.primary.base)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: config.primary.base.withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(config.radiusMedium),
                    border: Border.all(color: config.primary.base.withValues(alpha: 0.2)),
                  ),
                  child: Text(data['after']!, style: TextStyle(fontSize: 13, color: config.textPrimary, height: 1.6)),
                ),
              ],
            ),
    );
  }

  static const _clientInfo = {
    'isg': {
      'name': 'Industrial Service Group',
      'industry': 'Industrial Services',
      'contract': '\$1.4M / 2 years',
      'revenue': '\$241M across 16 brands',
      'embeds': 'ServiceIQ',
      'before': '16 acquired brands operating on separate CRMs, manual dispatch across territories, siloed data that PE ownership cannot consolidate.',
      'after': 'Unified equipment graph spanning all 16 brands. Cross-brand dispatch optimization. Real-time PE reporting from a single substrate.',
    },
    'sounder': {
      'name': 'Sounder',
      'industry': 'Swine Agriculture',
      'contract': 'First Client / MVP',
      'revenue': '77K breeders in industry',
      'embeds': 'BarnOS',
      'before': '3 disconnected breed registries with no crossbred system. Farm operations run on fringe software or paper.',
      'after': 'Unified pedigree platform with first crossbred tracking system. Farm-by-farm digital twins. 401K KRF facts.',
    },
  };
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final CharlotteThemeConfig config;

  const _InfoRow({required this.label, required this.value, required this.config});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(label, style: TextStyle(fontSize: 12, color: config.textTertiary)),
          ),
          Expanded(child: Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: config.textPrimary))),
        ],
      ),
    );
  }
}
