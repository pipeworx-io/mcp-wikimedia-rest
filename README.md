# @pipeworx/wikimedia-rest

[Wikimedia REST API v1](https://en.wikipedia.org/api/rest_v1/) MCP — keyless access to Wikipedia/Wikimedia content endpoints (different surface from the `wikipedia` action API).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1679+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/wikimedia-rest/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1679+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/page_summary \
  -H 'Content-Type: application/json' \
  -d '{"title":"Albert Einstein"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/page_summary`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "wikimedia-rest": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-wikimedia-rest"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-wikimedia-rest
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Wikimedia Rest data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
