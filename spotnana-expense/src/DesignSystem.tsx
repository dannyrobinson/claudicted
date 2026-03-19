import { Button, Card, Input, Tag } from './components/ui';

const colors = [
  { name: 'Ink 900', value: 'var(--ink-900)' },
  { name: 'Ink 600', value: 'var(--ink-600)' },
  { name: 'Ink 300', value: 'var(--ink-300)' },
  { name: 'Brand 500', value: 'var(--brand-500)' },
  { name: 'Brand 100', value: 'var(--brand-100)' },
  { name: 'Success', value: 'var(--success-500)' },
  { name: 'Warning', value: 'var(--warning-500)' },
  { name: 'Danger', value: 'var(--danger-500)' }
];

export default function DesignSystem() {
  return (
    <main className="min-h-screen">
      <div className="container-mobile">
        <header>
          <p className="text-body3 uppercase tracking-[0.2em] text-ink-500">Spotnana</p>
          <h1 className="text-h1 font-semibold">Design System</h1>
          <p className="text-body2 text-ink-600">
            Components and styles for the mobile expense experience.
          </p>
        </header>

        <section className="mt-6">
          <h2 className="text-h4 font-semibold">Typography</h2>
          <div className="mt-3 grid gap-3">
            <Card>
              <p className="text-display font-semibold">Display 48</p>
              <p className="text-body3 text-ink-500">Inter · 40/48 · Semibold</p>
            </Card>
            <Card>
              <p className="text-h1 font-semibold">Heading 1</p>
              <p className="text-body3 text-ink-500">32/40 · Semibold</p>
            </Card>
            <Card>
              <p className="text-h2 font-semibold">Heading 2</p>
              <p className="text-body3 text-ink-500">28/36 · Medium</p>
            </Card>
            <Card>
              <p className="text-h3 font-semibold">Heading 3</p>
              <p className="text-body3 text-ink-500">24/32 · Medium</p>
            </Card>
            <Card>
              <p className="text-h4 font-semibold">Heading 4</p>
              <p className="text-body3 text-ink-500">20/28 · Medium</p>
            </Card>
            <Card>
              <p className="text-h5 font-semibold">Heading 5</p>
              <p className="text-body3 text-ink-500">18/24 · Medium</p>
            </Card>
            <Card>
              <p className="text-body1">Body 1 — Build tight, scannable expense entries.</p>
              <p className="text-body3 text-ink-500">16/24 · Regular</p>
            </Card>
            <Card>
              <p className="text-body2">Body 2 — Notes, labels, and summaries.</p>
              <p className="text-body3 text-ink-500">14/20 · Regular</p>
            </Card>
            <Card>
              <p className="text-body3">Body 3 — Metadata and helper text.</p>
              <p className="text-body3 text-ink-500">12/16 · Regular</p>
            </Card>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-h4 font-semibold">Buttons</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-h4 font-semibold">Inputs</h2>
          <div className="mt-3 grid gap-2">
            <Input placeholder="Search receipts" />
            <Input placeholder="Add a note" className="bg-ink-100" />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-h4 font-semibold">Tags</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Tag tone="brand">Brand</Tag>
            <Tag tone="success">Approved</Tag>
            <Tag tone="warning">Policy check</Tag>
            <Tag tone="neutral">Neutral</Tag>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-h4 font-semibold">Color tokens</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {colors.map((color) => (
              <Card key={color.name}>
                <div className="h-12 rounded-2xl" style={{ background: color.value }} />
                <p className="mt-2 text-body2 font-semibold">{color.name}</p>
                <p className="text-body3 text-ink-500">{color.value}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
