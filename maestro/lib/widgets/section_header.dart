import 'package:flutter/material.dart';

class MaestroSectionHeader extends StatelessWidget {
  final String label;
  final Color color;

  const MaestroSectionHeader(this.label, this.color, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: TextStyle(
        color: color,
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.5,
      ),
    );
  }
}
