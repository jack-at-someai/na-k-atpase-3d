import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// =============================================================================
// KRF SYNTAX HIGHLIGHTER
// =============================================================================
//
// Renders KRF (Knowledge Representation Format) S-expressions with syntax
// highlighting. KRF is CycL-derived first-order logic with parenthesized
// prefix notation used throughout the Charlotte OS boot image.
//
// Token categories:
//   - Comments (;;)          → gray
//   - Keywords (isa, etc.)   → tertiary blue
//   - Primitives (NODE, etc.)→ primary red
//   - Variables (?x)         → secondary mauve
//   - Register fields (:x)   → light red
//   - Strings ("...")        → light mauve
//   - Parentheses            → dim gray
//   - Default text           → textPrimary
//
// =============================================================================

// -----------------------------------------------------------------------------
// SomeAI Color Palette (from tokens.json)
// -----------------------------------------------------------------------------

class _KrfColors {
  _KrfColors._();

  static const Color keyword = Color(0xFF1A94D5); // Tertiary blue
  static const Color primitive = Color(0xFFE53E3E); // Primary red
  static const Color variable = Color(0xFF9B7878); // Secondary mauve
  static const Color registerField = Color(0xFFF56565); // Light red (primary 400)
  static const Color string = Color(0xFFC4A8A8); // Light mauve (secondary 300)
  static const Color comment = Color(0xFF666666); // Dim gray
  static const Color paren = Color(0xFF666666); // Dim gray
  static const Color text = Color(0xFFE8E0E0); // textPrimary
  static const Color surface = Color(0xFF1A1A1A); // surface
}

// -----------------------------------------------------------------------------
// Token Types
// -----------------------------------------------------------------------------

enum _KrfTokenType {
  comment,
  keyword,
  primitive,
  variable,
  registerField,
  string,
  paren,
  text,
}

// -----------------------------------------------------------------------------
// Token
// -----------------------------------------------------------------------------

class _KrfToken {
  final String text;
  final _KrfTokenType type;

  const _KrfToken(this.text, this.type);
}

// -----------------------------------------------------------------------------
// Tokenizer
// -----------------------------------------------------------------------------

/// CycL/KRF keywords — predicates and logical connectives.
const _krfKeywords = <String>{
  'isa',
  'genls',
  'genlMt',
  'implies',
  'thereExists',
  'and',
  'or',
  'not',
  'comment',
  'arity',
  'arg1Isa',
  'arg2Isa',
  'disjointWith',
  'inverseOf',
  'defaultTrue',
  'defaultValue',
  'in-microtheory',
};

/// Charlotte's five irreducible primitives + FACT.
const _krfPrimitives = <String>{
  'NODE',
  'EDGE',
  'METRIC',
  'SIGNAL',
  'PROTOCOL',
  'FACT',
};

/// Tokenize a KRF source string into a flat list of styled tokens.
List<_KrfToken> _tokenize(String source) {
  final tokens = <_KrfToken>[];
  final lines = source.split('\n');

  for (var i = 0; i < lines.length; i++) {
    if (i > 0) {
      tokens.add(const _KrfToken('\n', _KrfTokenType.text));
    }

    final line = lines[i];

    // Check for comment lines (;; prefix, possibly with leading whitespace).
    final trimmed = line.trimLeft();
    if (trimmed.startsWith(';')) {
      tokens.add(_KrfToken(line, _KrfTokenType.comment));
      continue;
    }

    // Tokenize the line character by character.
    _tokenizeLine(line, tokens);
  }

  return tokens;
}

