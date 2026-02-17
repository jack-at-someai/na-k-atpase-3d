import 'package:flutter/material.dart';
import '../../theme.dart';

class NervousSystemScreen extends StatelessWidget {
  const NervousSystemScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('Nervous System', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'IoT Sensor Network',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: config.textPrimary),
          ),
          const SizedBox(height: 8),
          Text(
            'The physical layer that feeds Charlotte\'s valuation pipeline. Sensors produce METRICs. The pipeline produces PROTOCOLs.',
            style: TextStyle(fontSize: 15, color: config.textSecondary, height: 1.6),
          ),
          const SizedBox(height: 32),

          // Hub
          _NodeCard(
            name: 'Hub — Raspberry Pi 5',
            type: 'CENTRAL',
            specs: const [
              'Broadcom BCM2712, 2.4GHz quad-core 64-bit Arm Cortex-A76',
              '8GB LPDDR4X-4267 SDRAM',
              'Dual 4Kp60 HDMI, PCIe 2.0 x1',
              'Runs Charlotte OS instance + MQTT broker',
              'SQLite local store + Firebase sync',
            ],
            color: config.primary.base,
            config: config,
          ),
          const SizedBox(height: 12),

          // Connection
          Center(
            child: Column(
              children: [
                Icon(Icons.swap_vert, color: config.textTertiary, size: 28),
                Text('MQTT / Wi-Fi / BLE', style: TextStyle(fontSize: 11, color: config.textTertiary, letterSpacing: 1)),
                Icon(Icons.swap_vert, color: config.textTertiary, size: 28),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Satellites
          _NodeCard(
            name: 'Satellites — Pi Zero 2W',
            type: 'EDGE',
            specs: const [
              'RP3A0-AU, 1GHz quad-core 64-bit Arm Cortex-A53',
              '512MB LPDDR2 SDRAM',
              '2.4GHz 802.11 b/g/n Wi-Fi, Bluetooth 4.2/BLE',
              'Sensor payload via GPIO / I2C / SPI',
              'Publishes METRIC frames to hub via MQTT',
            ],
            color: config.tertiary.base,
            config: config,
          ),
          const SizedBox(height: 24),

          // Data flow
          Text('DATA FLOW', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: config.textTertiary)),
          const SizedBox(height: 12),
          _FlowStep(step: '1', label: 'Sensor reads physical state', sublabel: 'Temperature, pressure, vibration, flow rate', config: config),
          _FlowStep(step: '2', label: 'Satellite publishes METRIC frame', sublabel: 'MQTT topic: site/zone/sensor/metric-type', config: config),
          _FlowStep(step: '3', label: 'Hub receives and stores METRIC', sublabel: 'SQLite append-only log + Firebase sync', config: config),
          _FlowStep(step: '4', label: 'Charlotte evaluates SIGNAL rules', sublabel: 'Threshold detection, anomaly detection, freshness', config: config),
          _FlowStep(step: '5', label: 'PROTOCOL fires if conditions met', sublabel: 'Alert, dispatch, escalate — with full dive line', config: config),

          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: config.primary.base.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(config.radiusMedium),
              border: Border.all(color: config.primary.base.withValues(alpha: 0.2)),
            ),
            child: Text(
              'Every PROTOCOL traces back through SIGNALs to METRICs to physical sensor readings. '
              'The dive line is unbroken from action to photon.',
              style: TextStyle(fontSize: 13, color: config.textPrimary, height: 1.6, fontStyle: FontStyle.italic),
            ),
          ),
        ],
      ),
    );
  }
}

class _NodeCard extends StatelessWidget {
  final String name;
  final String type;
  final List<String> specs;
  final Color color;
  final CharlotteThemeConfig config;

  const _NodeCard({
    required this.name,
    required this.type,
    required this.specs,
    required this.color,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(config.radiusLarge),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: color))),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(type, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: color, letterSpacing: 1)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...specs.map((s) => Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.circle, size: 6, color: color.withValues(alpha: 0.5)),
                const SizedBox(width: 8),
                Expanded(child: Text(s, style: TextStyle(fontSize: 13, color: config.textSecondary, height: 1.4))),
              ],
            ),
          )),
        ],
      ),
    );
  }
}

class _FlowStep extends StatelessWidget {
  final String step;
  final String label;
  final String sublabel;
  final CharlotteThemeConfig config;

  const _FlowStep({
    required this.step,
    required this.label,
    required this.sublabel,
    required this.config,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: config.primary.base.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(step, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: config.primary.base)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: config.textPrimary)),
                Text(sublabel, style: TextStyle(fontSize: 12, color: config.textTertiary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
