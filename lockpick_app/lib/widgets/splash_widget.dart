import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:lockpick_app/core/lock_generator.dart';
import 'package:lockpick_app/painters/lock_object.dart';
import "dart:math" as math;

class SplashWidget extends StatefulWidget {
  const SplashWidget({super.key});

  @override
  State<StatefulWidget> createState() {
    return _SplashWidgetState();
  }
}

class _SplashWidgetState extends State<SplashWidget> {
  late List<List<int>> locks = generate2DArray(24, 5);
  late List<int> rotations;

  @override
  void initState() {
    super.initState();
    animate();
  }

  animate() {
    setState(() {
      rotations = locks.map((e) => math.Random().nextInt(24)).toList();
    });
    Future.delayed(const Duration(milliseconds: 3000), animate);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        minimum: const EdgeInsets.all(16),
        child: Center(
            child: Stack(children: [
          Center(
              child: Text("BITWISE",
                  style: Theme.of(context).textTheme.titleLarge)),
          ...locks.reversed
              .take(5)
              .mapIndexed((index, e) => Center(
                  child: AnimatedRotation(
                      duration: const Duration(milliseconds: 3000),
                      turns: -rotations[index] / 24,
                      child: AnimatedOpacity(
                          duration: const Duration(milliseconds: 3000),
                          opacity: (1 + index) * 0.2,
                          child: LockGameObject.build(e, 128 + (4 - index) * 64,
                              pick: locks[0], current: index == 0)))))
              .toList(),
        ])));
  }
}
