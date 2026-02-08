import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';

/// ProtocolCheckpoint - ProtocolAtom with date label and optional connector.
class ProtocolCheckpoint extends StatelessWidget {
  final ProtocolState state;
  final DateTime targetDate;
  final String? label;
  final bool showConnector;

  const ProtocolCheckpoint({
    super.key,
    required this.state,
    required this.targetDate,
    this.label,
    this.showConnector = false,
  });

  String _formatDate(DateTime date) {
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[date.month - 1]} ${date.day}';
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Date at top
            Text(
              _formatDate(targetDate),
              style: TextStyle(
                color: CharlotteColors.textTertiary,
                fontSize: 11,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 8),
            // Protocol atom
            ProtocolAtom(state: state, targetDate: targetDate),
            const SizedBox(height: 8),
            // Label below
            if (label != null)
              SizedBox(
                width: 80,
                child: Text(
                  label!,
                  style: TextStyle(
                    color: switch (state) {
                      ProtocolState.pending => CharlotteColors.textSecondary,
                      ProtocolState.completed => CharlotteColors.success,
                      ProtocolState.missed => CharlotteColors.error,
                    },
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
          ],
        ),
        // Connector line
        if (showConnector)
          Container(
            width: 40,
            height: 2,
            margin: const EdgeInsets.only(bottom: 24),
            decoration: BoxDecoration(
              color: CharlotteColors.trackBorder,
              borderRadius: BorderRadius.circular(1),
            ),
          ),
      ],
    );
  }
}
