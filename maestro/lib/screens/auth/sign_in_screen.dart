import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../services/auth_service.dart';
import '../../theme/maestro_colors.dart';

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
      if (_isCreateMode) {
        await auth.createAccount(
            _emailController.text.trim(), _passwordController.text);
      } else {
        await auth.signInWithEmail(
            _emailController.text.trim(), _passwordController.text);
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final auth = ref.read(authServiceProvider);
      await auth.signInWithGoogle();
    } catch (e) {
      if (e.toString().contains('cancelled')) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: MaestroColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'MAESTRO',
                    style: theme.textTheme.displayLarge?.copyWith(
                      color: MaestroColors.accent,
                      letterSpacing: 4,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Strategy Deployment',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: MaestroColors.muted,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 48),
                  GlassContainer(
                    padding: const EdgeInsets.all(24),
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
                            style: TextStyle(
                                color: MaestroColors.danger, fontSize: 13),
                          ),
                        ],
                        const SizedBox(height: 24),
                        _isLoading
                            ? const Center(
                                child: CupertinoActivityIndicator())
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
                  const SizedBox(height: 16),
                  // Google Sign In
                  GlassOutlinedButton(
                    onPressed: _signInWithGoogle,
                    label: 'Sign in with Google',
                    leadingIcon: Icons.g_mobiledata,
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
