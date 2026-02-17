import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:google_fonts/google_fonts.dart';

/// GlassMarkdownRenderer - Renders markdown content with glassmorphic styling.
///
/// Designed for dark-surface contexts where the parent container provides
/// the backdrop blur and glass fill. Text renders in the SomeAI palette
/// (warm off-white on dark) with red accents for links, code, and blockquotes.
class GlassMarkdownRenderer extends StatelessWidget {
  /// The raw markdown string to render.
  final String markdown;

  /// Optional callback when a link is tapped.
  final MarkdownTapLinkCallback? onTapLink;

  /// Optional padding around the markdown body.
  final EdgeInsetsGeometry padding;

  const GlassMarkdownRenderer({
    super.key,
    required this.markdown,
    this.onTapLink,
    this.padding = const EdgeInsets.all(16),
  });

  // -- SomeAI palette constants (mirrors theme.dart) --
  static const _textPrimary = Color(0xFFE8E0E0);
  static const _textSecondary = Color(0xFFCCCCCC);
  static const _redPrimary = Color(0xFFE53E3E);
  static const _redLight = Color(0xFFF56565);
  static const _codeBg = Color(0xFF1A1A1A);
  static const _border = Color(0xFF333333);

  MarkdownStyleSheet _buildStyleSheet(BuildContext context) {
    final baseText = GoogleFonts.inter(
      color: _textPrimary,
      fontSize: 15,
      height: 1.6,
    );

    final monoStyle = GoogleFonts.inter(
      color: _redLight,
      fontSize: 13,
      fontWeight: FontWeight.w500,
      backgroundColor: _codeBg,
    );

    return MarkdownStyleSheet(
      // -- Body text --
      p: baseText,
      pPadding: const EdgeInsets.only(bottom: 8),

      // -- Headings --
      h1: GoogleFonts.inter(
        color: _textPrimary,
        fontSize: 28,
        fontWeight: FontWeight.w700,
        height: 1.3,
      ),
      h1Padding: const EdgeInsets.only(top: 16, bottom: 8),
      h2: GoogleFonts.inter(
        color: _textPrimary,
        fontSize: 22,
        fontWeight: FontWeight.w700,
        height: 1.3,
      ),
      h2Padding: const EdgeInsets.only(top: 14, bottom: 6),
      h3: GoogleFonts.inter(
        color: _textPrimary,
        fontSize: 18,
        fontWeight: FontWeight.w700,
        height: 1.4,
      ),
      h3Padding: const EdgeInsets.only(top: 12, bottom: 4),
      h4: GoogleFonts.inter(
        color: _textPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 1.4,
      ),
      h5: GoogleFonts.inter(
        color: _textSecondary,
        fontSize: 15,
        fontWeight: FontWeight.w600,
        height: 1.4,
      ),
      h6: GoogleFonts.inter(
        color: _textSecondary,
        fontSize: 14,
        fontWeight: FontWeight.w600,
        height: 1.4,
      ),

      // -- Links --
      a: baseText.copyWith(
        color: _redPrimary,
        decoration: TextDecoration.underline,
        decorationColor: _redPrimary.withValues(alpha: 0.5),
      ),

      // -- Emphasis --
      em: baseText.copyWith(fontStyle: FontStyle.italic),
      strong: baseText.copyWith(fontWeight: FontWeight.w700),

      // -- Inline code --
      code: monoStyle,
      codeblockPadding: const EdgeInsets.all(14),

      // -- Code block --
      codeblockDecoration: BoxDecoration(
        color: _codeBg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: _redPrimary.withValues(alpha: 0.3),
          width: 1,
        ),
      ),

      // -- Blockquote --
      blockquote: baseText.copyWith(
        fontStyle: FontStyle.italic,
        color: _textSecondary,
      ),
      blockquoteDecoration: const BoxDecoration(
        border: Border(
          left: BorderSide(
            color: _redPrimary,
            width: 3,
          ),
        ),
      ),
      blockquotePadding: const EdgeInsets.only(left: 14, top: 4, bottom: 4),

      // -- Lists --
      listBullet: baseText.copyWith(color: _redPrimary),
      listIndent: 24,

      // -- Table --
      tableBorder: TableBorder.all(color: _border, width: 1),
      tableHead: baseText.copyWith(fontWeight: FontWeight.w600),
      tableBody: baseText,
      tableCellsPadding: const EdgeInsets.symmetric(
        horizontal: 10,
        vertical: 6,
      ),
      tableHeadAlign: TextAlign.left,

      // -- Horizontal rule --
      horizontalRuleDecoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: _border, width: 1),
        ),
      ),

      // -- Checkbox (task lists) --
      checkbox: baseText.copyWith(color: _redPrimary),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: padding,
      child: MarkdownBody(
        data: markdown,
        selectable: true,
        styleSheet: _buildStyleSheet(context),
        onTapLink: onTapLink,
      ),
    );
  }
}
