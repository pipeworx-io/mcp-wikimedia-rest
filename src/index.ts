interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Wikimedia REST API v1 MCP.
 */


const UA = 'pipeworx-mcp-wikimedia-rest/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'page_summary', description: 'Page summary card.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  { name: 'page_html', description: 'Page HTML (Parsoid output).', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  { name: 'page_metadata', description: 'Page metadata.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  { name: 'page_references', description: 'References.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  { name: 'page_media', description: 'Images + videos.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  { name: 'page_related', description: 'Related pages.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  { name: 'page_revisions', description: 'Recent revisions.', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  { name: 'page_pdf', description: 'PDF URL (binary endpoint, returns URL only).', inputSchema: { type: 'object', properties: { title: { type: 'string' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['title'] } },
  {
    name: 'featured',
    description: 'Daily featured content.',
    inputSchema: { type: 'object', properties: { year: { type: 'number' }, month: { type: 'number' }, day: { type: 'number' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['year', 'month', 'day'] },
  },
  {
    name: 'onthisday',
    description: 'On-this-day events.',
    inputSchema: { type: 'object', properties: { type: { type: 'string' }, month: { type: 'number' }, day: { type: 'number' }, project: { type: 'string' }, lang: { type: 'string' } }, required: ['type', 'month', 'day'] },
  },
  { name: 'random', description: 'Random page summary.', inputSchema: { type: 'object', properties: { project: { type: 'string' }, lang: { type: 'string' } } } },
];

function host(project: string | undefined, lang: string | undefined): string {
  const proj = project || 'wikipedia';
  const language = lang || 'en';
  return `https://${language}.${proj}.org/api/rest_v1`;
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  const get = async (url: string, accept = 'application/json') => {
    const res = await fetch(url, { headers: { Accept: accept, 'User-Agent': UA } });
    if (res.status === 404) throw new Error('Wikimedia: 404 — page not found.');
    if (!res.ok) throw new Error(`Wikimedia: ${res.status}`);
    return accept.includes('html') ? { html: await res.text() } : res.json();
  };
  const base = host(args.project as string | undefined, args.lang as string | undefined);
  const title = (k = 'title') => encodeURIComponent(reqStr(k, '"Earth"'));
  const pad2 = (n: number) => String(n).padStart(2, '0');
  switch (name) {
    case 'page_summary':
      return get(`${base}/page/summary/${title()}`);
    case 'page_html':
      return get(`${base}/page/html/${title()}`, 'text/html');
    case 'page_metadata':
      return get(`${base}/page/metadata/${title()}`);
    case 'page_references':
      return get(`${base}/page/references/${title()}`);
    case 'page_media':
      return get(`${base}/page/media-list/${title()}`);
    case 'page_related':
      return get(`${base}/page/related/${title()}`);
    case 'page_revisions':
      return get(`${base}/page/history/${title()}`);
    case 'page_pdf':
      return { url: `${base}/page/pdf/${title()}`, note: 'PDF binary; fetch via browser or curl.' };
    case 'featured': {
      const y = reqNum('year', '2026');
      const m = pad2(reqNum('month', '5'));
      const d = pad2(reqNum('day', '21'));
      return get(`${base}/feed/featured/${y}/${m}/${d}`);
    }
    case 'onthisday': {
      const t = reqStr('type', '"all"');
      const m = pad2(reqNum('month', '5'));
      const d = pad2(reqNum('day', '21'));
      return get(`${base}/feed/onthisday/${encodeURIComponent(t)}/${m}/${d}`);
    }
    case 'random':
      return get(`${base}/page/random/summary`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
