import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:fuzzy/fuzzy.dart';


// =============================================================================
// SEARCH OVERLAY - Full-screen fuzzy search across all SomeAI content.
// =============================================================================

// -----------------------------------------------------------------------------
// SearchResult Model
// -----------------------------------------------------------------------------

/// A single searchable item with routing metadata.
class SearchResult {
  final String title;
  final String subtitle;
  final String route;
  final String category;

  const SearchResult({
    required this.title,
    required this.subtitle,
    required this.route,
    required this.category,
  });
}

// -----------------------------------------------------------------------------
// Static Content Registry
// -----------------------------------------------------------------------------

/// Every navigable page in the app, grouped by category.
const List<SearchResult> _searchableItems = [
  // --- Docs ---
  SearchResult(
    title: 'PRD',
    subtitle: 'Product Requirements Document',
    route: '/docs/prd',
    category: 'Docs',
  ),
  SearchResult(
    title: 'SDD',
    subtitle: 'System Design Document',
    route: '/docs/sdd',
    category: 'Docs',
  ),
  SearchResult(
    title: 'KRF Guide',
    subtitle: 'Knowledge Representation Format reference',
    route: '/docs/krf-guide',
    category: 'Docs',
  ),

  // --- Charlotte ---
  SearchResult(
    title: 'Boot Image',
    subtitle: '28 KRF files: kernel, knowledge, spine, reference, agent',
    route: '/charlotte/boot-image',
    category: 'Charlotte',
  ),
  SearchResult(
    title: 'Primitives',
    subtitle: 'NODE, EDGE, METRIC, SIGNAL, PROTOCOL',
    route: '/charlotte/primitives',
    category: 'Charlotte',
  ),
  SearchResult(
    title: 'Valuation Layer',
    subtitle: 'Serial pipeline: METRIC \u2192 SIGNAL \u2192 PROTOCOL',
    route: '/charlotte/valuation-layer',
    category: 'Charlotte',
  ),

  // --- Org ---
  SearchResult(
    title: 'Dual Engine',
    subtitle: 'SomeAI + Charlotte OS organizational model',
    route: '/org/dual-engine',
    category: 'Org',
  ),
  SearchResult(
    title: 'Team',
    subtitle: 'People and roles',
    route: '/org/team',
    category: 'Org',
  ),

  // --- Clients ---
  SearchResult(
    title: 'ISG',
    subtitle: 'Industrial Service Group \u2014 16 brands, \$241M rev',
    route: '/clients/isg',
    category: 'Clients',
  ),
  SearchResult(
    title: 'Sounder',
    subtitle: 'Farm operations \u2014 BarnOS MVP complete',
    route: '/clients/sounder',
    category: 'Clients',
  ),

  // --- Research ---
  SearchResult(
    title: 'SumAI',
    subtitle: 'Research summarization engine',
    route: '/research/sumai',
    category: 'Research',
  ),
  SearchResult(
    title: 'References',
    subtitle: '26-page reference library',
    route: '/research/references',
    category: 'Research',
  ),

  // --- Infra ---
  SearchResult(
    title: 'Nervous System',
    subtitle: 'Event bus, signals, and protocol routing',
    route: '/infra/nervous-system',
    category: 'Infra',
  ),
  SearchResult(
    title: 'Design System',
    subtitle: 'Liquid Glass component library',
    route: '/infra/design-system',
    category: 'Infra',
  ),
  SearchResult(
    title: 'Knowledge Graph',
    subtitle: 'D3.js graph visualization',
    route: '/infra/knowledge-graph',
    category: 'Infra',
  ),
];

// -----------------------------------------------------------------------------
// Category Colors
// -----------------------------------------------------------------------------

