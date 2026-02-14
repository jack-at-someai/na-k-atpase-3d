import 'package:flutter/material.dart';

/// CardVault brand palette — extracted from design/brandbook/cardvault/tokens.json.
/// Vault Black + Championship Gold. Dark luxury aesthetic.
class CardVaultColors {
  CardVaultColors._();

  // ---------------------------------------------------------------------------
  // Vault Black (primary surface)
  // ---------------------------------------------------------------------------
  static const vault50 = Color(0xFFF5F5F3);
  static const vault100 = Color(0xFFE8E6E1);
  static const vault300 = Color(0xFFA8A49C);
  static const vault500 = Color(0xFF1A1A1A);
  static const vault600 = Color(0xFF141414);
  static const vault700 = Color(0xFF0E0E0E);
  static const vault800 = Color(0xFF0A0A0A);
  static const vault900 = Color(0xFF050505);

  // ---------------------------------------------------------------------------
  // Championship Gold (accent)
  // ---------------------------------------------------------------------------
  static const gold50 = Color(0xFFFFF9EB);
  static const gold100 = Color(0xFFFCEFC5);
  static const gold300 = Color(0xFFE8C84A);
  static const gold500 = Color(0xFFD4A017);
  static const gold600 = Color(0xFFB8860B);
  static const gold700 = Color(0xFF8B6914);
  static const gold800 = Color(0xFF5C4510);
  static const gold900 = Color(0xFF2E220A);

  // ---------------------------------------------------------------------------
  // Card White (content surfaces)
  // ---------------------------------------------------------------------------
  static const card50 = Color(0xFFFFFFFF);
  static const card100 = Color(0xFFFAFAF8);
  static const card300 = Color(0xFFE8E6E1);
  static const card500 = Color(0xFFD1CFC8);
  static const card700 = Color(0xFF8A877F);
  static const card900 = Color(0xFF3D3B37);

  // ---------------------------------------------------------------------------
  // Trophy Silver (neutral)
  // ---------------------------------------------------------------------------
  static const silver50 = Color(0xFFF8F8F8);
  static const silver300 = Color(0xFFC0C0C0);
  static const silver500 = Color(0xFF8E8E8E);
  static const silver700 = Color(0xFF5C5C5C);
  static const silver900 = Color(0xFF2A2A2A);

  // ---------------------------------------------------------------------------
  // Grading condition colors
  // ---------------------------------------------------------------------------
  static const gradeGem = Color(0xFF00A651);
  static const gradeMint = Color(0xFF4CAF50);
  static const gradeNear = Color(0xFF8BC34A);
  static const gradeExcellent = Color(0xFFFFC107);
  static const gradeGood = Color(0xFFFF9800);
  static const gradePoor = Color(0xFFF44336);

  // ---------------------------------------------------------------------------
  // Glass
  // ---------------------------------------------------------------------------
  static const glassBg = Color(0xEB0A0A0A); // rgba(10,10,10,0.92)
  static const glassBorder = Color(0x2ED4A017); // rgba(212,160,23,0.18)

  // ---------------------------------------------------------------------------
  // Semantic aliases
  // ---------------------------------------------------------------------------
  static const background = vault800;
  static const surface = vault500;
  static const surfaceVariant = vault600;
  static const text = vault100;
  static const dim = vault300;
  static const accent = gold500;
  static const accentLight = gold300;
  static const accentDark = gold700;
  static const error = gradePoor;
  static const success = gradeGem;
}