void _tokenizeLine(String line, List<_KrfToken> tokens) {
  var pos = 0;
  final len = line.length;

  while (pos < len) {
    final ch = line[pos];

    // Inline comment — everything from ; to end of line.
    if (ch == ';') {
      tokens.add(_KrfToken(line.substring(pos), _KrfTokenType.comment));
      return;
    }

    // Parentheses.
    if (ch == '(' || ch == ')') {
      tokens.add(_KrfToken(ch, _KrfTokenType.paren));
      pos++;
      continue;
    }

    // Whitespace run.
    if (ch == ' ' || ch == '\t') {
      final start = pos;
      while (pos < len && (line[pos] == ' ' || line[pos] == '\t')) {
        pos++;
      }
      tokens.add(_KrfToken(line.substring(start, pos), _KrfTokenType.text));
      continue;
    }

    // Quoted string.
    if (ch == '"') {
      final start = pos;
      pos++; // skip opening quote
      while (pos < len && line[pos] != '"') {
        if (line[pos] == '\\' && pos + 1 < len) {
          pos++; // skip escaped character
        }
        pos++;
      }
      if (pos < len) pos++; // skip closing quote
      tokens.add(_KrfToken(line.substring(start, pos), _KrfTokenType.string));
      continue;
    }

    // Variable — starts with ?
    if (ch == '?') {
      final start = pos;
      pos++;
      while (pos < len && _isSymbolChar(line[pos])) {
        pos++;
      }
      tokens.add(_KrfToken(line.substring(start, pos), _KrfTokenType.variable));
      continue;
    }

    // Register field — starts with : (single, double, or triple colon).
    if (ch == ':') {
      final start = pos;
      // Consume all leading colons.
      while (pos < len && line[pos] == ':') {
        pos++;
      }
      // Consume the field name.
      while (pos < len && _isSymbolChar(line[pos])) {
        pos++;
      }
      tokens.add(
        _KrfToken(line.substring(start, pos), _KrfTokenType.registerField),
      );
      continue;
    }

    // Symbol (word) — classify as keyword, primitive, or plain text.
    if (_isSymbolChar(ch)) {
      final start = pos;
      while (pos < len && _isSymbolChar(line[pos])) {
        pos++;
      }
      final word = line.substring(start, pos);

      if (_krfPrimitives.contains(word)) {
        tokens.add(_KrfToken(word, _KrfTokenType.primitive));
      } else if (_krfKeywords.contains(word)) {
        tokens.add(_KrfToken(word, _KrfTokenType.keyword));
      } else {
        tokens.add(_KrfToken(word, _KrfTokenType.text));
      }
      continue;
    }

    // Fallback — single character.
    tokens.add(_KrfToken(ch, _KrfTokenType.text));
    pos++;
  }
}

/// Returns true if [ch] is a valid KRF symbol character (letters, digits,
/// hyphens, underscores, dots, slashes — anything that isn't whitespace,
/// parens, quotes, semicolons, colons, or question marks).
bool _isSymbolChar(String ch) {
  if (ch.isEmpty) return false;
  final c = ch.codeUnitAt(0);
  // Reject: space, tab, ( ) " ; : ?
  if (c <= 0x20) return false; // control chars + space
  if (c == 0x28 || c == 0x29) return false; // ( )
  if (c == 0x22) return false; // "
  if (c == 0x3B) return false; // ;
  if (c == 0x3A) return false; // :
  if (c == 0x3F) return false; // ?
  return true;
}

// -----------------------------------------------------------------------------
// Color Mapping
// -----------------------------------------------------------------------------

Color _colorForToken(_KrfTokenType type) {
  return switch (type) {
    _KrfTokenType.comment => _KrfColors.comment,
    _KrfTokenType.keyword => _KrfColors.keyword,
    _KrfTokenType.primitive => _KrfColors.primitive,
    _KrfTokenType.variable => _KrfColors.variable,
    _KrfTokenType.registerField => _KrfColors.registerField,
    _KrfTokenType.string => _KrfColors.string,
    _KrfTokenType.paren => _KrfColors.paren,
    _KrfTokenType.text => _KrfColors.text,
  };
}

FontWeight _weightForToken(_KrfTokenType type) {
  return switch (type) {
    _KrfTokenType.keyword => FontWeight.w600,
    _KrfTokenType.primitive => FontWeight.w700,
    _ => FontWeight.w400,
  };
}

FontStyle _styleForToken(_KrfTokenType type) {
  return switch (type) {
    _KrfTokenType.comment => FontStyle.italic,
    _ => FontStyle.normal,
  };
}

// -----------------------------------------------------------------------------
// KrfSyntaxHighlighter Widget
// -----------------------------------------------------------------------------

/// Renders KRF source code with syntax highlighting using [RichText].
///
/// Takes a [code] string of KRF/CycL S-expressions and produces a
/// colorized rendering with the SomeAI brand palette.
///
/// ```dart
/// KrfSyntaxHighlighter(
///   code: '(isa NODE Primitive)',
/// )
/// ```
class KrfSyntaxHighlighter extends StatelessWidget {
  /// The KRF source code to highlight.
  final String code;

  /// Base text style. Font family defaults to Inter (monospace weight)
  /// via Google Fonts. Color and size can be overridden.
  final TextStyle? baseStyle;

