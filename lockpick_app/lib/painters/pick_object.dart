import 'package:flutter/material.dart';
import 'package:lockpick_app/painters/game_object.dart';
import 'package:lockpick_app/theme.dart';

class PickGameObject extends GameObjectPainter {
  static Widget build(List<int> value, double size) => CustomPaint(
      size: Size.square(size), painter: PickGameObject(value: value));
  PickGameObject({required super.value});

  Paint get guideCirclePaint => Paint()
    ..color = darkTheme.colorScheme.primary
    ..strokeWidth = 4.0
    ..strokeCap = StrokeCap.butt
    ..style = PaintingStyle.stroke;

  Paint get indicatorCirclePaint => Paint()
    ..color = darkTheme.colorScheme.secondary
    ..strokeWidth = 20.0
    ..strokeCap = StrokeCap.butt
    ..style = PaintingStyle.stroke;

  Paint get basePaint => Paint()
    ..color = darkTheme.colorScheme.surface
    ..strokeWidth = 20.0;
  double get indicatorSize => 5 * degree;

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < value.length; i++) {
      canvas.drawArc(Offset.zero & Size(size.width, size.height), startAngle(i),
          sweepAngle, false, guideCirclePaint);
      if (value[i] == 1) {
        canvas.drawArc(
            Offset.zero & Size(size.width, size.height),
            startAngle(i) + (sweepAngle / 2) - indicatorSize / 2,
            indicatorSize,
            false,
            indicatorCirclePaint);
      }
    }
  }

  @override
  bool shouldRepaint(GameObjectPainter oldDelegate) {
    return value != oldDelegate.value ||
        oldDelegate.value.length != value.length;
  }
}
