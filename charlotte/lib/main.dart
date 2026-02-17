import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_fonts/google_fonts.dart';
import 'firebase_options.dart';
import 'theme.dart';
import 'router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const SomeAIApp());
}

class SomeAIApp extends StatelessWidget {
  const SomeAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return CharlotteTheme(
      config: someaiThemeConfig,
      child: MaterialApp.router(
        title: 'SomeAI',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.dark,
          scaffoldBackgroundColor: SomeAIColors.background,
          colorScheme: ColorScheme.dark(
            primary: SomeAIColors.primary.base,
            secondary: SomeAIColors.secondary.base,
            tertiary: SomeAIColors.tertiary.base,
            surface: SomeAIColors.surface,
            error: SomeAIColors.error.base,
          ),
          textTheme: GoogleFonts.interTextTheme(
            ThemeData.dark().textTheme,
          ).apply(
            bodyColor: SomeAIColors.textPrimary,
            displayColor: SomeAIColors.textPrimary,
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.transparent,
            elevation: 0,
          ),
        ),
        routerConfig: appRouter,
      ),
    );
  }
}
