# @pipeworx/wikimedia-rest

[Wikimedia REST API v1](https://en.wikipedia.org/api/rest_v1/) MCP — keyless access to Wikipedia/Wikimedia content endpoints (different surface from the `wikipedia` action API).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `page_summary(title, project?, lang?)` — page summary card (description, extract, thumbnail) — same shape as the "did you mean" card
- `page_html(title, project?, lang?)` — page HTML (Parsoid output)
- `page_metadata(title, project?, lang?)` — page metadata
- `page_references(title, project?, lang?)` — references on a page
- `page_media(title, project?, lang?)` — images + videos on a page
- `page_related(title, project?, lang?)` — related pages
- `page_revisions(title, project?, lang?)` — recent revisions
- `page_pdf(title, project?, lang?)` — _returns URL only_ (the PDF endpoint streams binary)
- `featured(year, month, day, project?, lang?)` — daily featured content (TFA, MP image, news, on-this-day, most-read)
- `onthisday(type, month, day, project?, lang?)` — on-this-day events (`all|births|deaths|events|holidays|selected`)
- `random(project?, lang?)` — random page summary

`project` defaults to `wikipedia`, `lang` to `en`. Other projects: `wikinews`, `wikiquote`, `wiktionary`, `wikivoyage`, `wikibooks`, `wikiversity`, `wikisource`.

## Data source

`https://<lang>.<project>.org/api/rest_v1`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "wikimedia-rest": {
      "url": "https://gateway.pipeworx.io/wikimedia-rest/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Wikimedia Rest data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
