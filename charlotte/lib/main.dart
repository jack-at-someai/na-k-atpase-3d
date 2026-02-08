import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'firebase_options.dart';
import 'theme.dart';
import 'ui/screens/components_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const CharlotteApp());
}

class CharlotteApp extends StatelessWidget {
  const CharlotteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return CupertinoTheme(
      data: charlotteCupertinoTheme,
      child: MaterialApp(
        title: 'Charlotte',
        debugShowCheckedModeBanner: false,
        theme: charlotteTheme,
        home: const ComponentsScreen(), // Skip auth for dev
      ),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const _LoadingScreen();
        }

        final user = snapshot.data;
        if (user == null) {
          return const _SignInScreen();
        }

        return SubstrateRoot(userId: user.uid);
      },
    );
  }
}

/// The root view - design system preview during development.
class SubstrateRoot extends StatelessWidget {
  final String userId;

  const SubstrateRoot({super.key, required this.userId});

  @override
  Widget build(BuildContext context) {
    return const ComponentsScreen();
  }
}

class _SignInScreen extends StatefulWidget {
  const _SignInScreen();

  @override
  State<_SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<_SignInScreen> {
  bool _isLoading = false;

  Future<void> _signInAnonymously() async {
    setState(() => _isLoading = true);
    try {
      await FirebaseAuth.instance.signInAnonymously();
    } catch (e) {
      debugPrint('Sign in error: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CharlotteColors.background,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'CHARLOTTE',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: 48),
              if (_isLoading)
                CupertinoActivityIndicator(color: CharlotteColors.white)
              else
                CupertinoButton(
                  color: CharlotteColors.primary,
                  onPressed: _signInAnonymously,
                  child: const Text('Enter'),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CharlotteColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'CHARLOTTE',
              style: Theme.of(context).textTheme.displayLarge,
            ),
            const SizedBox(height: 24),
            CupertinoActivityIndicator(color: CharlotteColors.white),
          ],
        ),
      ),
    );
  }
}
