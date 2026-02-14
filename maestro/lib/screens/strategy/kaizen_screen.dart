import 'package:charlotte_ui/charlotte_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/kaizen_board.dart';
import '../../providers/kaizen_provider.dart';
import '../../theme/maestro_colors.dart';

class KaizenScreen extends ConsumerWidget {
  final String strategyId;

  const KaizenScreen({super.key, required this.strategyId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final board = ref.watch(kaizenProvider(strategyId));
    final notifier = ref.read(kaizenProvider(strategyId).notifier);

    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth > 900 ? 4 : 2;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    'KAIZEN BOARD',
                    style: TextStyle(
                      color: MaestroColors.accent,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const Spacer(),
                  GlassOutlinedButton(
                    onPressed: () => _addItem(context, notifier),
                    label: 'Add',
                    leadingIcon: Icons.add,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: KaizenColumn.values.map((col) {
                  final items = board.byColumn(col);
                  final colWidth = (constraints.maxWidth -
                          16 * 2 -
                          10 * (columns - 1)) /
                      columns;
                  return SizedBox(
                    width: colWidth.clamp(200, 500),
                    child: _KaizenColumnWidget(
                      column: col,
                      items: items,
                      onMoveForward: (id) => notifier.moveForward(id),
                      onMoveBack: (id) => notifier.moveBack(id),
                      onDelete: (id) => notifier.deleteItem(id),
                      onAcceptDrop: (id) => notifier.moveItem(id, col),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        );
      },
    );
  }

  void _addItem(BuildContext context, KaizenNotifier notifier) {
    final titleController = TextEditingController();
    final ownerController = TextEditingController();
    var selectedType = KaizenType.point;

    GlassBottomSheet.show(
      context,
      title: 'New Kaizen Item',
      child: StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              GlassTextField(
                controller: titleController,
                autofocus: true,
                hintText: 'Improvement title',
              ),
              const SizedBox(height: 8),
              GlassTextField(
                controller: ownerController,
                hintText: 'Owner',
              ),
              const SizedBox(height: 8),
              GlassSegmented<KaizenType>(
                segments: KaizenType.values
                    .map((t) => GlassSegment(
                          label:
                              t.name[0].toUpperCase() + t.name.substring(1),
                        ))
                    .toList(),
                values: KaizenType.values,
                selected: selectedType,
                onSelected: (v) =>
                    setSheetState(() => selectedType = v),
                selectedColor: MaestroColors.accent,
              ),
              const SizedBox(height: 16),
              GlassFilledButton(
                onPressed: () {
                  if (titleController.text.isNotEmpty) {
                    notifier.addItem(
                      title: titleController.text,
                      type: selectedType,
                      owner: ownerController.text,
                    );
                  }
                  Navigator.pop(ctx);
                },
                label: 'Add',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _KaizenColumnWidget extends StatelessWidget {
  final KaizenColumn column;
  final List<KaizenItem> items;
  final ValueChanged<String> onMoveForward;
  final ValueChanged<String> onMoveBack;
  final ValueChanged<String> onDelete;
  final ValueChanged<String> onAcceptDrop;

  const _KaizenColumnWidget({
    required this.column,
    required this.items,
    required this.onMoveForward,
    required this.onMoveBack,
    required this.onDelete,
    required this.onAcceptDrop,
  });

  Color get _headerColor => switch (column) {
        KaizenColumn.ideas => MaestroColors.kaizenIdeas,
        KaizenColumn.planned => MaestroColors.kaizenPlanned,
        KaizenColumn.doing => MaestroColors.kaizenDoing,
        KaizenColumn.done => MaestroColors.kaizenDone,
      };

  String get _title => switch (column) {
        KaizenColumn.ideas => 'IDEAS',
        KaizenColumn.planned => 'PLANNED',
        KaizenColumn.doing => 'IN PROGRESS',
        KaizenColumn.done => 'DONE',
      };

  @override
  Widget build(BuildContext context) {
    return DragTarget<String>(
      onAcceptWithDetails: (details) => onAcceptDrop(details.data),
      builder: (context, candidateData, rejectedData) {
        return GlassContainer(
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                _title,
                style: TextStyle(
                  color: _headerColor,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 8),
              if (items.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    'Drop items here',
                    style: TextStyle(
                        color: MaestroColors.muted, fontSize: 11),
                    textAlign: TextAlign.center,
                  ),
                ),
              ...items.map((item) => Draggable<String>(
                    data: item.id,
                    feedback: Material(
                      color: Colors.transparent,
                      child: SizedBox(
                        width: 200,
                        child: _KaizenCard(
                          item: item,
                          headerColor: _headerColor,
                          onMoveForward: null,
                          onMoveBack: null,
                          onDelete: null,
                        ),
                      ),
                    ),
                    childWhenDragging: Opacity(
                      opacity: 0.3,
                      child: _KaizenCard(
                        item: item,
                        headerColor: _headerColor,
                        onMoveForward: null,
                        onMoveBack: null,
                        onDelete: null,
                      ),
                    ),
                    child: _KaizenCard(
                      item: item,
                      headerColor: _headerColor,
                      onMoveForward: column != KaizenColumn.done
                          ? () => onMoveForward(item.id)
                          : null,
                      onMoveBack: column != KaizenColumn.ideas
                          ? () => onMoveBack(item.id)
                          : null,
                      onDelete: () => onDelete(item.id),
                    ),
                  )),
            ],
          ),
        );
      },
    );
  }
}

class _KaizenCard extends StatelessWidget {
  final KaizenItem item;
  final Color headerColor;
  final VoidCallback? onMoveForward;
  final VoidCallback? onMoveBack;
  final VoidCallback? onDelete;

  const _KaizenCard({
    required this.item,
    required this.headerColor,
    required this.onMoveForward,
    required this.onMoveBack,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: GlassContainer(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item.title,
              style: TextStyle(
                color: MaestroColors.text,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${item.typeLabel} Kaizen  ·  ${item.owner}',
              style: TextStyle(color: MaestroColors.muted, fontSize: 10),
            ),
            if (onMoveBack != null ||
                onMoveForward != null ||
                onDelete != null)
              Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (onMoveBack != null)
                      GlassIconButton(
                        icon: Icons.chevron_left,
                        onPressed: onMoveBack,
                        size: 28,
                        iconSize: 16,
                        tooltip: 'Move back',
                      ),
                    if (onMoveForward != null)
                      GlassIconButton(
                        icon: Icons.chevron_right,
                        onPressed: onMoveForward,
                        size: 28,
                        iconSize: 16,
                        tooltip: 'Move forward',
                      ),
                    const Spacer(),
                    if (onDelete != null)
                      GlassIconButton(
                        icon: Icons.close,
                        onPressed: onDelete,
                        size: 28,
                        iconSize: 16,
                        tooltip: 'Delete',
                      ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
