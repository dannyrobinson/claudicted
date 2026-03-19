import { Button, Card, Input, Tag } from '../components/ui';
import favLogo from '../assets/Fav.svg';

const quickstarts = [
  {
    title: 'For TMCs',
    description:
      'Access resources for Travel Management Companies (TMCs) who are looking to offer Spotnana services.',
    icon: '🧭'
  },
  {
    title: 'For Technology Partners',
    description:
      'Build end-to-end workflows using Spotnana APIs and webhooks to empower business travel.',
    icon: '🧩'
  }
];

const workflows = [
  {
    title: 'Air workflows',
    items: ['Book a flight', 'Exchange an air booking', 'Cancel an air booking']
  },
  {
    title: 'Hotel workflows',
    items: ['Book a hotel room', 'Exchange a hotel booking', 'Cancel a hotel booking']
  }
];

const tools = [
  {
    title: 'API Reference',
    description: 'Explore endpoints, parameters, and response schemas for Spotnana APIs.'
  },
  {
    title: 'Webhooks',
    description: 'Subscribe to real-time notifications for booking updates.'
  },
  {
    title: 'Releases',
    description: 'Track breaking and non-breaking changes across APIs.'
  },
  {
    title: 'API Playground',
    description: 'Run API calls with saved auth and sample payloads.'
  }
];

const demos = [
  {
    title: 'Air booking sandbox',
    description: 'Run live-search and booking flows with test cards.',
    tag: 'Air'
  },
  {
    title: 'Hotel attach & payment',
    description: 'Exercise rate shopping, policy and folio capture.',
    tag: 'Hotel'
  },
  {
    title: 'Agent 2 Agent relay',
    description: 'Simulate inter-agent negotiations and shared PNR.',
    tag: 'A2A'
  },
  {
    title: 'Rides orchestration',
    description: 'Spin up ride booking, tracking, and receipt flow.',
    tag: 'Rides'
  }
];

const apiKeys = [
  {
    name: 'Prod • Web',
    created: 'Jan 12, 2026',
    scope: 'Air + Hotel',
    status: 'Active'
  },
  {
    name: 'Staging • Mobile',
    created: 'Dec 20, 2025',
    scope: 'All products',
    status: 'Rotating'
  }
];

const webhooks = [
  {
    event: 'booking.confirmed',
    url: 'https://api.acme.com/hooks/booking',
    status: 'Healthy'
  },
  {
    event: 'ticket.issued',
    url: 'https://api.acme.com/hooks/ticketing',
    status: 'Retrying'
  }
];

const logs = [
  {
    title: 'POST /v2/air/availability',
    time: '2 min ago',
    status: '200 OK'
  },
  {
    title: 'POST /v2/hotel/hold',
    time: '12 min ago',
    status: '202 Accepted'
  }
];

