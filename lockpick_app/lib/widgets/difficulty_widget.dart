import 'package:flutter/material.dart';
import 'package:lockpick_app/theme.dart';
import 'package:lockpick_app/widgets/game_widget.dart';

class DifficultyModal extends StatelessWidget {
  const DifficultyModal({super.key});
  @override
  Widget build(BuildContext context) {
    return BottomSheet(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      onClosing: () => onClosing(context),
      builder: (context) {
        return BottomSheet(
          builder: (context) => SafeArea(
              minimum: EdgeInsets.all(16),
              child: Center(
                  child: SizedBox(
                      height: 400,
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            ListTile(
                                title: Text("Choose a Difficulty",
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleLarge)),
                            DifficultyModalButton(
                                label: 'Novice', bits: 6, amount: 5),
                            SizedBox(height: 16),
                            DifficultyModalButton(
                                label: 'Intermediate', bits: 8, amount: 10),
                            SizedBox(height: 16),
                            DifficultyModalButton(
                                label: 'Advanced', bits: 12, amount: 20),
                            SizedBox(height: 16),
                            DifficultyModalButton(
                                label: 'Expert', bits: 16, amount: 20),
                            SizedBox(height: 16),
                            DifficultyModalButton(
                                label: 'Master', bits: 24, amount: 20),
                          ])))),
          onClosing: () {},
        );
      },
    );
  }

  onClosing(BuildContext context) {}
}

class DifficultyModalButton extends StatelessWidget {
  final String label;
  final int bits;
  final int amount;
  const DifficultyModalButton(
      {super.key,
      required this.label,
      required this.bits,
      required this.amount});

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: FilledButton(
      onPressed: () {
        Navigator.pop(context);
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => GameWidget(
                      bits: bits,
                      amount: amount,
                      rerolls: 3,
                      difficulty: label,
                    )));
      },
      child: Text(label,
          style: darkTheme.textTheme.titleLarge!
              .copyWith(color: Theme.of(context).colorScheme.primaryContainer)),
    ));
  }
}
