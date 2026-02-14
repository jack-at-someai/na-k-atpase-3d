import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../services/auth_service.dart';
import '../../services/store_service.dart';
import '../../theme/cardvault_colors.dart';

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _isCreateMode = false;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final auth = ref.read(authServiceProvider);
      final storeService = ref.read(storeServiceProvider);

      if (_isCreateMode) {
        final cred = await auth.createAccount(
            _emailController.text.trim(), _passwordController.text);
        // Create a default profile
        if (cred.user != null) {
          await storeService.getOrCreateProfile(
              cred.user!.uid, cred.user!.email ?? '');
        }
      } else {
        final cred = await auth.signInWithEmail(
            _emailController.text.trim(), _passwordController.text);
        if (cred.user != null) {
          await storeService.getOrCreateProfile(
              cred.user!.uid, cred.user!.email ?? '');
        }
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: CardVaultColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Gold gradient title
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [CardVaultColors.gold500, CardVaultColors.gold300],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ).createShader(bounds),
                    child: Text(
                      'CARDVAULT',
                      style: theme.textTheme.displayLarge?.copyWith(
                        color: Colors.white,
                        letterSpacing: 4,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'THE GOLD STANDARD',
                    style: theme.textTheme.labelMedium?.copyWith(
                      color: CardVaultColors.gold500,
                      letterSpacing: 3,
                    ),
                  ),
                  const SizedBox(height: 48),
                  GlassContainer(
                    padding: const EdgeInsets.all(24),
                    tint: CardVaultColors.gold500,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        GlassTextField(
                          controller: _emailController,
                          labelText: 'Email',
                          hintText: 'you@example.com',
                          prefixIconData: Icons.email_outlined,
                          keyboardType: TextInputType.emailAddress,
                        ),
                        const SizedBox(height: 16),
                        GlassTextField(
                          controller: _passwordController,
                          labelText: 'Password',
                          obscureText: true,
                          prefixIconData: Icons.lock_outlined,
                          onSubmitted: (_) => _submit(),
                        ),
                        if (_error != null) ...[
                          const SizedBox(height: 12),
                          Text(
                            _error!,
                            style: const TextStyle(
                                color: CardVaultColors.error, fontSize: 13),
                          ),
                        ],
                        const SizedBox(height: 24),
                        _isLoading
                            ? const Center(
                                child: CupertinoActivityIndicator(
                                    color: CardVaultColors.gold500))
                            : GlassFilledButton(
                                onPressed: _submit,
                                label: _isCreateMode
                                    ? 'Create Account'
                                    : 'Sign In',
                              ),
                        const SizedBox(height: 12),
                        GlassTextButton(
                          onPressed: () =>
                              setState(() => _isCreateMode = !_isCreateMode),
                          label: _isCreateMode
                              ? 'Already have an account? Sign in'
                              : 'Need an account? Create one',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  Text(
                    'by Tom Brady',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: CardVaultColors.dim,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
