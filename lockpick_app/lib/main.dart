import 'package:flutter/material.dart';
import 'package:lockpick_app/theme.dart';
import 'package:lockpick_app/widgets/difficulty_widget.dart';
import 'package:lockpick_app/widgets/splash_widget.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: darkTheme,
        darkTheme: darkTheme,
        debugShowCheckedModeBanner: false,
        home: const RootScreen());
  }
}

class RootScreen extends StatefulWidget {
  const RootScreen({super.key});
  @override
  State<StatefulWidget> createState() {
    return _RootScreenState();
  }
}

class _RootScreenState extends State<RootScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        floatingActionButton: FloatingActionButton.extended(
            onPressed: () => showModalBottomSheet(
                context: context, builder: (context) => DifficultyModal()),
            label: Text("New Game", style: darkTheme.textTheme.titleMedium)),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        backgroundColor: darkTheme.colorScheme.background,
        body: SplashWidget());
  }
}