/// Map category names to the SomeAI brand palette.
Color _categoryColor(String category) {
  return switch (category) {
    'Docs'      => const Color(0xFF1A94D5), // tertiary blue
    'Charlotte' => const Color(0xFFE53E3E), // primary red
    'Org'       => const Color(0xFF9B7878), // secondary mauve
    'Clients'   => const Color(0xFFF56565), // primary 400
    'Research'  => const Color(0xFF6EC2F0), // tertiary 300
    'Infra'     => const Color(0xFFC53030), // primary 600
    _           => const Color(0xFFE53E3E),
  };
}

/// Map category names to Material icons.
IconData _categoryIcon(String category) {
  return switch (category) {
    'Docs'      => Icons.description_outlined,
    'Charlotte' => Icons.memory_outlined,
    'Org'       => Icons.account_tree_outlined,
    'Clients'   => Icons.business_outlined,
    'Research'  => Icons.science_outlined,
    'Infra'     => Icons.hub_outlined,
    _           => Icons.circle_outlined,
  };
}

// -----------------------------------------------------------------------------
// Public Entry Point
// -----------------------------------------------------------------------------

/// Opens the search overlay as a full-screen modal bottom sheet.
void showSearchOverlay(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.black.withValues(alpha: 0.6),
    builder: (_) => const _SearchOverlay(),
  );
}

// -----------------------------------------------------------------------------
// Search Overlay Widget
// -----------------------------------------------------------------------------

class _SearchOverlay extends StatefulWidget {
  const _SearchOverlay();

  @override
  State<_SearchOverlay> createState() => _SearchOverlayState();
}

