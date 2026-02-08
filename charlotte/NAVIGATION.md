# Charlotte Navigation System

## Overview

Charlotte uses a **radial coordinate navigation system** inspired by the metaphor of "picking a lock" - each node ID maps to a unique position in 4-dimensional radial space. This enables:

1. **Consistent animated transitions** - Distance between coordinates determines animation timing
2. **Breadcrumb path tracking** - Full navigation history as app state
3. **Backtrackable animations** - Reverse animations match forward navigation
4. **Visual debugging** - Radar-style coordinate visualization

---

## Architecture

### Core Components

```
lib/services/
├── navigation_service.dart    # RadialCoordinate, NavigationService, RouteObserver
├── navigation_router.dart     # CharlotteRouter with typed route methods
```

```
lib/navigation.dart            # Barrel export for all navigation components
```

### RadialCoordinate System

Each node ID hashes into 4 dimensions:

| Dimension | Range | Purpose |
|-----------|-------|---------|
| **θ (theta)** | 0 → 2π | Primary angle - main direction |
| **φ (phi)** | 0 → π | Secondary angle - elevation/depth |
| **r (radius)** | 0.3 → 1.0 | Distance from origin |
| **ψ (psi)** | 0 → 2π | Category grouping dimension |

```dart
factory RadialCoordinate.fromNodeId(String nodeId) {
  final hash = nodeId.hashCode;
  final bytes = [
    (hash >> 24) & 0xFF,
    (hash >> 16) & 0xFF,
    (hash >> 8) & 0xFF,
    hash & 0xFF,
  ];
  return RadialCoordinate(
    theta: (bytes[0] / 255.0) * 2 * pi,
    phi: (bytes[1] / 255.0) * pi,
    radius: 0.3 + (bytes[2] / 255.0) * 0.7,
    psi: (bytes[3] / 255.0) * 2 * pi,
  );
}
```

### Distance-Based Animation Timing

```dart
double distanceTo(RadialCoordinate other) {
  final dTheta = _angularDiff(theta, other.theta);
  final dPhi = _angularDiff(phi, other.phi);
  final dPsi = _angularDiff(psi, other.psi);
  final dRadius = (radius - other.radius).abs();

  return sqrt(
    dTheta² * 0.4 +  // Primary weight
    dPhi² * 0.3 +    // Secondary weight
    dPsi² * 0.2 +    // Category weight
    dRadius² * 0.1   // Distance weight
  );
}
```

**Result:** Nearby nodes (same category, similar IDs) animate faster. Distant nodes animate slower.

---

## CharlotteRouter

Centralized routing with typed methods and consistent animations.

### Route Methods

```dart
// Node navigation
context.toNode(nodeId: 'xxx', userId: 'yyy');
context.toNodeFromWidget(nodeId: 'xxx', userId: 'yyy', originKey: key);

// Chat navigation
context.toChat(chatId: 'xxx', ownerId: 'yyy');
context.toDirectChat(userId: 'xxx', friendId: 'yyy', friendName: 'Name');

// Social
context.toFriends(userId: 'xxx');

// Media
context.toImageViewer(imageUrl: 'https://...', caption: 'Optional');

// Utility
context.pop();
context.popToRoot();
context.confirm(title: 'Delete?', isDestructive: true);
```

### Animation Types

| Route Type | Animation | Duration |
|------------|-----------|----------|
| Node detail | Container transform / Fade through | 250-450ms (distance-based) |
| Direct chat | Shared axis horizontal | 300ms |
| Friends | Shared axis scaled | 300ms |
| Image viewer | Fade | 250ms |
| Chat | Fade through | 300ms |

---

## Breadcrumb Stack Manager (TODO)

### Concept

The navigation path should be **first-class app state** that:

1. Persists the complete route stack with coordinates
2. Enables exact reverse animations on back navigation
3. Supports "jump to" any point in history
4. Syncs with deep links and notification navigation

### Proposed Structure

```dart
class NavigationBreadcrumb {
  final String routeName;
  final RadialCoordinate coordinate;
  final Map<String, dynamic> arguments;
  final DateTime timestamp;
  final Duration forwardAnimationDuration;

  // For reverse animation
  RadialCoordinate? previousCoordinate;
}

class BreadcrumbStack extends ChangeNotifier {
  final List<NavigationBreadcrumb> _stack = [];

  // Current position in stack (for forward/back without pop)
  int _currentIndex = 0;

  // Push new breadcrumb
  void push(NavigationBreadcrumb crumb);

  // Pop and animate back
  NavigationBreadcrumb? pop();

  // Jump to specific index (for history navigation)
  void jumpTo(int index);

  // Get reverse animation context
  ReverseAnimationContext getBackContext();
}

class ReverseAnimationContext {
  final RadialCoordinate from;
  final RadialCoordinate to;
  final Duration duration;
  final SharedAxisTransitionType transitionType;
}
```

