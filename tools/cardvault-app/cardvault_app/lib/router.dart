import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'providers/auth_provider.dart';
import 'providers/user_provider.dart';
import 'models/user_profile.dart';
import 'screens/auth/sign_in_screen.dart';
import 'screens/customer/customer_home_screen.dart';
import 'screens/customer/card_detail_screen.dart';
import 'screens/owner/owner_dashboard_screen.dart';
import 'screens/owner/inventory_edit_screen.dart';
import 'screens/owner/price_agent_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  final userRole = ref.watch(userRoleProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull != null;
      final isOnAuth = state.matchedLocation == '/sign-in';

      // Not logged in — force to sign-in
      if (!isLoggedIn && !isOnAuth) return '/sign-in';

      // Logged in but on auth page — redirect based on role
      if (isLoggedIn && isOnAuth) {
        return userRole == UserRole.owner ? '/owner' : '/';
      }

      // Logged in, going to root — redirect owner to their dashboard
      if (isLoggedIn &&
          state.matchedLocation == '/' &&
          userRole == UserRole.owner) {
        return '/owner';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/sign-in',
        builder: (context, state) => const SignInScreen(),
      ),

      // Customer routes
      GoRoute(
        path: '/',
        builder: (context, state) => const CustomerHomeScreen(),
      ),
      GoRoute(
        path: '/card/:id',
        builder: (context, state) => CardDetailScreen(
          cardId: state.pathParameters['id']!,
        ),
      ),

      // Owner routes
      GoRoute(
        path: '/owner',
        builder: (context, state) => const OwnerDashboardScreen(),
      ),
      GoRoute(
        path: '/inventory/:id',
        builder: (context, state) => InventoryEditScreen(
          cardId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/price-agent',
        builder: (context, state) => const PriceAgentScreen(),
      ),
    ],
  );
});
