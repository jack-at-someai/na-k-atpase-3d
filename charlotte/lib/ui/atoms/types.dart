/// Shared types and enums for the Charlotte atomic design system.
library;

/// State for SignalAtom visual display
enum SignalState { normal, highlighted, dimmed }

/// State for ProtocolAtom visual display
enum ProtocolState { pending, completed, missed }

/// Label position for NodeWithLabel molecule
enum LabelPosition { below, right, inside }

/// Cluster layout for NodeCluster molecule
enum ClusterLayout { stack, grid, radial }

// =============================================================================
// M3 COMPONENT LIBRARY TYPES
// =============================================================================

/// Button variant styles for glass buttons
enum GlassButtonVariant { filled, outlined, elevated, tonal, text }

/// Button size presets
enum GlassButtonSize { small, medium, large }

/// Progress indicator type
enum GlassProgressType { circular, linear }

/// Navigation item state
enum GlassNavState { normal, selected, disabled }

/// Tab alignment options
enum GlassTabAlignment { start, center, fill }

/// Text field state
enum GlassTextFieldState { normal, focused, error, disabled }

/// Snackbar position
enum GlassSnackbarPosition { bottom, top }

/// Dialog size presets
enum GlassDialogSize { small, medium, large, fullscreen }

/// FAB size presets
enum GlassFabSize { small, regular, large }

/// Checkbox state (supports tristate)
enum GlassCheckboxState { unchecked, checked, indeterminate }
