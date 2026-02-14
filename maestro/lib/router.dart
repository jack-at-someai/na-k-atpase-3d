import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'providers/auth_provider.dart';
import 'screens/auth/sign_in_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/settings/subscription_screen.dart';
import 'screens/strategy/strategy_shell.dart';
import 'screens/strategy/x_matrix_screen.dart';
import 'screens/strategy/bowling_screen.dart';
import 'screens/strategy/a3_screen.dart';
import 'screens/strategy/kaizen_screen.dart';
import 'screens/strategy/pdca_screen.dart';
import 'screens/strategy/catchball_screen.dart';
import 'screens/strategy/knowledge_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull != null;
      final isOnAuth = state.matchedLocation == '/sign-in';

      if (!isLoggedIn && !isOnAuth) return '/sign-in';
      if (isLoggedIn && isOnAuth) return '/';
      return null;
    },
    routes: [
      GoRoute(
        path: '/sign-in',
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => StrategyShell(child: child),
        routes: [
          GoRoute(
            path: '/strategy/:id/x-matrix',
            builder: (context, state) => XMatrixScreen(
              strategyId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/strategy/:id/bowling',
            builder: (context, state) => BowlingScreen(
              strategyId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/strategy/:id/a3',
            builder: (context, state) => A3Screen(
              strategyId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/strategy/:id/kaizen',
            builder: (context, state) => KaizenScreen(
              strategyId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/strategy/:id/pdca',
            builder: (context, state) => PdcaScreen(
              strategyId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/strategy/:id/catchball',
            builder: (context, state) => CatchballScreen(
              strategyId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/strategy/:id/knowledge',
            builder: (context, state) => KnowledgeScreen(
              strategyId: state.pathParameters['id']!,
            ),
          ),
        ],
      ),
      GoRoute(
        path: '/settings/subscription',
        builder: (context, state) => const SubscriptionScreen(),
      ),
    ],
  );
});
