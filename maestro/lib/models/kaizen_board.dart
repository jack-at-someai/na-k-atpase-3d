/// Kaizen Board — continuous improvement tracking (Kanban-style).

enum KaizenColumn { ideas, planned, doing, done }

enum KaizenType { point, line, plane, system, cube }

class KaizenBoard {
  final List<KaizenItem> items;

  const KaizenBoard({this.items = const []});

  KaizenBoard copyWith({List<KaizenItem>? items}) =>
      KaizenBoard(items: items ?? this.items);

  List<KaizenItem> byColumn(KaizenColumn col) =>
      items.where((i) => i.column == col).toList();

  Map<String, dynamic> toJson() => {
        'items': items.map((i) => i.toJson()).toList(),
      };

  factory KaizenBoard.fromJson(Map<String, dynamic> json) => KaizenBoard(
        items: (json['items'] as List?)
                ?.map((i) => KaizenItem.fromJson(i as Map<String, dynamic>))
                .toList() ??
            [],
      );

  factory KaizenBoard.sample() => KaizenBoard(items: [
        KaizenItem(
          id: '1',
          title: '5S audit for assembly area',
          type: KaizenType.point,
          owner: 'Team A',
          column: KaizenColumn.done,
        ),
        KaizenItem(
          id: '2',
          title: 'Reduce WIP between stations 4-5',
          type: KaizenType.line,
          owner: 'Team B',
          column: KaizenColumn.doing,
        ),
        KaizenItem(
          id: '3',
          title: 'Cross-train welding & assembly',
          type: KaizenType.plane,
          owner: 'HR',
          column: KaizenColumn.planned,
        ),
        KaizenItem(
          id: '4',
          title: 'Implement pull system for raw materials',
          type: KaizenType.system,
          owner: 'Supply Chain',
          column: KaizenColumn.ideas,
        ),
        KaizenItem(
          id: '5',
          title: 'Digital twin for preventive maintenance',
          type: KaizenType.cube,
          owner: 'Engineering',
          column: KaizenColumn.ideas,
        ),
      ]);
}

class KaizenItem {
  final String id;
  final String title;
  final KaizenType type;
  final String owner;
  final KaizenColumn column;

  const KaizenItem({
    required this.id,
    required this.title,
    required this.type,
    required this.owner,
    required this.column,
  });

  KaizenItem copyWith({
    String? id,
    String? title,
    KaizenType? type,
    String? owner,
    KaizenColumn? column,
  }) =>
      KaizenItem(
        id: id ?? this.id,
        title: title ?? this.title,
        type: type ?? this.type,
        owner: owner ?? this.owner,
        column: column ?? this.column,
      );

  /// Label for the kaizen type.
  String get typeLabel => switch (type) {
        KaizenType.point => 'Point',
        KaizenType.line => 'Line',
        KaizenType.plane => 'Plane',
        KaizenType.system => 'System',
        KaizenType.cube => 'Cube',
      };

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'type': type.name,
        'owner': owner,
        'column': column.name,
      };

  factory KaizenItem.fromJson(Map<String, dynamic> json) => KaizenItem(
        id: json['id'] as String? ?? '',
        title: json['title'] as String? ?? '',
        type: KaizenType.values.firstWhere(
          (t) => t.name == json['type'],
          orElse: () => KaizenType.point,
        ),
        owner: json['owner'] as String? ?? '',
        column: KaizenColumn.values.firstWhere(
          (c) => c.name == json['column'],
          orElse: () => KaizenColumn.ideas,
        ),
      );
}
