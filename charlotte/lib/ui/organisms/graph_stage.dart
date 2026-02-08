// GraphStage - The viewport/camera for graph traversal
//
// Like a film stage where scenes are composed and shot. Handles:
// - Viewport transforms (pan, zoom, rotation)
// - Scene transitions with indexed keyframes
// - Focus management and breadcrumb history

import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme.dart';

// =============================================================================
// GRAPH SCENE - A keyframed state of the graph view
// =============================================================================

/// A scene represents a specific "shot" of the graph - which nodes are visible,
/// where the camera is focused, what's highlighted, etc.
///
/// Like a Lottie keyframe, scenes can be indexed and interpolated between.
class GraphScene {
  /// Unique identifier for this scene
  final String id;

  /// Human-readable label for scene navigation
  final String? label;

  /// The node ID that is the focal point of this scene (camera centers here)
  final String? focusNodeId;

  /// Node IDs visible in this scene (null = show all)
  final Set<String>? visibleNodes;

  /// Edge IDs visible in this scene (null = show all)
  final Set<String>? visibleEdges;

  /// Viewport center in graph coordinates
  final Offset center;

  /// Zoom scale (1.0 = 100%)
  final double scale;

  /// Viewport rotation in radians
  final double rotation;

  /// Nodes with highlight state in this scene
  final Set<String> highlightedNodes;

  /// Edges with highlight state in this scene
  final Set<String> highlightedEdges;

  /// Custom metadata for this scene
  final Map<String, dynamic> metadata;

  /// Transition duration when animating TO this scene
  final Duration transitionDuration;

  /// Transition curve
  final Curve transitionCurve;

  const GraphScene({
    required this.id,
    this.label,
    this.focusNodeId,
    this.visibleNodes,
    this.visibleEdges,
    this.center = Offset.zero,
    this.scale = 1.0,
    this.rotation = 0.0,
    this.highlightedNodes = const {},
    this.highlightedEdges = const {},
    this.metadata = const {},
    this.transitionDuration = const Duration(milliseconds: 400),
    this.transitionCurve = Curves.easeInOutCubic,
  });

  /// Create a scene focused on a specific node
  factory GraphScene.focusNode({
    required String nodeId,
    String? label,
    double scale = 1.5,
    Set<String>? alsoShow,
    Duration? duration,
  }) {
    return GraphScene(
      id: 'focus_$nodeId',
      label: label,
      focusNodeId: nodeId,
      scale: scale,
      highlightedNodes: {nodeId},
      visibleNodes: alsoShow,
      transitionDuration: duration ?? const Duration(milliseconds: 400),
    );
  }

  /// Create an overview scene showing the full graph
  factory GraphScene.overview({
    String? label,
    double scale = 0.5,
  }) {
    return GraphScene(
      id: 'overview',
      label: label ?? 'Overview',
      scale: scale,
      center: Offset.zero,
    );
  }

  /// Interpolate between two scenes
  static GraphScene lerp(GraphScene a, GraphScene b, double t) {
    return GraphScene(
      id: t < 0.5 ? a.id : b.id,
      label: t < 0.5 ? a.label : b.label,
      focusNodeId: t < 0.5 ? a.focusNodeId : b.focusNodeId,
      center: Offset.lerp(a.center, b.center, t)!,
      scale: lerpDouble(a.scale, b.scale, t)!,
      rotation: lerpDouble(a.rotation, b.rotation, t)!,
      highlightedNodes: t < 0.5 ? a.highlightedNodes : b.highlightedNodes,
      highlightedEdges: t < 0.5 ? a.highlightedEdges : b.highlightedEdges,
      visibleNodes: t < 0.5 ? a.visibleNodes : b.visibleNodes,
      visibleEdges: t < 0.5 ? a.visibleEdges : b.visibleEdges,
    );
  }

