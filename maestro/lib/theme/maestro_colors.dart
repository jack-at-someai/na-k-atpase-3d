import 'package:flutter/material.dart';

/// Semantic colors for Maestro's Hoshin Kanri modules.
/// All hex values ported from the JS prototype's CSS :root.
class MaestroColors {
  MaestroColors._();

  // ---------------------------------------------------------------------------
  // Surface palette (matches SomeAI tokens)
  // ---------------------------------------------------------------------------
  static const background = Color(0xFF141414);
  static const surface = Color(0xFF1A1A1A);
  static const card = Color(0xFF222222);
  static const border = Color(0xFF333333);
  static const text = Color(0xFFE8E0E0);
  static const muted = Color(0xFF666666);

  // ---------------------------------------------------------------------------
  // Accent palette
  // ---------------------------------------------------------------------------
  static const accent = Color(0xFFE53E3E);
  static const accentBright = Color(0xFFF56565);
  static const warning = Color(0xFFF59E0B);
  static const danger = Color(0xFFC53030);
  static const mauve = Color(0xFF9B7878);
  static const mauveLt = Color(0xFFC4A8A8);

  // ---------------------------------------------------------------------------
  // X-Matrix quadrant labels
  // ---------------------------------------------------------------------------
  static const xSouth = Color(0xFFE53E3E); // Breakthroughs
  static const xWest = Color(0xFFF59E0B); // Annual Objectives
  static const xNorth = Color(0xFFC4A8A8); // Improvement Priorities
  static const xEast = Color(0xFF9B7878); // Targets / KPIs

  // ---------------------------------------------------------------------------
  // PDCA cycle phases
  // ---------------------------------------------------------------------------
  static const pdcaPlan = Color(0xFFE53E3E);
  static const pdcaDo = Color(0xFFF59E0B);
  static const pdcaCheck = Color(0xFFC4A8A8);
  static const pdcaAct = Color(0xFF9B7878);

  // ---------------------------------------------------------------------------
  // Kaizen board column headers
  // ---------------------------------------------------------------------------
  static const kaizenIdeas = Color(0xFFF59E0B);
  static const kaizenPlanned = Color(0xFFE53E3E);
  static const kaizenDoing = Color(0xFF9B7878);
  static const kaizenDone = Color(0xFFF56565);

  // ---------------------------------------------------------------------------
  // Catchball hierarchy levels
  // ---------------------------------------------------------------------------
  static const catchballExec = Color(0xFFE53E3E);
  static const catchballSenior = Color(0xFFC53030);
  static const catchballDept = Color(0xFFF59E0B);
  static const catchballTeam = Color(0xFF9B7878);
  static const catchballIndividual = Color(0xFFC4A8A8);

  static const catchballLevels = [
    catchballExec,
    catchballSenior,
    catchballDept,
    catchballTeam,
    catchballIndividual,
  ];

  // ---------------------------------------------------------------------------
  // RAG (Red-Amber-Green) status — bowling chart
  // ---------------------------------------------------------------------------
  static const ragGreenBg = Color(0x2622D3EE); // rgba(34,211,238,.15)
  static const ragGreenText = Color(0xFFF56565);
  static const ragYellowBg = Color(0x1FF59E0B); // rgba(245,158,11,.12)
  static const ragYellowText = Color(0xFFF59E0B);
  static const ragRedBg = Color(0x1FF43F5E); // rgba(244,63,94,.12)
  static const ragRedText = Color(0xFFC53030);

  // ---------------------------------------------------------------------------
  // Correlation symbols
  // ---------------------------------------------------------------------------
  static const correlationColor = Color(0xFFE53E3E);
}
