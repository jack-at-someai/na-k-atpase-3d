import 'package:go_router/go_router.dart';
import 'screens/home_screen.dart';
import 'screens/docs/prd_screen.dart';
import 'screens/docs/sdd_screen.dart';
import 'screens/docs/krf_guide_screen.dart';
import 'screens/charlotte/boot_image_screen.dart';
import 'screens/charlotte/krf_viewer_screen.dart';
import 'screens/charlotte/primitives_screen.dart';
import 'screens/charlotte/valuation_layer_screen.dart';
import 'screens/org/dual_engine_screen.dart';
import 'screens/org/team_screen.dart';
import 'screens/clients/client_hub_screen.dart';
import 'screens/clients/client_detail_screen.dart';
import 'screens/research/sumai_screen.dart';
import 'screens/research/reference_library_screen.dart';
import 'screens/infra/nervous_system_screen.dart';
import 'screens/infra/design_system_screen.dart';
import 'screens/infra/knowledge_graph_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),

    // Core Documents
    GoRoute(
      path: '/docs/prd',
      builder: (context, state) => const PrdScreen(),
    ),
    GoRoute(
      path: '/docs/sdd',
      builder: (context, state) => const SddScreen(),
    ),
    GoRoute(
      path: '/docs/krf-guide',
      builder: (context, state) => const KrfGuideScreen(),
    ),

    // Charlotte OS
    GoRoute(
      path: '/charlotte/boot-image',
      builder: (context, state) => const BootImageScreen(),
    ),
    GoRoute(
      path: '/charlotte/krf/:filename',
      builder: (context, state) => KrfViewerScreen(
        filename: state.pathParameters['filename']!,
      ),
    ),
    GoRoute(
      path: '/charlotte/primitives',
      builder: (context, state) => const PrimitivesScreen(),
    ),
    GoRoute(
      path: '/charlotte/valuation-layer',
      builder: (context, state) => const ValuationLayerScreen(),
    ),

    // Organization
    GoRoute(
      path: '/org/dual-engine',
      builder: (context, state) => const DualEngineScreen(),
    ),
    GoRoute(
      path: '/org/team',
      builder: (context, state) => const TeamScreen(),
    ),

    // Clients
    GoRoute(
      path: '/clients',
      builder: (context, state) => const ClientHubScreen(),
    ),
    GoRoute(
      path: '/clients/:id',
      builder: (context, state) => ClientDetailScreen(
        clientId: state.pathParameters['id']!,
      ),
    ),

    // Research
    GoRoute(
      path: '/research/sumai',
      builder: (context, state) => const SumaiScreen(),
    ),
    GoRoute(
      path: '/research/references',
      builder: (context, state) => const ReferenceLibraryScreen(),
    ),

    // Infrastructure
    GoRoute(
      path: '/infra/nervous-system',
      builder: (context, state) => const NervousSystemScreen(),
    ),
    GoRoute(
      path: '/infra/design-system',
      builder: (context, state) => const DesignSystemScreen(),
    ),
    GoRoute(
      path: '/infra/knowledge-graph',
      builder: (context, state) => const KnowledgeGraphScreen(),
    ),
  ],
);
