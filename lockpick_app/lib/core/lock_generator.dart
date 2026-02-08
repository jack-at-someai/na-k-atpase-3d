import 'dart:math' as math;
import 'package:collection/collection.dart';

List<int> generateUsablePick(List<int> lock) {
  List<int> result = [];
  for (int i = 0; i < lock.length; i++) {
    if (lock[i] == 0) {
      result.add(math.Random().nextInt(2));
    } else {
      result.add(0);
    }
  }
  return doesPickFitLock(result, lock) ? result : generateUsablePick(lock);
}

List<List<int>> generate2DArray(int bits, int count) {
  List<List<int>> result = [];
  for (int i = 0; i < count; i++) {
    List<int> innerArray = [1, 0];
    for (int j = 0; j < bits - 2; j++) {
      int randomNumber = math.Random().nextInt(2);
      innerArray.add(randomNumber);
    }
    result.add(innerArray);
  }

  return result.none((element) => element.every((e) => e == 0))
      ? result
      : generate2DArray(bits, count);
}

bool doesPickFitLock(List<int> pick, List<int> lock) =>
    pick.every((e) => e == 0)
        ? false
        : pick.mapIndexed((i, v) => lock[i] + v).every((b) => b < 2);