class _SearchOverlayState extends State<_SearchOverlay> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  List<SearchResult> _results = [];
  bool _hasQuery = false;

  // Pre-build the fuzzy searcher once.
  late final Fuzzy<SearchResult> _fuzzy = Fuzzy<SearchResult>(
    _searchableItems,
    options: FuzzyOptions(
      keys: [
        WeightedKey(
          name: 'title',
          getter: (r) => r.title,
          weight: 2,
        ),
        WeightedKey(
          name: 'subtitle',
          getter: (r) => r.subtitle,
          weight: 1,
        ),
        WeightedKey(
          name: 'category',
          getter: (r) => r.category,
          weight: 0.5,
        ),
      ],
      threshold: 0.4,
    ),
  );

  @override
  void initState() {
    super.initState();
    _focusNode.requestFocus();
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onQueryChanged(String query) {
    final trimmed = query.trim();
    if (trimmed.isEmpty) {
      setState(() {
        _results = [];
        _hasQuery = false;
      });
      return;
    }
    final fuzzyResults = _fuzzy.search(trimmed);
    setState(() {
      _results = fuzzyResults.map((r) => r.item).toList();
      _hasQuery = true;
    });
  }

  void _navigateTo(String route) {
    Navigator.of(context).pop(); // close the overlay
    context.go(route);
  }

  // ---------------------------------------------------------------------------
  // Build
  // ---------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;

    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 40, sigmaY: 40),
        child: Container(
          height: MediaQuery.of(context).size.height * 0.92,
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A1A).withValues(alpha: 0.96),
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(22),
            ),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.08),
              width: 1,
            ),
          ),
          child: Column(
            children: [
              // Drag handle
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Search field
              Padding(
                padding: EdgeInsets.fromLTRB(16, topPadding > 0 ? 8 : 16, 16, 0),
                child: _buildSearchField(),
              ),

              const SizedBox(height: 8),

              // Divider
              Container(
                height: 1,
                color: Colors.white.withValues(alpha: 0.06),
              ),

              // Results
              Expanded(
                child: _hasQuery ? _buildResultsList() : _buildCategoryGrid(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Search field with glass styling
  // ---------------------------------------------------------------------------

  Widget _buildSearchField() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.07),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.10),
              width: 1,
            ),
          ),
          child: Row(
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 16),
                child: Icon(
                  Icons.search,
                  size: 20,
                  color: Color(0xFF9B7878), // secondary mauve
                ),
              ),
              Expanded(
                child: TextField(
                  controller: _controller,
                  focusNode: _focusNode,
                  onChanged: _onQueryChanged,
                  style: const TextStyle(
                    color: Color(0xFFE8E0E0),
                    fontSize: 16,
                    fontFamily: 'Inter',
                  ),
                  cursorColor: const Color(0xFFE53E3E),
                  decoration: const InputDecoration(
                    hintText: 'Search everything...',
                    hintStyle: TextStyle(
                      color: Color(0xFF666666),
                      fontSize: 16,
                      fontFamily: 'Inter',
                    ),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 14,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),
              if (_controller.text.isNotEmpty)
                GestureDetector(
                  onTap: () {
                    _controller.clear();
                    _onQueryChanged('');
                    _focusNode.requestFocus();
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close,
                        size: 16,
                        color: Color(0xFF9B7878),
                      ),
                    ),
                  ),
                )
              else
                const SizedBox(width: 16),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Fuzzy-matched results list
  // ---------------------------------------------------------------------------

  Widget _buildResultsList() {
    if (_results.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.search_off,
              size: 48,
              color: const Color(0xFF9B7878).withValues(alpha: 0.4),
            ),
            const SizedBox(height: 12),
            const Text(
              'No results found',
              style: TextStyle(
                color: Color(0xFF666666),
                fontSize: 14,
                fontFamily: 'Inter',
              ),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      itemCount: _results.length,
      separatorBuilder: (_, __) => const SizedBox(height: 2),
      itemBuilder: (context, index) {
        final result = _results[index];
        return _SearchResultTile(
          result: result,
          onTap: () => _navigateTo(result.route),
        );
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Default category grid (shown when query is empty)
  // ---------------------------------------------------------------------------

  Widget _buildCategoryGrid() {
    // Group items by category, preserving insertion order.
    final Map<String, List<SearchResult>> grouped = {};
    for (final item in _searchableItems) {
      grouped.putIfAbsent(item.category, () => []).add(item);
    }

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      children: [
        for (final entry in grouped.entries) ...[
          // Category header
          Padding(
            padding: const EdgeInsets.only(top: 12, bottom: 6, left: 4),
            child: Row(
              children: [
                Icon(
                  _categoryIcon(entry.key),
                  size: 14,
                  color: _categoryColor(entry.key),
                ),
                const SizedBox(width: 8),
                Text(
                  entry.key.toUpperCase(),
                  style: TextStyle(
                    color: _categoryColor(entry.key),
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.2,
                    fontFamily: 'Inter',
                  ),
                ),
              ],
            ),
          ),
          // Items
          for (final item in entry.value)
            _SearchResultTile(
              result: item,
              onTap: () => _navigateTo(item.route),
            ),
        ],
      ],
    );
  }
}

// -----------------------------------------------------------------------------
// Search Result Tile
// -----------------------------------------------------------------------------

class _SearchResultTile extends StatelessWidget {
  final SearchResult result;
  final VoidCallback onTap;

  const _SearchResultTile({
    required this.result,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final catColor = _categoryColor(result.category);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        splashColor: catColor.withValues(alpha: 0.08),
        highlightColor: catColor.withValues(alpha: 0.04),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: Row(
            children: [
              // Category icon
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: catColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  _categoryIcon(result.category),
                  size: 18,
                  color: catColor,
                ),
              ),

              const SizedBox(width: 14),

              // Title + subtitle
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      result.title,
                      style: const TextStyle(
                        color: Color(0xFFE8E0E0),
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        fontFamily: 'Inter',
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      result.subtitle,
                      style: const TextStyle(
                        color: Color(0xFF666666),
                        fontSize: 12,
                        fontFamily: 'Inter',
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 8),

              // Category badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: catColor.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: catColor.withValues(alpha: 0.18),
                    width: 1,
                  ),
                ),
                child: Text(
                  result.category,
                  style: TextStyle(
                    color: catColor,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                    fontFamily: 'Inter',
                  ),
                ),
              ),

              const SizedBox(width: 4),

              // Chevron
              Icon(
                Icons.chevron_right,
                size: 18,
                color: Colors.white.withValues(alpha: 0.15),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