  GraphScene copyWith({
    String? id,
    String? label,
    String? focusNodeId,
    Set<String>? visibleNodes,
    Set<String>? visibleEdges,
    Offset? center,
    double? scale,
    double? rotation,
    Set<String>? highlightedNodes,
    Set<String>? highlightedEdges,
    Map<String, dynamic>? metadata,
    Duration? transitionDuration,
    Curve? transitionCurve,
  }) {
    return GraphScene(
      id: id ?? this.id,
      label: label ?? this.label,
      focusNodeId: focusNodeId ?? this.focusNodeId,
      visibleNodes: visibleNodes ?? this.visibleNodes,
      visibleEdges: visibleEdges ?? this.visibleEdges,
      center: center ?? this.center,
      scale: scale ?? this.scale,
      rotation: rotation ?? this.rotation,
      highlightedNodes: highlightedNodes ?? this.highlightedNodes,
      highlightedEdges: highlightedEdges ?? this.highlightedEdges,
      metadata: metadata ?? this.metadata,
      transitionDuration: transitionDuration ?? this.transitionDuration,
      transitionCurve: transitionCurve ?? this.transitionCurve,
    );
  }
}

// =============================================================================
// GRAPH DIRECTOR - Orchestrates scene transitions
// =============================================================================

/// The director controls scene sequencing, like a film director calling shots.
///
/// Supports:
/// - Indexed scene navigation (jump to scene N)
/// - Playback controls (play, pause, scrub)
/// - History/breadcrumb management
/// - Custom choreography
class GraphDirector extends ChangeNotifier {
  /// All available scenes (the storyboard)
  final List<GraphScene> _scenes;

  /// Current scene index
  int _currentIndex = 0;

  /// Animation controller for transitions
  AnimationController? _animationController;

  /// Previous scene for interpolation
  GraphScene? _previousScene;

  /// Traversal history (breadcrumb trail)
  final List<int> _history = [];

  /// Whether auto-play is active
  bool _isPlaying = false;

  /// Playback speed multiplier
  double _playbackSpeed = 1.0;

