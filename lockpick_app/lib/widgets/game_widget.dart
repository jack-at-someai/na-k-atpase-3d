import 'dart:async';
import 'dart:math' as math;
import 'dart:math';
import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:lockpick_app/core/lock_generator.dart';
import 'package:lockpick_app/painters/lock_object.dart';
import 'package:lockpick_app/painters/pick_object.dart';
import 'package:lockpick_app/theme.dart';
import 'package:lockpick_app/widgets/winner_widget.dart';

class GameWidget extends StatefulWidget {
  final String difficulty;
  final int bits;
  final int amount;
  final int rerolls;
  const GameWidget({
    super.key,
    this.bits = 6,
    this.amount = 5,
    this.rerolls = 3,
    required this.difficulty,
  });

  @override
  State<StatefulWidget> createState() {
    return _GameWidgetState();
  }
}

const duration = Duration(milliseconds: 100);

class _GameWidgetState extends State<GameWidget> {
  late List<List<int>> locks;
  late List<int>? pick;
  late int rotate = 0;
  late Timer _timer;

  late int rerolls = widget.rerolls;
  int score = 0;
  int moves = 0;
  int seconds = 0;
  bool won = false;
  List<int> get rotatedPick => rotated(pick ?? generateUsablePick(locks.last));

  void rotateBack() => setState(() => rotate -= 1);

  void rotateNext() => setState(() => rotate += 1);
  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  void initState() {
    reset();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        seconds += 1;
      });
    });
    super.initState();
  }

  reroll() {
    if (rerolls <= 0) return;
    setState(() {
      rerolls -= 1;
      pick = generateUsablePick(locks.last);
    });
  }

  submitKey() {
    if (pick == null) return;
    if (doesPickFitLock(rotatedPick, locks.last)) {
      var scoreToAdd = 100 + (rotatedPick.sum * rotatedPick.sum * 10);
      setState(() {
        locks.last.asMap().forEach((index, element) => locks.last[index] =
            element == 1 || rotated(pick!)[index] == 1 ? 1 : 0);
      });
      if (locks.last.every((element) => element == 1)) {
        scoreToAdd += max((1000 - (seconds * 5)), 0) + (rerolls * 100);
        setState(() {
          locks.removeLast();
        });
      }
      setState(() {
        score += scoreToAdd;
        moves += 1;
      });
      if (locks.isEmpty) {
        setState(() {
          won = true;
        });
        showDialog(
            context: context,
            builder: (context) => WinnerDialog(
                  score: score,
                  seconds: seconds,
                  moves: moves,
                  bits: widget.bits,
                  amount: widget.amount,
                  rerolls: widget.rerolls,
                  rerollsUsed: widget.rerolls - rerolls,
                  difficulty: widget.difficulty,
                ));
      } else {
        rotate = math.Random().nextInt(widget.bits);
        setState(() {
          pick = generateUsablePick(locks.last);
        });
      }
    }
  }

  List<int> rotated(List<int> pick) {
    List<int> result = [];
    for (int i = 0; i < pick.length; i++) {
      result.add(pick[(i + rotate) % pick.length]);
    }
    return result;
  }

  int get minutes => seconds ~/ 60;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: darkTheme.colorScheme.background,
        ),
        body: SafeArea(
            minimum: EdgeInsets.only(top: 40),
            child: Stack(children: [
              Align(
                  alignment: Alignment(0, .9),
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        IconButton(
                          icon: Icon(Icons.arrow_circle_left_outlined,
                              color: Colors.white),
                          iconSize: 48,
                          onPressed: rotateBack,
                        ),
                        IconButton(
                          icon: Icon(Icons.arrow_circle_right_outlined,
                              color: Colors.white),
                          iconSize: 48,
                          onPressed: rotateNext,
                        ),
                      ])),
              Align(
                alignment: Alignment.topCenter,
                child: Text(
                  "BITWISE",
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
              Align(
                alignment: Alignment(0, -0.66),
                child: ListTile(
                  leading: Chip(
                    avatar: const Icon(Icons.leaderboard_rounded),
                    label: Text(score.toString()),
                  ),
                  trailing: Chip(
                    avatar: const Icon(Icons.timer_rounded),
                    label: Text(
                        "$minutes:${(seconds % 60).toString().padLeft(2, '0')}"),
                  ),
                  title: Text(widget.difficulty, textAlign: TextAlign.center),
                ),
              ),
              Center(child: Text("${locks.length}")),
              ...locks.reversed
                  .take(5)
                  .mapIndexed((index, e) => Center(
                      child: AnimatedOpacity(
                          duration: duration,
                          opacity: (1 + index) * 0.2,
                          child: LockGameObject.build(e, (5 - index) * 64,
                              pick: rotatedPick, current: index == 0))))
                  .toList(),
              AnimatedRotation(
                  duration: duration,
                  turns: -rotate / widget.bits,
                  child: Center(child: PickGameObject.build(pick!, 6 * 64))),
            ])));
  }

  reset() {
    setState(() {
      rotate = 0;
      won = false;
      rerolls = widget.rerolls;
      score = 0;
      moves = 0;
      seconds = 0;
      locks = generate2DArray(widget.bits, widget.amount);
      pick = generateUsablePick(locks.last);
    });
  }
}
