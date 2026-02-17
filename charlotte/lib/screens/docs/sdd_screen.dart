import 'package:flutter/material.dart';
import '../../theme.dart';
import '../../services/content_service.dart';
import '../../widgets/markdown_renderer.dart' show GlassMarkdownRenderer;

class SddScreen extends StatefulWidget {
  const SddScreen({super.key});

  @override
  State<SddScreen> createState() => _SddScreenState();
}

class _SddScreenState extends State<SddScreen> {
  String? _content;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final content = await ContentService().loadMarkdown('SDD.md');
    if (mounted) setState(() { _content = content; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    final config = CharlotteTheme.of(context).config;
    return Scaffold(
      backgroundColor: config.background,
      appBar: AppBar(
        title: Text('SDD', style: TextStyle(color: config.textPrimary)),
        backgroundColor: config.surface,
        iconTheme: IconThemeData(color: config.textPrimary),
      ),
      body: _loading
          ? Center(child: CircularProgressIndicator(color: config.primary.base))
          : GlassMarkdownRenderer(markdown: _content ?? ''),
    );
  }
}
