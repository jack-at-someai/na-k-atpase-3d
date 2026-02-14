import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'router.dart';
import 'theme/maestro_theme.dart';

class MaestroApp extends ConsumerWidget {
  const MaestroApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return CharlotteTheme(
      config: maestroThemeConfig,
      child: CupertinoTheme(
        data: maestroCupertinoTheme,
        child: MaterialApp.router(
          title: 'Maestro',
          debugShowCheckedModeBanner: false,
          theme: maestroTheme,
          routerConfig: router,
        ),
      ),
    );
  }
}
