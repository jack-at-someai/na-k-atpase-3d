# Canva

Repository for all files generated programmatically from Canva via the Claude Code + Canva MCP integration.

## How It Works

Claude Code connects to Canva through a **Model Context Protocol (MCP) server** bundled with Claude Max. No API keys or local setup needed -- the integration lives in your Claude account and is available in any Claude Code session.

### Setup

1. Connect your Canva account to Claude Max at [claude.ai](https://claude.ai) under Settings > Integrations
2. Open Claude Code -- the Canva MCP tools are automatically available
3. Start asking Claude to generate, edit, or export designs

### Capabilities

**Generate designs from a text prompt:**
- Presentations (with interactive outline review)
- Documents, proposals, reports
- Social media posts (Instagram, Facebook, Twitter/X, Pinterest, YouTube)
- Print (posters, flyers, business cards, postcards, invitations, resumes)
- Visual (logos, infographics, photo collages, wallpapers)

**Edit existing designs:**
- Replace text on any slide or page
- Swap or insert images and videos
- Delete elements
- Update design titles

**Organize and manage:**
- Search designs by keyword
- Browse, create, and move folders
- List and apply brand kits
- Read and reply to comments

**Export designs locally:**
- Formats: PDF, PNG, JPG, GIF, PPTX, MP4
- Exported files are saved to this repo under the appropriate folder

**Upload assets:**
- Push images and videos from any URL into your Canva asset library

### Example Prompts

```
Generate a 10-slide pitch deck about renewable energy
```

```
Create an Instagram post for a coffee shop grand opening, dark moody aesthetic
```

```
Export my latest presentation as PPTX and save it here
```

```
Apply my brand kit to a new poster design
```

### Design System Integration

You can reference local brand assets (colors, typography, illustrations) and Claude will incorporate them into generated designs. See `charlotte/assets/` for an example with the Sounder brand system.

## Repo Structure

```
canva/
  README.md        # this file
  exports/         # exported design files (PDF, PPTX, PNG, etc.)
```
