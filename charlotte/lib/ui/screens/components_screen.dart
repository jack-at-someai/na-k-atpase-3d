// Components Screen - M3-inspired Glassmorphic Component Library Showcase
//
// Interactive showcase for all Charlotte glass components organized by category.

import 'package:flutter/material.dart';

import '../../theme.dart';
import '../atoms/atoms.dart';
import '../molecules/molecules.dart';
import '../organisms/organisms.dart';
import 'temporal_spine_screen.dart';

// =============================================================================
// MAIN SCREEN
// =============================================================================

class ComponentsScreen extends StatefulWidget {
  const ComponentsScreen({super.key});

  @override
  State<ComponentsScreen> createState() => _ComponentsScreenState();
}

class _ComponentsScreenState extends State<ComponentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final _tabs = [
    const GlassTabItem(label: 'Actions', icon: Icons.touch_app_outlined),
    const GlassTabItem(label: 'Selection', icon: Icons.check_box_outlined),
    const GlassTabItem(label: 'Inputs', icon: Icons.edit_outlined),
    const GlassTabItem(label: 'Navigation', icon: Icons.navigation_outlined),
    const GlassTabItem(label: 'Feedback', icon: Icons.info_outline),
    const GlassTabItem(label: 'Layout', icon: Icons.view_module_outlined),
    const GlassTabItem(label: 'Graph', icon: Icons.account_tree_outlined),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CharlotteColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            _buildTabBar(),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: const [
                  _ActionsTab(),
                  _SelectionTab(),
                  _InputsTab(),
                  _NavigationTab(),
                  _FeedbackTab(),
                  _LayoutTab(),
                  _GraphTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Text(
            'CHARLOTTE',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: CharlotteColors.secondary.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              'M3 COMPONENTS',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: CharlotteColors.secondary,
                    letterSpacing: 1,
                  ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GlassTabs(
        tabs: _tabs,
        selectedIndex: _tabController.index,
        onChanged: (index) {
          _tabController.animateTo(index);
          setState(() {});
        },
        scrollable: true,
        alignment: GlassTabAlignment.start,
      ),
    );
  }
}

// =============================================================================
// ACTIONS TAB - Buttons & FABs
// =============================================================================

class _ActionsTab extends StatefulWidget {
  const _ActionsTab();

  @override
  State<_ActionsTab> createState() => _ActionsTabState();
}

