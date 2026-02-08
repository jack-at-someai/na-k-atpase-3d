import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:lockpick_app/painters/game_object.dart';
import 'package:lockpick_app/theme.dart';

class LockGameObject extends GameObjectPainter {
  final List<int> pick;
  final bool current;
  static Widget build(List<int> value, double size,
          {required List<int> pick, bool current = false}) =>
      CustomPaint(
          size: Size.square(size),
          painter: LockGameObject(value: value, pick: pick, current: current));

  LockGameObject(
      {required super.value, required this.pick, this.current = false});

  Color getBaseColor() {
    if (current) {
      return darkTheme.colorScheme.primary;
    } else if (doesPickFit) {
      return darkTheme.colorScheme.secondary;
    } else {
      return darkTheme.colorScheme.surface;
    }
  }

  List<int> get pickIndices => pick
      .mapIndexed((index, e) => e == 1 ? index : -1)
      .toList()
      .where((e) => e != -1)
      .toList();

  Paint get baseBrush => Paint()
    ..strokeWidth = 16.0
    ..strokeCap = StrokeCap.butt
    ..style = PaintingStyle.stroke;

  Paint get hidePaint => baseBrush..color = darkTheme.colorScheme.surface;
  Paint get hoverPaint =>
      baseBrush..color = darkTheme.colorScheme.primary.withOpacity(0.5);
  Paint get filledPaint => baseBrush..color = darkTheme.colorScheme.primary;
  Paint get openPaint => baseBrush..color = darkTheme.colorScheme.surface;

  bool get doesPickFit => pickIndices.every((i) => value[i] == 0);
  bool get doesPickFitPerfectly =>
      pick.mapIndexed((i, p) => p + value[i]).every((v) => v == 1);

  List<int> rotated(List<int> pick, int rotate) {
    List<int> result = [];
    for (int i = 0; i < pick.length; i++) {
      result.add(pick[(i + rotate) % pick.length]);
    }
    return result;
  }

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < value.length; i++) {
      if (value[i] == 1) {
        canvas.drawArc(
            Offset.zero & Size(size.width, size.height),
            startAngle(i) + 2 * degree,
            sweepAngle - degree,
            false,
            filledPaint
              ..color = current
                  ? filledPaint.color.withOpacity(1)
                  : filledPaint.color.withOpacity(0.1));
      } else if (pick[i] == 1 && current && doesPickFit) {
        canvas.drawArc(Offset.zero & Size(size.width, size.height),
            startAngle(i) + 2 * degree, sweepAngle - degree, false, hoverPaint);
      } else {
        canvas.drawArc(Offset.zero & Size(size.width, size.height),
            startAngle(i) + 2 * degree, sweepAngle - degree, false, openPaint);
      }
    }
  }

  @override
  bool shouldRepaint(LockGameObject oldDelegate) {
    return value != oldDelegate.value || pick != oldDelegate.pick;
  }
}