export default function DeveloperPortal() {
  return (
    <main className="min-h-screen bg-surface-subtle">
      <div className="border-b border-ink-200 bg-white/80">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={favLogo} alt="Spotnana" className="h-7 w-7" />
            </div>
            <nav className="hidden items-center gap-4 text-body3 text-ink-600 md:flex">
              <span className="text-ink-900 font-semibold">Knowledge Base</span>
              <span>API Reference</span>
              <span>Webhooks</span>
              <span>Releases</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input placeholder="Search with AI" className="h-9 w-52 pl-10 text-body3" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body3 text-ink-400">⌕</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 bg-white text-body3">
              🔔
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-body3 text-white">
              KA
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-6 pb-12 pt-6 lg:grid-cols-[220px_1fr_220px]">
        <aside className="hidden h-fit rounded-card border border-ink-200 bg-white p-4 text-body3 lg:block">
          <p className="text-body3 font-semibold text-ink-900">Introduction</p>
          <div className="mt-2 rounded-2xl bg-ink-100 px-3 py-2 text-ink-700">Spotnana Developer Portal</div>

          <div className="mt-4">
            <p className="text-body3 font-semibold text-ink-900">Quickstart hub</p>
            <ul className="mt-2 space-y-2 text-ink-600">
              <li>Common prerequisites</li>
              <li>Sandbox access</li>
              <li>Authentication</li>
              <li>For TMCs</li>
              <li>For Technology Partners</li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-body3 font-semibold text-ink-900">Useful resources</p>
            <ul className="mt-2 space-y-2 text-ink-600">
              <li>Idempotency</li>
              <li>Chained workflows</li>
              <li>Try it console</li>
              <li>Error handling</li>
            </ul>
          </div>
        </aside>

        <section className="space-y-10">
          <div className="rounded-card border border-ink-200 bg-white p-6">
            <p className="text-body3 text-ink-500">Last updated 1 week ago</p>
            <h1 className="mt-2 text-h2 font-semibold text-ink-900">Spotnana Developer Portal</h1>
            <p className="mt-2 text-body2 text-ink-600">
              The developer portal provides important documentation, API references, workflows, best practices, and
              changelogs to help you integrate with the Spotnana platform.
            </p>
          </div>

          <div>
            <h2 className="text-h3 font-semibold text-ink-900">Quickstart Hub</h2>
            <p className="mt-2 text-body2 text-ink-600">
              Get started with your Spotnana integration using the following resources.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {quickstarts.map((item) => (
                <Card key={item.title}>
                  <div className="flex items-center gap-3 text-body3 text-ink-500">
                    <span>{item.icon}</span>
                    <span>Quickstart</span>
                  </div>
                  <h3 className="mt-3 text-h5 font-semibold text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-body3 text-ink-500">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-h3 font-semibold text-ink-900">Workflows</h2>
            <p className="mt-2 text-body2 text-ink-600">
              Spotnana APIs are designed to support end-to-end workflows where the output from one API call is used in the
              request body of subsequent API calls.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {workflows.map((flow) => (
                <Card key={flow.title}>
                  <h3 className="text-h5 font-semibold text-ink-900">{flow.title}</h3>
                  <ul className="mt-3 space-y-2 text-body3 text-brand-600">
                    {flow.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-h3 font-semibold text-ink-900">Developer tools</h2>
            <p className="mt-2 text-body2 text-ink-600">
              Explore references, tooling, and release notes for your integration.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {tools.map((tool) => (
                <Card key={tool.title}>
                  <h3 className="text-h5 font-semibold text-ink-900">{tool.title}</h3>
                  <p className="mt-2 text-body3 text-ink-500">{tool.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-h3 font-semibold text-ink-900">Pre-canned demos</h2>
            <p className="mt-2 text-body2 text-ink-600">
              Try curated scenarios for Air, Hotel, Agent 2 Agent, and Rides.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {demos.map((demo) => (
                <Card key={demo.title} className="flex flex-col justify-between">
                  <div>
                    <Tag tone="brand">{demo.tag}</Tag>
                    <h3 className="mt-3 text-h4 font-semibold text-ink-900">{demo.title}</h3>
                    <p className="mt-2 text-body2 text-ink-600">{demo.description}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm">
                      Open in Cursor
                    </Button>
                    <Button variant="ghost" size="sm" className="text-brand-600">
                      Copy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-h4 font-semibold">API keys</h2>
                  <p className="text-body3 text-ink-500">Rotate keys regularly and scope them per product.</p>
                </div>
                <Button variant="secondary" size="sm">
                  Manage keys
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.name}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-ink-100/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-body2 font-semibold text-ink-900">{key.name}</p>
                      <p className="text-body3 text-ink-500">
                        Created {key.created} · {key.scope}
                      </p>
                    </div>
                    <Tag tone={key.status === 'Active' ? 'success' : 'warning'}>{key.status}</Tag>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-h4 font-semibold">Webhooks</h2>
                  <p className="text-body3 text-ink-500">Deliver booking and payment events to your stack.</p>
                </div>
                <Button variant="secondary" size="sm">
                  Configure
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {webhooks.map((hook) => (
                  <div
                    key={hook.event}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-body2 font-semibold text-ink-900">{hook.event}</p>
                      <p className="text-body3 text-ink-500">{hook.url}</p>
                    </div>
                    <Tag tone={hook.status === 'Healthy' ? 'success' : 'warning'}>{hook.status}</Tag>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-h4 font-semibold">Live logs</h2>
                <p className="text-body3 text-ink-500">Recent requests across all products.</p>
              </div>
              <Button variant="ghost" size="sm">
                Open log explorer
              </Button>
            </div>
            <div className="mt-4 grid gap-3">
              {logs.map((log) => (
                <div key={log.title} className="rounded-2xl border border-ink-200 bg-ink-100/70 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-body2 font-semibold text-ink-900">{log.title}</p>
                    <Tag tone={log.status.includes('500') ? 'warning' : 'success'}>{log.status}</Tag>
                  </div>
                  <p className="text-body3 text-ink-500">{log.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="hidden h-fit rounded-card border border-ink-200 bg-white p-4 text-body3 lg:block">
          <p className="text-body3 font-semibold text-ink-900">On this page</p>
          <ul className="mt-3 space-y-2 text-ink-600">
            <li>Quickstart Hub</li>
            <li>Workflows</li>
            <li>Developer tools</li>
            <li>Pre-canned demos</li>
            <li>API keys</li>
            <li>Webhooks</li>
            <li>Live logs</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