  GraphDirector({
    required List<GraphScene> scenes,
    int initialIndex = 0,
  }) : _scenes = List.unmodifiable(scenes) {
    _currentIndex = initialIndex.clamp(0, scenes.length - 1);
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  List<GraphScene> get scenes => _scenes;
  int get currentIndex => _currentIndex;
  int get sceneCount => _scenes.length;
  GraphScene get currentScene => _scenes[_currentIndex];
  GraphScene? get previousScene => _previousScene;
  List<int> get history => List.unmodifiable(_history);
  bool get isPlaying => _isPlaying;
  double get playbackSpeed => _playbackSpeed;
  bool get canGoBack => _history.isNotEmpty;
  bool get canGoNext => _currentIndex < _scenes.length - 1;
  bool get canGoPrevious => _currentIndex > 0;

  /// Animation progress (0.0 - 1.0) for current transition
  double get transitionProgress {
    return _animationController?.value ?? 1.0;
  }

  /// Current interpolated scene state
  GraphScene get interpolatedScene {
    if (_previousScene == null || transitionProgress >= 1.0) {
      return currentScene;
    }
    return GraphScene.lerp(_previousScene!, currentScene, transitionProgress);
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /// Jump to a specific scene by index
  void goToScene(int index, {bool addToHistory = true}) {
    if (index < 0 || index >= _scenes.length) return;
    if (index == _currentIndex) return;

    if (addToHistory) {
      _history.add(_currentIndex);
    }

    _previousScene = currentScene;
    _currentIndex = index;
    _startTransition();
    notifyListeners();
  }

  /// Go to scene by ID
  void goToSceneById(String id, {bool addToHistory = true}) {
    final index = _scenes.indexWhere((s) => s.id == id);
    if (index >= 0) {
      goToScene(index, addToHistory: addToHistory);
    }
  }

  /// Go to next scene
  void next() {
    if (canGoNext) {
      goToScene(_currentIndex + 1);
    }
  }

  /// Go to previous scene (in sequence, not history)
  void previous() {
    if (canGoPrevious) {
      goToScene(_currentIndex - 1);
    }
  }

  /// Go back in history (breadcrumb)
  void goBack() {
    if (_history.isNotEmpty) {
      final previousIndex = _history.removeLast();
      goToScene(previousIndex, addToHistory: false);
    }
  }

  /// Clear history
  void clearHistory() {
    _history.clear();
    notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // Playback
  // ---------------------------------------------------------------------------

  /// Start auto-playing through scenes
  void play() {
    _isPlaying = true;
    notifyListeners();
    _playNext();
  }

  /// Pause playback
  void pause() {
    _isPlaying = false;
    notifyListeners();
  }

  /// Toggle play/pause
  void togglePlayback() {
    if (_isPlaying) {
      pause();
    } else {
      play();
    }
  }

  /// Set playback speed (0.5 = half speed, 2.0 = double speed)
  void setPlaybackSpeed(double speed) {
    _playbackSpeed = speed.clamp(0.25, 4.0);
    notifyListeners();
  }

  /// Scrub to a position (0.0 - 1.0 across all scenes)
  void scrubTo(double position) {
    final totalScenes = _scenes.length;
    if (totalScenes <= 1) return;

    final sceneProgress = position * (totalScenes - 1);
    final targetIndex = sceneProgress.floor().clamp(0, totalScenes - 2);
    final withinScene = sceneProgress - targetIndex;

    if (targetIndex != _currentIndex) {
      _previousScene = _scenes[targetIndex];
      _currentIndex = targetIndex + (withinScene > 0.5 ? 1 : 0);
    }

    // TODO: Set animation controller value for partial transitions
    notifyListeners();
  }

  void _playNext() {
    if (!_isPlaying) return;

    if (canGoNext) {
      next();
      // Schedule next scene after transition completes
      Future.delayed(
        Duration(
          milliseconds:
              (currentScene.transitionDuration.inMilliseconds / _playbackSpeed)
                  .round(),
        ),
        _playNext,
      );
    } else {
      // Reached end
      _isPlaying = false;
      notifyListeners();
    }
  }

  void _startTransition() {
    // Animation would be driven by the widget's AnimationController
    // This notifies listeners to start the animation
  }

  /// Attach an animation controller for smooth transitions
  void attachAnimationController(AnimationController controller) {
    _animationController = controller;
  }

  @override
  void dispose() {
    _animationController = null;
    super.dispose();
  }
}

// =============================================================================
// GRAPH STAGE - The viewport widget
// =============================================================================

/// GraphStage is the main viewport for rendering graph scenes.
///
/// Like a film stage, it:
/// - Frames the current shot (viewport transform)
/// - Handles camera movements (pan, zoom, rotate)
/// - Responds to director commands
/// - Renders the scene content
class GraphStage extends StatefulWidget {
  /// The director controlling scene navigation
  final GraphDirector director;

  /// Builder for rendering graph content
  /// Receives the current interpolated scene state
  final Widget Function(BuildContext context, GraphScene scene) builder;

  /// Whether to show scene navigation overlay
  final bool showControls;

  /// Whether to show breadcrumb trail
  final bool showBreadcrumbs;

  /// Whether to enable gesture-based navigation
  final bool enableGestures;

  /// Callback when a node is tapped
  final void Function(String nodeId)? onNodeTap;

  /// Callback when an edge is tapped
  final void Function(String edgeId)? onEdgeTap;

  /// Callback when background is tapped
  final VoidCallback? onBackgroundTap;

  const GraphStage({
    super.key,
    required this.director,
    required this.builder,
    this.showControls = true,
    this.showBreadcrumbs = true,
    this.enableGestures = true,
    this.onNodeTap,
    this.onEdgeTap,
    this.onBackgroundTap,
  });

  @override
  State<GraphStage> createState() => _GraphStageState();
}

class _GraphStageState extends State<GraphStage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: widget.director.currentScene.transitionDuration,
    );
    _animation = CurvedAnimation(
      parent: _animationController,
      curve: widget.director.currentScene.transitionCurve,
    );

    widget.director.attachAnimationController(_animationController);
    widget.director.addListener(_onDirectorChange);
  }

  @override
  void dispose() {
    widget.director.removeListener(_onDirectorChange);
    _animationController.dispose();
    super.dispose();
  }

  void _onDirectorChange() {
    // Update animation duration for new scene
    _animationController.duration =
        widget.director.currentScene.transitionDuration;

    // Start transition animation
    _animationController.forward(from: 0.0);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        final scene = widget.director.interpolatedScene;

        return Stack(
          children: [
            // Main graph viewport
            GestureDetector(
              onTap: widget.onBackgroundTap,
              child: Transform.translate(
                offset: scene.center,
                child: Transform.scale(
                  scale: scene.scale,
                  child: Transform.rotate(
                    angle: scene.rotation,
                    child: widget.builder(context, scene),
                  ),
                ),
              ),
            ),

            // Breadcrumb trail
            if (widget.showBreadcrumbs && widget.director.history.isNotEmpty)
              Positioned(
                top: 16,
                left: 16,
                right: 16,
                child: _BreadcrumbTrail(director: widget.director),
              ),

            // Scene controls
            if (widget.showControls)
              Positioned(
                bottom: 16,
                left: 16,
                right: 16,
                child: _SceneControls(director: widget.director),
              ),
          ],
        );
      },
    );
  }
}

