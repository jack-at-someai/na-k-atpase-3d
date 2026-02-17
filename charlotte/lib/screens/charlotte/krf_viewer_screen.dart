import 'package:flutter/material.dart';
import '../../theme.dart';
import '../../services/content_service.dart';
import '../../widgets/krf_syntax_highlighter.dart';

class KrfViewerScreen extends StatefulWidget {
  final String filename;

  const KrfViewerScreen({super.key, required this.filename});

  @override
  State<KrfViewerScreen> createState() => _KrfViewerScreenState();
}

class _KrfViewerScreenState extends State<KrfViewerScreen> {
  String? _content;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final content = await ContentService().loadKrf(widget.filename);
      if (mounted) setState(() { _content = content; _loading = false; });
    } catch (e) {
      if (mounted) setState(() { _content = ';;; File not found: ${widget.filename}'; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    final layer = ContentService.layerForFile(widget.filename);
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.filename, style: TextStyle(fontSize: 16, color: config.textPrimary)),
            Text(layer, style: TextStyle(fontSize: 11, color: config.textTertiary)),
          ],
        ),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: _loading
          ? Center(child: CircularProgressIndicator(color: config.primary.base))
          : KrfCodeBlock(code: _content ?? ''),
    );
  }
}