### Integration Points

1. **Route Observer** - Automatically captures breadcrumbs on navigation
2. **Back Gesture** - Uses breadcrumb stack for iOS swipe-back
3. **Deep Links** - Reconstructs stack from URL path segments
4. **Notifications** - Pushes to stack when navigating from notification tap

### State Persistence

```dart
// Serialize for state restoration
Map<String, dynamic> toJson() => {
  'stack': _stack.map((b) => b.toJson()).toList(),
  'currentIndex': _currentIndex,
};

// Restore on app resume
factory BreadcrumbStack.fromJson(Map<String, dynamic> json);
```

---

## Debug Widgets

### NavigationCoordinateDebug

Shows current coordinate in compact format:

```
[●] θ45° φ90° r75 d3
     │              └── Stack depth
     └── Coordinate color indicator
```

### RadialCoordinateVisualizer

Radar-style display showing:
- Concentric rings (radius levels)
- Current position as glowing dot
- History trail connecting previous positions
- Color matches coordinate's derived color

---

## Current Status

### Completed

- [x] RadialCoordinate system with 4D hashing
- [x] CharlotteRouter with all route methods
- [x] Context extensions for ergonomic navigation
- [x] Migrated all screens to use router
- [x] Debug visualization widgets
- [x] Distance-based animation timing

### In Progress

- [ ] **Stack overflow bug** - Route observer interfering with PageView
  - Temporarily disabled in `main.dart`
  - Need to filter PageView transitions from route tracking

### TODO

- [ ] BreadcrumbStack manager implementation
- [ ] Reverse animation context
- [ ] Deep link integration
- [ ] State persistence/restoration
- [ ] iOS swipe-back gesture integration
- [ ] Stream subscription cleanup in mode screens

---

## Files Reference

| File | Purpose |
|------|---------|
| `lib/services/navigation_service.dart` | Core: RadialCoordinate, NavigationService, RouteObserver, TransitionController, Debug widgets |
| `lib/services/navigation_router.dart` | CharlotteRouter, Routes constants, Context extensions |
| `lib/navigation.dart` | Barrel export |
| `lib/widgets/core/animated_node_avatar.dart` | AnimatedNodeAvatar, AnimatedNodeTile, AnimatedNodeCard |
| `lib/main.dart` | App integration (route observer currently disabled) |

---

## Bug Notes

### Stack Overflow on PageView Scroll

**Symptom:** Red screen stack overflow when swiping between modes (Upcoming → Node → Calendar)

**Likely Cause:** `CharlotteRouteObserver` is receiving events from PageView page changes, not just Navigator route changes. This creates a feedback loop:

1. User swipes PageView
2. `onPageChanged` fires → `ModeController.setModeByIndex()`
3. Route observer's `didPush`/`didPop` fires (incorrectly?)
4. Observer updates coordinate → triggers something
5. Loop

**Fix Approach:**
- Filter route observer to only track actual Navigator routes, not PageView
- Or: Don't use global route observer, track manually in CharlotteRouter methods

**Temporary Workaround:** Route observer disabled in `main.dart`:
```dart
// navigatorKey: nav.navigatorKey,
// navigatorObservers: [nav.routeObserver],
```

---

## Usage Examples

### Navigate to Node

```dart
// From any widget
CharlotteRouter.instance.toNode(
  context,
  nodeId: node.id,
  userId: currentUserId,
);

// Or using context extension
context.toNode(nodeId: node.id, userId: currentUserId);
```

### Animated Node Avatar (Container Transform)

```dart
AnimatedNodeAvatar(
  node: node,
  userId: userId,
  size: 48,
  showLabel: true,
  showGlow: true,
  onLongPress: () => _showNodeActions(node),
)
```

### Show Confirmation Dialog

```dart
final confirmed = await context.confirm(
  title: 'Delete Node',
  message: 'This cannot be undone.',
  isDestructive: true,
);
if (confirmed) {
  await deleteNode();
}
```

---

*Last updated: January 2026*