// =============================================================================
// BREADCRUMB TRAIL
// =============================================================================

class _BreadcrumbTrail extends StatelessWidget {
  final GraphDirector director;

  const _BreadcrumbTrail({required this.director});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: CharlotteColors.glassFill,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: CharlotteColors.glassBorder),
          ),
          child: Row(
            children: [
              // Back button
              if (director.canGoBack)
                GestureDetector(
                  onTap: director.goBack,
                  child: Icon(
                    Icons.arrow_back,
                    size: 18,
                    color: CharlotteColors.textSecondary,
                  ),
                ),

              const SizedBox(width: 8),

              // Breadcrumb items
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      for (int i = 0; i < director.history.length; i++) ...[
                        if (i > 0)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: Icon(
                              Icons.chevron_right,
                              size: 14,
                              color: CharlotteColors.textTertiary,
                            ),
                          ),
                        GestureDetector(
                          onTap: () {
                            // Go back to this point in history
                            while (director.history.length > i) {
                              director.goBack();
                            }
                          },
                          child: Text(
                            director.scenes[director.history[i]].label ??
                                'Scene ${director.history[i] + 1}',
                            style: TextStyle(
                              color: CharlotteColors.textTertiary,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                      // Current scene
                      if (director.history.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: Icon(
                            Icons.chevron_right,
                            size: 14,
                            color: CharlotteColors.textTertiary,
                          ),
                        ),
                      Text(
                        director.currentScene.label ??
                            'Scene ${director.currentIndex + 1}',
                        style: TextStyle(
                          color: CharlotteColors.textPrimary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =============================================================================
// SCENE CONTROLS - Playback and navigation
// =============================================================================

class _SceneControls extends StatelessWidget {
  final GraphDirector director;

  const _SceneControls({required this.director});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: CharlotteColors.glassFill,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: CharlotteColors.glassBorder),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Scene scrubber
              _SceneScrubber(director: director),

              const SizedBox(height: 12),

              // Playback controls
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Previous
                  _ControlButton(
                    icon: Icons.skip_previous,
                    onPressed: director.canGoPrevious ? director.previous : null,
                  ),

                  const SizedBox(width: 16),

                  // Play/Pause
                  _ControlButton(
                    icon: director.isPlaying ? Icons.pause : Icons.play_arrow,
                    onPressed: director.togglePlayback,
                    isPrimary: true,
                  ),

                  const SizedBox(width: 16),

                  // Next
                  _ControlButton(
                    icon: Icons.skip_next,
                    onPressed: director.canGoNext ? director.next : null,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SceneScrubber extends StatelessWidget {
  final GraphDirector director;

  const _SceneScrubber({required this.director});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Scene indicators
        Row(
          children: [
            for (int i = 0; i < director.sceneCount; i++)
              Expanded(
                child: GestureDetector(
                  onTap: () => director.goToScene(i),
                  child: Container(
                    height: 4,
                    margin: EdgeInsets.only(right: i < director.sceneCount - 1 ? 4 : 0),
                    decoration: BoxDecoration(
                      color: i == director.currentIndex
                          ? CharlotteColors.primary
                          : i < director.currentIndex
                              ? CharlotteColors.primary.withValues(alpha: 0.5)
                              : CharlotteColors.surface,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ),
          ],
        ),

        const SizedBox(height: 8),

        // Scene label
        Text(
          director.currentScene.label ?? 'Scene ${director.currentIndex + 1}',
          style: TextStyle(
            color: CharlotteColors.textSecondary,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

class _ControlButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final bool isPrimary;

  const _ControlButton({
    required this.icon,
    this.onPressed,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = onPressed == null;

    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: isPrimary ? 48 : 36,
        height: isPrimary ? 48 : 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isPrimary
              ? CharlotteColors.primary
              : CharlotteColors.surface,
          border: Border.all(
            color: isPrimary
                ? CharlotteColors.primary
                : CharlotteColors.glassBorder,
          ),
        ),
        child: Icon(
          icon,
          size: isPrimary ? 24 : 18,
          color: isDisabled
              ? CharlotteColors.textDisabled
              : isPrimary
                  ? CharlotteColors.white
                  : CharlotteColors.textSecondary,
        ),
      ),
    );
  }
}

// =============================================================================
// TRAVERSAL PATH - Animated path following
// =============================================================================

/// Renders an animated path showing traversal route between nodes.
class TraversalPath extends StatefulWidget {
  /// Sequence of node IDs in the path
  final List<String> nodeIds;

  /// Map of node ID to position (in graph coordinates)
  final Map<String, Offset> nodePositions;

  /// Path color
  final Color? color;

  /// Whether to animate the path drawing
  final bool animate;

  /// Animation duration
  final Duration duration;

  /// Whether to show direction arrows
  final bool showArrows;

  const TraversalPath({
    super.key,
    required this.nodeIds,
    required this.nodePositions,
    this.color,
    this.animate = true,
    this.duration = const Duration(milliseconds: 1000),
    this.showArrows = true,
  });

  @override
  State<TraversalPath> createState() => _TraversalPathState();
}

class _TraversalPathState extends State<TraversalPath>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );

    if (widget.animate) {
      _controller.forward();
    } else {
      _controller.value = 1.0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: _TraversalPathPainter(
            nodeIds: widget.nodeIds,
            nodePositions: widget.nodePositions,
            color: widget.color ?? CharlotteColors.primary,
            progress: _controller.value,
            showArrows: widget.showArrows,
          ),
        );
      },
    );
  }
}

class _TraversalPathPainter extends CustomPainter {
  final List<String> nodeIds;
  final Map<String, Offset> nodePositions;
  final Color color;
  final double progress;
  final bool showArrows;

  _TraversalPathPainter({
    required this.nodeIds,
    required this.nodePositions,
    required this.color,
    required this.progress,
    required this.showArrows,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (nodeIds.length < 2) return;

    final path = Path();
    final points = <Offset>[];

    for (final nodeId in nodeIds) {
      final position = nodePositions[nodeId];
      if (position != null) {
        points.add(position);
      }
    }

    if (points.length < 2) return;

    // Create path
    path.moveTo(points[0].dx, points[0].dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }

    // Calculate path length and draw portion based on progress
    final pathMetrics = path.computeMetrics().first;
    final drawLength = pathMetrics.length * progress;
    final drawPath = pathMetrics.extractPath(0, drawLength);

    // Draw glow
    final glowPaint = Paint()
      ..color = color.withValues(alpha: 0.3)
      ..strokeWidth = 8
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
    canvas.drawPath(drawPath, glowPaint);

    // Draw path
    final pathPaint = Paint()
      ..color = color
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(drawPath, pathPaint);

    // Draw arrows at midpoints if enabled
    if (showArrows && progress > 0.3) {
      // Arrow logic would go here
    }
  }

  @override
  bool shouldRepaint(_TraversalPathPainter oldDelegate) {
    return progress != oldDelegate.progress ||
        color != oldDelegate.color ||
        nodeIds != oldDelegate.nodeIds;
  }
}

// =============================================================================
// FOCUS RING - Animated highlight for focused node
// =============================================================================

/// Animated ring that pulses around the focused node.
class FocusRing extends StatefulWidget {
  /// Size of the ring
  final double size;

  /// Ring color
  final Color? color;

  /// Whether to animate
  final bool animate;

  const FocusRing({
    super.key,
    this.size = 60,
    this.color,
    this.animate = true,
  });

  @override
  State<FocusRing> createState() => _FocusRingState();
}

class _FocusRingState extends State<FocusRing>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    if (widget.animate) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? CharlotteColors.primary;

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final pulse = 1.0 + (_controller.value * 0.2);
        final opacity = 1.0 - (_controller.value * 0.7);

        return SizedBox(
          width: widget.size * pulse,
          height: widget.size * pulse,
          child: CustomPaint(
            painter: _FocusRingPainter(
              color: color.withValues(alpha: opacity),
              strokeWidth: 2,
            ),
          ),
        );
      },
    );
  }
}

class _FocusRingPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;

  _FocusRingPainter({
    required this.color,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - strokeWidth;

    // Glow
    final glowPaint = Paint()
      ..color = color.withValues(alpha: 0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth * 3
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
    canvas.drawCircle(center, radius, glowPaint);

    // Ring
    final ringPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    canvas.drawCircle(center, radius, ringPaint);
  }

  @override
  bool shouldRepaint(_FocusRingPainter oldDelegate) {
    return color != oldDelegate.color || strokeWidth != oldDelegate.strokeWidth;
  }
}