  const KrfSyntaxHighlighter({
    super.key,
    required this.code,
    this.baseStyle,
  });

  @override
  Widget build(BuildContext context) {
    final defaultBase = GoogleFonts.inter(
      fontSize: 13,
      height: 1.6,
      color: _KrfColors.text,
      fontFeatures: const [FontFeature.tabularFigures()],
    );

    final effectiveBase = defaultBase.merge(baseStyle);
    final tokens = _tokenize(code);

    final spans = tokens.map((token) {
      return TextSpan(
        text: token.text,
        style: effectiveBase.copyWith(
          color: _colorForToken(token.type),
          fontWeight: _weightForToken(token.type),
          fontStyle: _styleForToken(token.type),
        ),
      );
    }).toList();

    return RichText(
      text: TextSpan(children: spans),
      softWrap: true,
    );
  }
}

// -----------------------------------------------------------------------------
// KrfCodeBlock Widget
// -----------------------------------------------------------------------------

/// A complete KRF code block with dark background, padding, rounded corners,
/// and horizontal scrolling for long lines.
///
/// Wraps [KrfSyntaxHighlighter] in a styled container that matches the
/// SomeAI glassmorphic design language.
///
/// ```dart
/// KrfCodeBlock(
///   code: '''
/// (in-microtheory CharlotteKernelMt)
///
/// (isa NODE Primitive)
/// (isa EDGE Primitive)
/// (comment NODE "Identity. Any uniquely identifiable entity in the graph.")
/// ''',
///   showLineNumbers: true,
/// )
/// ```
class KrfCodeBlock extends StatelessWidget {
  /// The KRF source code to display.
  final String code;

  /// Base text style override.
  final TextStyle? baseStyle;

  /// Whether to display line numbers in the gutter.
  final bool showLineNumbers;

  /// Maximum height before the block scrolls vertically.
  /// Null means unbounded (wraps to content height).
  final double? maxHeight;

  /// Border radius of the container.
  final double borderRadius;

  /// Padding inside the container.
  final EdgeInsetsGeometry padding;

  const KrfCodeBlock({
    super.key,
    required this.code,
    this.baseStyle,
    this.showLineNumbers = false,
    this.maxHeight,
    this.borderRadius = 10,
    this.padding = const EdgeInsets.all(16),
  });

  @override
  Widget build(BuildContext context) {
    final defaultBase = GoogleFonts.inter(
      fontSize: 13,
      height: 1.6,
      color: _KrfColors.text,
      fontFeatures: const [FontFeature.tabularFigures()],
    );

    final effectiveBase = defaultBase.merge(baseStyle);

    Widget content;

    if (showLineNumbers) {
      content = _buildWithLineNumbers(effectiveBase);
    } else {
      content = SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: KrfSyntaxHighlighter(
          code: code,
          baseStyle: effectiveBase,
        ),
      );
    }

    if (maxHeight != null) {
      content = ConstrainedBox(
        constraints: BoxConstraints(maxHeight: maxHeight!),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: content,
        ),
      );
    }

    return Container(
      width: double.infinity,
      padding: padding,
      decoration: BoxDecoration(
        color: _KrfColors.surface,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.08),
          width: 1,
        ),
      ),
      child: content,
    );
  }

  Widget _buildWithLineNumbers(TextStyle effectiveBase) {
    final lines = code.split('\n');
    final gutterWidth = '${lines.length}'.length;

    final gutterStyle = effectiveBase.copyWith(
      color: _KrfColors.comment.withValues(alpha: 0.5),
      fontWeight: FontWeight.w400,
    );

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Gutter — line numbers.
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(lines.length, (i) {
              return SizedBox(
                height: effectiveBase.fontSize! * (effectiveBase.height ?? 1.6),
                child: Text(
                  '${i + 1}'.padLeft(gutterWidth),
                  style: gutterStyle,
                ),
              );
            }),
          ),

          // Separator.
          Container(
            width: 1,
            margin: const EdgeInsets.symmetric(horizontal: 12),
            color: Colors.white.withValues(alpha: 0.06),
          ),

          // Code body — each line highlighted independently.
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: lines.map((line) {
              return SizedBox(
                height: effectiveBase.fontSize! * (effectiveBase.height ?? 1.6),
                child: KrfSyntaxHighlighter(
                  code: line,
                  baseStyle: effectiveBase,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