class _ActionsTabState extends State<_ActionsTab> {
  GlassButtonSize _buttonSize = GlassButtonSize.medium;
  bool _isLoading = false;
  bool _isDisabled = false;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Controls
        _DemoSection(
          title: 'Button Controls',
          description: 'Adjust properties for all button demos',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text('Size: ', style: TextStyle(fontSize: 13)),
                  const SizedBox(width: 8),
                  ...GlassButtonSize.values.map((size) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(size.name),
                          selected: _buttonSize == size,
                          selectedColor: CharlotteColors.primary,
                          onSelected: (_) => setState(() => _buttonSize = size),
                        ),
                      )),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: GlassCheckboxTile(
                      value: _isLoading,
                      onChanged: (v) => setState(() => _isLoading = v ?? false),
                      label: 'Loading',
                      dense: true,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: GlassCheckboxTile(
                      value: _isDisabled,
                      onChanged: (v) => setState(() => _isDisabled = v ?? false),
                      label: 'Disabled',
                      dense: true,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Filled Button
        _DemoSection(
          title: 'GlassFilledButton',
          description: 'Primary action button with solid fill',
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              GlassFilledButton(
                label: 'Filled',
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
              GlassFilledButton(
                label: 'With Icon',
                leadingIcon: Icons.add,
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Outlined Button
        _DemoSection(
          title: 'GlassOutlinedButton',
          description: 'Secondary action with border',
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              GlassOutlinedButton(
                label: 'Outlined',
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
              GlassOutlinedButton(
                label: 'With Icon',
                leadingIcon: Icons.edit,
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Tonal Button
        _DemoSection(
          title: 'GlassTonalButton',
          description: 'Tinted secondary button',
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              GlassTonalButton(
                label: 'Tonal',
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
              GlassTonalButton(
                label: 'With Icon',
                leadingIcon: Icons.favorite,
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Elevated Button
        _DemoSection(
          title: 'GlassElevatedButton',
          description: 'Elevated button with shadow',
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              GlassElevatedButton(
                label: 'Elevated',
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
              GlassElevatedButton(
                label: 'With Icon',
                leadingIcon: Icons.cloud_upload,
                size: _buttonSize,
                isLoading: _isLoading,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Text Button
        _DemoSection(
          title: 'GlassTextButton',
          description: 'Minimal text-only button',
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              GlassTextButton(
                label: 'Text',
                size: _buttonSize,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
              GlassTextButton(
                label: 'With Icon',
                leadingIcon: Icons.open_in_new,
                size: _buttonSize,
                isDisabled: _isDisabled,
                onPressed: () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Icon Buttons
        _DemoSection(
          title: 'GlassIconButton',
          description: 'Compact icon-only buttons',
          child: Row(
            children: [
              GlassIconButton(
                icon: Icons.settings,
                onPressed: _isDisabled ? null : () {},
              ),
              const SizedBox(width: 12),
              GlassIconButton.filled(
                icon: Icons.add,
                onPressed: _isDisabled ? null : () {},
              ),
              const SizedBox(width: 12),
              GlassIconButton.outlined(
                icon: Icons.edit,
                onPressed: _isDisabled ? null : () {},
              ),
              const SizedBox(width: 12),
              GlassIconButton(
                icon: Icons.star,
                isSelected: true,
                onPressed: _isDisabled ? null : () {},
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // FABs
        _DemoSection(
          title: 'GlassFab & GlassExtendedFab',
          description: 'Floating action buttons',
          child: Row(
            children: [
              GlassFab.small(
                icon: Icons.add,
                onPressed: _isDisabled ? null : () {},
              ),
              const SizedBox(width: 16),
              GlassFab(
                icon: Icons.edit,
                onPressed: _isDisabled ? null : () {},
              ),
              const SizedBox(width: 16),
              GlassFab.large(
                icon: Icons.navigation,
                onPressed: _isDisabled ? null : () {},
              ),
              const SizedBox(width: 16),
              GlassExtendedFab(
                label: 'Create',
                icon: Icons.add,
                isLoading: _isLoading,
                onPressed: _isDisabled ? null : () {},
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// SELECTION TAB - Checkboxes, Radios, Switches, Sliders
// =============================================================================

class _SelectionTab extends StatefulWidget {
  const _SelectionTab();

  @override
  State<_SelectionTab> createState() => _SelectionTabState();
}

class _SelectionTabState extends State<_SelectionTab> {
  bool _checkboxValue = false;
  bool? _tristateValue = false;
  String _radioValue = 'option1';
  bool _switchValue = false;
  double _sliderValue = 0.5;
  int _segmentedValue = 0;
  final Set<int> _multiSegmented = {0};

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Checkbox
        _DemoSection(
          title: 'GlassCheckbox',
          description: 'Binary and tristate selection',
          child: Column(
            children: [
              Row(
                children: [
                  GlassCheckbox(
                    value: _checkboxValue,
                    onChanged: (v) => setState(() => _checkboxValue = v ?? false),
                  ),
                  const SizedBox(width: 24),
                  GlassCheckbox(
                    value: _tristateValue,
                    tristate: true,
                    onChanged: (v) => setState(() => _tristateValue = v),
                  ),
                  const SizedBox(width: 24),
                  const GlassCheckbox(value: true, isDisabled: true),
                ],
              ),
              const SizedBox(height: 16),
              GlassCheckboxTile(
                value: _checkboxValue,
                onChanged: (v) => setState(() => _checkboxValue = v ?? false),
                label: 'Checkbox with label',
                subtitle: 'Supporting text goes here',
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Radio
        _DemoSection(
          title: 'GlassRadio',
          description: 'Single selection from group',
          child: Column(
            children: [
              Row(
                children: [
                  GlassRadio<String>(
                    value: 'option1',
                    groupValue: _radioValue,
                    onChanged: (v) => setState(() => _radioValue = v!),
                  ),
                  const SizedBox(width: 24),
                  GlassRadio<String>(
                    value: 'option2',
                    groupValue: _radioValue,
                    onChanged: (v) => setState(() => _radioValue = v!),
                  ),
                  const SizedBox(width: 24),
                  const GlassRadio<String>(
                    value: 'disabled',
                    groupValue: 'disabled',
                    isDisabled: true,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              GlassRadioGroup<String>(
                values: const ['Option A', 'Option B', 'Option C'],
                groupValue: _radioValue == 'option1' ? 'Option A' : _radioValue,
                onChanged: (v) => setState(() => _radioValue = v!),
                labelBuilder: (v) => v,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Switch
        _DemoSection(
          title: 'GlassSwitch',
          description: 'Toggle on/off',
          child: Column(
            children: [
              Row(
                children: [
                  GlassSwitch(
                    value: _switchValue,
                    onChanged: (v) => setState(() => _switchValue = v),
                  ),
                  const SizedBox(width: 24),
                  GlassSwitch(
                    value: _switchValue,
                    onChanged: (v) => setState(() => _switchValue = v),
                    activeIcon: Icons.check,
                    inactiveIcon: Icons.close,
                  ),
                  const SizedBox(width: 24),
                  const GlassSwitch(value: true, isDisabled: true),
                ],
              ),
              const SizedBox(height: 16),
              GlassSwitchTile(
                value: _switchValue,
                onChanged: (v) => setState(() => _switchValue = v),
                label: 'Enable notifications',
                subtitle: 'Receive push notifications',
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Slider
        _DemoSection(
          title: 'GlassSlider',
          description: 'Range value selection',
          child: Column(
            children: [
              GlassSlider(
                value: _sliderValue,
                onChanged: (v) => setState(() => _sliderValue = v),
              ),
              const SizedBox(height: 24),
              GlassSlider(
                value: _sliderValue,
                onChanged: (v) => setState(() => _sliderValue = v),
                showLabel: true,
                labelBuilder: (v) => '${(v * 100).toInt()}%',
                divisions: 10,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Segmented
        _DemoSection(
          title: 'GlassSegmented',
          description: 'Segmented button group',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GlassSegmented<int>(
                segments: const [
                  GlassSegment(label: 'Day'),
                  GlassSegment(label: 'Week'),
                  GlassSegment(label: 'Month'),
                ],
                values: const [0, 1, 2],
                selected: _segmentedValue,
                onSelected: (v) => setState(() => _segmentedValue = v),
              ),
              const SizedBox(height: 16),
              GlassSegmented<int>.multi(
                segments: const [
                  GlassSegment(label: 'S', icon: Icons.text_fields),
                  GlassSegment(label: 'M', icon: Icons.format_bold),
                  GlassSegment(label: 'L', icon: Icons.format_italic),
                ],
                values: const [0, 1, 2],
                selected: _multiSegmented,
                onSelected: (v) => setState(() {
                  _multiSegmented.clear();
                  _multiSegmented.addAll(v);
                }),
                showSelectedIcon: true,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Badge
        _DemoSection(
          title: 'GlassBadge',
          description: 'Counter and notification indicators',
          child: Row(
            children: [
              const GlassBadge.dot(),
              const SizedBox(width: 24),
              const GlassBadge.count(value: 5),
              const SizedBox(width: 24),
              const GlassBadge.count(value: 99),
              const SizedBox(width: 24),
              const GlassBadge.count(value: 999),
              const SizedBox(width: 32),
              GlassBadgeWrapper(
                badge: const GlassBadge.dot(),
                child: GlassIconButton(
                  icon: Icons.notifications_outlined,
                  onPressed: () {},
                ),
              ),
              const SizedBox(width: 16),
              GlassBadgeWrapper(
                badge: const GlassBadge.count(value: 3),
                child: GlassIconButton(
                  icon: Icons.mail_outline,
                  onPressed: () {},
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// INPUTS TAB - Text Fields, Search
// =============================================================================

class _InputsTab extends StatefulWidget {
  const _InputsTab();

  @override
  State<_InputsTab> createState() => _InputsTabState();
}

class _InputsTabState extends State<_InputsTab> {
  final _textController = TextEditingController();
  final _searchController = TextEditingController();
  String? _errorText;

  @override
  void dispose() {
    _textController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Text Field
        _DemoSection(
          title: 'GlassTextField',
          description: 'Text input with various states',
          child: Column(
            children: [
              GlassTextField(
                labelText: 'Label',
                hintText: 'Enter text...',
                helperText: 'Helper text',
              ),
              const SizedBox(height: 16),
              GlassTextField(
                labelText: 'With Icons',
                hintText: 'Enter email...',
                prefixIconData: Icons.email_outlined,
                suffixIconData: Icons.clear,
                onSuffixTap: () {},
              ),
              const SizedBox(height: 16),
              GlassTextField(
                controller: _textController,
                labelText: 'With Error',
                hintText: 'Enter text...',
                errorText: _errorText,
                onChanged: (v) {
                  setState(() {
                    _errorText = v.length < 3 ? 'Minimum 3 characters' : null;
                  });
                },
              ),
              const SizedBox(height: 16),
              const GlassTextField(
                labelText: 'Disabled',
                hintText: 'Cannot edit...',
                enabled: false,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Text Area
        _DemoSection(
          title: 'GlassTextArea',
          description: 'Multiline text input',
          child: const GlassTextArea(
            labelText: 'Description',
            hintText: 'Enter a longer description...',
            minLines: 3,
            maxLines: 6,
          ),
        ),
        const SizedBox(height: 24),

        // Search Field
        _DemoSection(
          title: 'GlassSearchField',
          description: 'Search input with clear button',
          child: GlassSearchField(
            controller: _searchController,
            hintText: 'Search components...',
            onChanged: (v) {},
          ),
        ),
        const SizedBox(height: 24),

        // Expandable Search Bar
        _DemoSection(
          title: 'GlassSearchBar',
          description: 'Expandable search (tap to expand)',
          child: Row(
            children: [
              GlassSearchBar(
                hintText: 'Search...',
                onChanged: (v) {},
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// NAVIGATION TAB - AppBar, NavBar, NavRail, Tabs, Drawer, Menu
// =============================================================================

class _NavigationTab extends StatefulWidget {
  const _NavigationTab();

  @override
  State<_NavigationTab> createState() => _NavigationTabState();
}

class _NavigationTabState extends State<_NavigationTab> {
  int _navBarIndex = 0;
  int _navRailIndex = 0;
  int _tabIndex = 0;
  bool _railExtended = false;

  final _navItems = const [
    GlassNavItem(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Home'),
    GlassNavItem(icon: Icons.search_outlined, activeIcon: Icons.search, label: 'Search'),
    GlassNavItem(icon: Icons.add_circle_outline, activeIcon: Icons.add_circle, label: 'Create'),
    GlassNavItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Tabs
        _DemoSection(
          title: 'GlassTabs',
          description: 'Tab bar navigation',
          child: Column(
            children: [
              GlassTabs(
                tabs: const [
                  GlassTabItem(label: 'All'),
                  GlassTabItem(label: 'Recent'),
                  GlassTabItem(label: 'Favorites', icon: Icons.star),
                ],
                selectedIndex: _tabIndex,
                onChanged: (i) => setState(() => _tabIndex = i),
              ),
              const SizedBox(height: 16),
              GlassUnderlineTabs(
                tabs: const [
                  GlassTabItem(label: 'Overview'),
                  GlassTabItem(label: 'Details'),
                  GlassTabItem(label: 'History'),
                ],
                selectedIndex: _tabIndex,
                onChanged: (i) => setState(() => _tabIndex = i),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Bottom Navigation
        _DemoSection(
          title: 'GlassNavBar',
          description: 'Bottom navigation bar',
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: SizedBox(
              height: 100,
              child: Stack(
                children: [
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: GlassNavBar(
                      items: _navItems,
                      selectedIndex: _navBarIndex,
                      onDestinationSelected: (i) => setState(() => _navBarIndex = i),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Navigation Rail
        _DemoSection(
          title: 'GlassNavRail',
          description: 'Side navigation rail',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GlassSwitchTile(
                value: _railExtended,
                onChanged: (v) => setState(() => _railExtended = v),
                label: 'Extended',
                dense: true,
              ),
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: SizedBox(
                  height: 300,
                  child: Row(
                    children: [
                      GlassNavRail(
                        destinations: _navItems,
                        selectedIndex: _navRailIndex,
                        onDestinationSelected: (i) => setState(() => _navRailIndex = i),
                        extended: _railExtended,
                        minExtendedWidth: 180,
                      ),
                      Expanded(
                        child: Container(
                          color: CharlotteColors.surface.withValues(alpha: 0.3),
                          child: Center(
                            child: Text(
                              'Content Area',
                              style: TextStyle(color: CharlotteColors.textTertiary),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Menu
        _DemoSection(
          title: 'GlassMenu',
          description: 'Dropdown menu',
          child: GlassMenuButton(
            items: [
              GlassMenuItem(
                label: 'Edit',
                icon: Icons.edit_outlined,
                onTap: () {},
              ),
              GlassMenuItem(
                label: 'Duplicate',
                icon: Icons.copy_outlined,
                onTap: () {},
              ),
              GlassMenuItem.divider,
              GlassMenuItem(
                label: 'Delete',
                icon: Icons.delete_outlined,
                isDestructive: true,
                onTap: () {},
              ),
            ],
            child: GlassOutlinedButton(
              label: 'Show Menu',
              trailingIcon: Icons.arrow_drop_down,
              onPressed: () {},
            ),
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// FEEDBACK TAB - Progress, Snackbar, Dialog
// =============================================================================

class _FeedbackTab extends StatefulWidget {
  const _FeedbackTab();

  @override
  State<_FeedbackTab> createState() => _FeedbackTabState();
}

class _FeedbackTabState extends State<_FeedbackTab> {
  double _progressValue = 0.65;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Progress Indicators
        _DemoSection(
          title: 'GlassProgress',
          description: 'Loading indicators',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const GlassProgress.circular(),
                  const SizedBox(width: 24),
                  GlassProgress.circular(value: _progressValue),
                  const SizedBox(width: 24),
                  GlassProgress.circular(
                    value: _progressValue,
                    showLabel: true,
                    size: 56,
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const GlassProgress.linear(),
              const SizedBox(height: 16),
              GlassProgress.linear(
                value: _progressValue,
                showLabel: true,
              ),
              const SizedBox(height: 16),
              GlassSlider(
                value: _progressValue,
                onChanged: (v) => setState(() => _progressValue = v),
                showLabel: true,
                labelBuilder: (v) => 'Progress: ${(v * 100).toInt()}%',
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Divider
        _DemoSection(
          title: 'GlassDivider',
          description: 'Visual separators',
          child: Column(
            children: [
              const GlassDivider.horizontal(),
              const SizedBox(height: 16),
              SizedBox(
                height: 60,
                child: Row(
                  children: [
                    const Expanded(child: Center(child: Text('Left'))),
                    const GlassDivider.vertical(),
                    const Expanded(child: Center(child: Text('Right'))),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Snackbar
        _DemoSection(
          title: 'GlassSnackbar',
          description: 'Toast notifications (tap to show)',
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              GlassOutlinedButton(
                label: 'Info',
                onPressed: () {
                  GlassSnackbar.show(
                    context,
                    message: 'This is an info message',
                    leadingIcon: Icons.info_outline,
                  );
                },
              ),
              GlassOutlinedButton(
                label: 'Success',
                onPressed: () {
                  GlassSnackbar.showSuccess(context, 'Operation completed!');
                },
              ),
              GlassOutlinedButton(
                label: 'Error',
                onPressed: () {
                  GlassSnackbar.showError(context, 'Something went wrong');
                },
              ),
              GlassOutlinedButton(
                label: 'With Action',
                onPressed: () {
                  GlassSnackbar.show(
                    context,
                    message: 'Item deleted',
                    actionLabel: 'Undo',
                    onAction: () {},
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Dialog
        _DemoSection(
          title: 'GlassDialog',
          description: 'Modal dialogs (tap to show)',
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              GlassOutlinedButton(
                label: 'Alert',
                onPressed: () {
                  GlassDialog.showAlert(
                    context,
                    title: 'Alert',
                    message: 'This is an alert dialog with a message.',
                    icon: Icons.info_outline,
                  );
                },
              ),
              GlassOutlinedButton(
                label: 'Confirm',
                onPressed: () async {
                  final result = await GlassDialog.showConfirm(
                    context,
                    title: 'Confirm Action',
                    message: 'Are you sure you want to proceed?',
                    icon: Icons.help_outline,
                  );
                  if (result == true && context.mounted) {
                    GlassSnackbar.showSuccess(context, 'Confirmed!');
                  }
                },
              ),
              GlassOutlinedButton(
                label: 'Destructive',
                onPressed: () async {
                  final result = await GlassDialog.showConfirm(
                    context,
                    title: 'Delete Item?',
                    message: 'This action cannot be undone.',
                    confirmLabel: 'Delete',
                    destructive: true,
                    icon: Icons.delete_outline,
                  );
                  if (result == true && context.mounted) {
                    GlassSnackbar.show(context, message: 'Deleted');
                  }
                },
              ),
              GlassOutlinedButton(
                label: 'Bottom Sheet',
                onPressed: () {
                  GlassBottomSheet.show(
                    context,
                    title: 'Options',
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          ListTile(
                            leading: const Icon(Icons.share),
                            title: const Text('Share'),
                            onTap: () => Navigator.pop(context),
                          ),
                          ListTile(
                            leading: const Icon(Icons.edit),
                            title: const Text('Edit'),
                            onTap: () => Navigator.pop(context),
                          ),
                          ListTile(
                            leading: Icon(Icons.delete, color: CharlotteColors.error),
                            title: Text('Delete', style: TextStyle(color: CharlotteColors.error)),
                            onTap: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// LAYOUT TAB - App Bar, Bottom Bar, Drawer
// =============================================================================

class _LayoutTab extends StatelessWidget {
  const _LayoutTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // App Bar
        _DemoSection(
          title: 'GlassAppBar',
          description: 'Top app bar',
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: SizedBox(
              height: 60,
              child: GlassAppBar(
                title: 'App Title',
                showBackButton: true,
                onBack: () {},
                actions: [
                  GlassIconButton(
                    icon: Icons.search,
                    onPressed: () {},
                  ),
                  GlassIconButton(
                    icon: Icons.more_vert,
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Bottom Bar with FAB
        _DemoSection(
          title: 'GlassBottomBar',
          description: 'Bottom bar with center FAB',
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: SizedBox(
              height: 100,
              child: Stack(
                children: [
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: GlassBottomNavigationBar(
                      items: const [
                        GlassBottomBarItem(
                          icon: Icons.home_outlined,
                          activeIcon: Icons.home,
                          label: 'Home',
                          isSelected: true,
                        ),
                        GlassBottomBarItem(
                          icon: Icons.search_outlined,
                          label: 'Search',
                        ),
                        GlassBottomBarItem(
                          icon: Icons.person_outline,
                          label: 'Profile',
                        ),
                        GlassBottomBarItem(
                          icon: Icons.settings_outlined,
                          label: 'Settings',
                        ),
                      ],
                      selectedIndex: 0,
                      centerFab: GlassFab(
                        icon: Icons.add,
                        onPressed: () {},
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Drawer Preview
        _DemoSection(
          title: 'GlassDrawer',
          description: 'Navigation drawer (tap to show)',
          child: GlassOutlinedButton(
            label: 'Show Drawer',
            leadingIcon: Icons.menu,
            onPressed: () {
              Scaffold.of(context).openDrawer();
            },
          ),
        ),
        const SizedBox(height: 24),

        // Glass Primitives
        _DemoSection(
          title: 'Glass Primitives',
          description: 'Base glass components from theme.dart',
          child: Column(
            children: [
              GlassContainer(
                intensity: GlassIntensity.subtle,
                padding: const EdgeInsets.all(16),
                child: const Text('GlassContainer (subtle)'),
              ),
              const SizedBox(height: 12),
              GlassContainer(
                intensity: GlassIntensity.standard,
                showGlow: true,
                padding: const EdgeInsets.all(16),
                child: const Text('GlassContainer (standard + glow)'),
              ),
              const SizedBox(height: 12),
              GlassCard(
                isHighlighted: true,
                padding: const EdgeInsets.all(16),
                child: const Text('GlassCard (highlighted)'),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  GlassChip(
                    child: const Text('Chip'),
                  ),
                  const SizedBox(width: 8),
                  GlassChip(
                    isSelected: true,
                    child: const Text('Selected'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// GRAPH TAB - Graph Traversal Demo
// =============================================================================

class _GraphTab extends StatefulWidget {
  const _GraphTab();

  @override
  State<_GraphTab> createState() => _GraphTabState();
}

class _GraphTabState extends State<_GraphTab> {
  late GraphDirector _director;
  ContextData? _contextData;

  // Mock node positions for demo
  final Map<String, Offset> _nodePositions = {
    'animal_1': const Offset(100, 100),
    'animal_2': const Offset(250, 80),
    'animal_3': const Offset(180, 200),
    'location_1': const Offset(350, 150),
    'event_1': const Offset(280, 280),
  };

  // Mock node data
  final Map<String, _MockNode> _nodes = {
    'animal_1': _MockNode('Bella', 'ANIMAL', 0.85),
    'animal_2': _MockNode('Duke', 'ANIMAL', 0.72),
    'animal_3': _MockNode('Luna', 'ANIMAL', 0.91),
    'location_1': _MockNode('Barn A', 'LOCATION', null),
    'event_1': _MockNode('Feeding', 'EVENT', null),
  };

  @override
  void initState() {
    super.initState();
    _director = GraphDirector(
      scenes: [
        GraphScene.overview(label: 'Overview'),
        GraphScene.focusNode(nodeId: 'animal_1', label: 'Bella'),
        GraphScene.focusNode(nodeId: 'animal_2', label: 'Duke'),
        GraphScene.focusNode(nodeId: 'animal_3', label: 'Luna'),
        GraphScene.focusNode(nodeId: 'location_1', label: 'Barn A'),
        GraphScene.focusNode(nodeId: 'event_1', label: 'Feeding'),
      ],
    );
    _director.addListener(_onDirectorChange);
  }

  @override
  void dispose() {
    _director.removeListener(_onDirectorChange);
    _director.dispose();
    super.dispose();
  }

  void _onDirectorChange() {
    setState(() {
      // Update context when scene changes
      final focusId = _director.currentScene.focusNodeId;
      if (focusId != null && _nodes.containsKey(focusId)) {
        _contextData = _buildContextData(focusId);
      } else {
        _contextData = null;
      }
    });
  }

  ContextData _buildContextData(String nodeId) {
    final node = _nodes[nodeId]!;
    return ContextData(
      id: nodeId,
      type: node.type,
      label: node.label,
      category: node.type,
      score: node.score,
      attributes: {
        'ID': nodeId,
        'Status': 'Active',
        'Last Updated': '2 hours ago',
      },
      metrics: node.score != null
          ? [
              ContextMetric(
                label: 'Health Score',
                value: node.score!,
                history: [0.7, 0.75, 0.8, 0.78, 0.82, 0.85, node.score!],
              ),
            ]
          : [],
      relations: _getRelationsFor(nodeId),
      actions: [
        DrawerAction(
          label: 'View',
          icon: Icons.visibility,
          onTap: () {},
          isPrimary: true,
        ),
        DrawerAction(
          label: 'Edit',
          icon: Icons.edit,
          onTap: () {},
        ),
      ],
    );
  }

  List<ContextRelation> _getRelationsFor(String nodeId) {
    // Simple mock relations
    if (nodeId.startsWith('animal')) {
      return [
        const ContextRelation(
          id: 'rel_1',
          type: 'Located At',
          targetLabel: 'Barn A',
          targetCategory: 'LOCATION',
        ),
        const ContextRelation(
          id: 'rel_2',
          type: 'Participated In',
          targetLabel: 'Feeding',
          targetCategory: 'EVENT',
        ),
      ];
    }
    return [];
  }

  void _onNodeTap(String nodeId) {
    // Find scene for this node and navigate to it
    final sceneIndex = _director.scenes.indexWhere(
      (s) => s.focusNodeId == nodeId,
    );
    if (sceneIndex >= 0) {
      _director.goToScene(sceneIndex);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Main graph stage
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'GraphStage',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  color: CharlotteColors.secondary,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Film-style scene navigation with indexed keyframes.',
                            style: TextStyle(
                              color: CharlotteColors.textTertiary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    GlassFilledButton(
                      label: 'Temporal Spine',
                      leadingIcon: Icons.timeline,
                      size: GlassButtonSize.small,
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => const TemporalSpineScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Graph Stage
                Expanded(
                  child: GlassContainer(
                    intensity: GlassIntensity.subtle,
                    child: GraphStage(
                      director: _director,
                      showControls: true,
                      showBreadcrumbs: true,
                      builder: (context, scene) {
                        return Stack(
                          children: [
                            // Render nodes
                            ..._nodePositions.entries.map((entry) {
                              final nodeId = entry.key;
                              final position = entry.value;
                              final node = _nodes[nodeId]!;
                              final isHighlighted =
                                  scene.highlightedNodes.contains(nodeId);
                              final isVisible = scene.visibleNodes == null ||
                                  scene.visibleNodes!.contains(nodeId);

                              if (!isVisible) return const SizedBox.shrink();

                              return Positioned(
                                left: position.dx - 20,
                                top: position.dy - 20,
                                child: GestureDetector(
                                  onTap: () => _onNodeTap(nodeId),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Stack(
                                        alignment: Alignment.center,
                                        children: [
                                          if (isHighlighted)
                                            FocusRing(
                                              size: 50,
                                              color: CharlotteCategoryColors
                                                  .forCategory(node.type),
                                            ),
                                          NodeAtom(
                                            category: node.type,
                                            size: 40,
                                            depth: isHighlighted ? 0 : 1,
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        node.label,
                                        style: TextStyle(
                                          color: isHighlighted
                                              ? CharlotteColors.textPrimary
                                              : CharlotteColors.textTertiary,
                                          fontSize: 10,
                                          fontWeight: isHighlighted
                                              ? FontWeight.bold
                                              : FontWeight.normal,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            }),

                            // Traversal path
                            if (_director.history.isNotEmpty)
                              TraversalPath(
                                nodeIds: [
                                  ..._director.history
                                      .map((i) => _director.scenes[i].focusNodeId)
                                      .whereType<String>(),
                                  if (_director.currentScene.focusNodeId != null)
                                    _director.currentScene.focusNodeId!,
                                ],
                                nodePositions: _nodePositions,
                              ),
                          ],
                        );
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Scene info
                GlassContainer(
                  intensity: GlassIntensity.subtle,
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Director State',
                        style: TextStyle(
                          color: CharlotteColors.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: _InfoRow('Scene', '${_director.currentIndex + 1}/${_director.sceneCount}')),
                          Expanded(child: _InfoRow('Focus', _director.currentScene.focusNodeId ?? 'None')),
                          Expanded(child: _InfoRow('History', '${_director.history.length}')),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Context drawer (only show when there's data)
          if (_contextData != null) ...[
            const SizedBox(width: 16),
            ContextDrawer(
              data: _contextData,
              width: 280,
              onRelationTap: (relation) {
                // Navigate to related node
                final targetId = relation.targetLabel == 'Barn A'
                    ? 'location_1'
                    : 'event_1';
                _onNodeTap(targetId);
              },
              onDismiss: () {
                // Go back to overview
                _director.goToScene(0);
              },
            ),
          ],
        ],
      ),
    );
  }
}

class _MockNode {
  final String label;
  final String type;
  final double? score;

  const _MockNode(this.label, this.type, this.score);
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                color: CharlotteColors.textTertiary,
                fontSize: 12,
              ),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: CharlotteColors.textPrimary,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// SHARED WIDGETS
// =============================================================================

class _DemoSection extends StatelessWidget {
  final String title;
  final String description;
  final Widget child;

  const _DemoSection({
    required this.title,
    required this.description,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      intensity: GlassIntensity.subtle,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: CharlotteColors.secondary,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: TextStyle(
              color: CharlotteColors.textTertiary,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }
}
