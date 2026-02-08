import 'package:flutter/material.dart';
import 'package:lockpick_app/theme.dart';
import 'package:lockpick_app/widgets/difficulty_widget.dart';
import 'package:lockpick_app/widgets/game_widget.dart';

class WinnerDialog extends StatelessWidget {
  final String difficulty;
  final int score;
  final int seconds;
  final int moves;
  final int bits;
  final int amount;
  final int rerolls;
  final int rerollsUsed;
  const WinnerDialog(
      {super.key,
      required this.difficulty,
      required this.score,
      required this.seconds,
      required this.moves,
      required this.bits,
      required this.amount,
      required this.rerolls,
      required this.rerollsUsed});

  @override
  Widget build(BuildContext context) {
    return Dialog(
        alignment: Alignment.center,
        child: Column(children: [
          ListTile(
            title: Text(
              "You Won!",
              textAlign: TextAlign.center,
              style: darkTheme.textTheme.titleLarge,
            ),
            titleAlignment: ListTileTitleAlignment.center,
          ),
          ListTile(
            title: Text("Difficulty",
                style: Theme.of(context).textTheme.bodyLarge),
            trailing: Text(difficulty,
                style: Theme.of(context).textTheme.titleMedium),
            leading: const Icon(Icons.stars_rounded),
          ),
          ListTile(
            title: Text("Bits", style: Theme.of(context).textTheme.bodyLarge),
            leading: const Icon(Icons.pie_chart_rounded),
            trailing: Text(bits.toString(),
                style: Theme.of(context).textTheme.titleMedium),
          ),
          ListTile(
            title: Text("Total Score",
                style: Theme.of(context).textTheme.bodyLarge),
            leading: const Icon(Icons.leaderboard_rounded),
            trailing: Text(score.toString(),
                style: Theme.of(context).textTheme.titleMedium),
          ),
          ListTile(
            title: Text("Time Elapsed",
                style: Theme.of(context).textTheme.bodyLarge),
            leading: const Icon(Icons.timer_rounded),
            trailing: Text(
                "${seconds ~/ 60}:${(seconds % 60).toString().padLeft(2, '0')}",
                style: Theme.of(context).textTheme.titleMedium),
          ),
          ListTile(
            title:
                Text("Keys Used", style: Theme.of(context).textTheme.bodyLarge),
            leading: const Icon(Icons.key_rounded),
            trailing: Text(moves.toString()),
          ),
          ListTile(
            title: Text("Locks Opened",
                style: Theme.of(context).textTheme.bodyLarge),
            leading: const Icon(Icons.lock_open_outlined),
            trailing: Text(amount.toString(),
                style: Theme.of(context).textTheme.titleMedium),
          ),
          Spacer(),
          FilledButton(
              onPressed: () => onChangeDifficultyPressed(context),
              child: Text("Change Difficulty",
                  style: Theme.of(context).textTheme.titleSmall!.copyWith(
                      color: Theme.of(context).colorScheme.primaryContainer))),
          SizedBox(height: 16),
          FilledButton(
              onPressed: () => onPlayAgainPressed(context),
              child: Text("Play Again",
                  style: Theme.of(context).textTheme.titleSmall!.copyWith(
                      color: Theme.of(context).colorScheme.primaryContainer))),
          Spacer(),
        ]));
  }

  record() {
    //get device id

    
  }

  onPlayAgainPressed(BuildContext context) {
    record();
    Navigator.of(context).pop();
    Navigator.of(context).push(MaterialPageRoute(
        builder: (context) => GameWidget(
            difficulty: difficulty,
            bits: bits,
            amount: amount,
            rerolls: rerolls)));
  }

  onChangeDifficultyPressed(BuildContext context) {
    record();
    Navigator.of(context).pop();
    Navigator.of(context).pop();
    Navigator.of(context)
        .push(MaterialPageRoute(builder: (context) => DifficultyModal()));
  }
}
