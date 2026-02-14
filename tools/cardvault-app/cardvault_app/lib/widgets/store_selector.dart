import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';

import '../models/store.dart';
import '../theme/cardvault_colors.dart';

class StoreSelector extends StatelessWidget {
  final List<Store> stores;
  final String? selectedId;
  final ValueChanged<String> onSelected;

  const StoreSelector({
    super.key,
    required this.stores,
    required this.selectedId,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    if (stores.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: GlassContainer(
          padding: const EdgeInsets.all(16),
          tint: CardVaultColors.gold500,
          child: const Center(
            child: Text('No stores available',
                style: TextStyle(color: CardVaultColors.dim)),
          ),
        ),
      );
    }

    // Sort stores by distance from a default location (Boston — flagship)
    // In production this would use device GPS.
    final defaultLat = 42.3662; // Boston TD Garden
    final defaultLng = -71.0621;
    final sorted = [...stores];
    sorted.sort((a, b) => a
        .distanceTo(defaultLat, defaultLng)
        .compareTo(b.distanceTo(defaultLat, defaultLng)));

    return SizedBox(
      height: 72,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: sorted.length,
        itemBuilder: (context, index) {
          final store = sorted[index];
          final isSelected = store.id == selectedId;
          final distance =
              store.distanceTo(defaultLat, defaultLng).round();

          return Padding(
            padding: const EdgeInsets.only(right: 10),
            child: GlassChip(
              isSelected: isSelected,
              accentColor: CardVaultColors.gold500,
              onTap: () => onSelected(store.id),
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (store.status == 'flagship')
                        Padding(
                          padding: const EdgeInsets.only(right: 4),
                          child: Icon(Icons.star,
                              size: 12,
                              color: isSelected
                                  ? CardVaultColors.gold500
                                  : CardVaultColors.dim),
                        ),
                      Text(
                        store.city,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: isSelected
                              ? CardVaultColors.gold500
                              : CardVaultColors.text,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${store.state} - ${distance}mi',
                    style: TextStyle(
                      fontSize: 10,
                      color: isSelected
                          ? CardVaultColors.gold500.withValues(alpha: 0.7)
                          : CardVaultColors.dim,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
