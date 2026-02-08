import 'package:flutter/material.dart';
import 'dart:math' as math;

const double degree = 2 * math.pi / 360;

abstract class GameObjectPainter extends CustomPainter {
  final List<int> value;
  GameObjectPainter({required this.value}) : super();

  int get bits => value.length;
  double startAngle(int i) => -1 * math.pi / 2 + (sweepAngle * i);
  double get sweepAngle => 2 * math.pi / bits;
}
