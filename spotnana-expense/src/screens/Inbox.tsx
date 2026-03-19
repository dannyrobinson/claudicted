import { Button, Card, Input, Tag } from '../components/ui';

export default function Inbox() {
  return (
    <main className="min-h-screen">
      <div className="container-mobile">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-body3 uppercase tracking-[0.2em] text-ink-500">Spotnana</p>
            <h1 className="text-h2 font-semibold text-ink-900">Expense Inbox</h1>
            <p className="mt-1 text-body2 text-ink-600">
              Auto-captured receipts from email, cards, and messages.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white">
            SE
          </div>
        </header>

        <section className="mt-6 grid gap-3">
          <Card className="noise">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body3 text-ink-500">This week</p>
                <p className="text-display font-semibold">$1,248</p>
                <p className="text-body3 text-ink-500">23 receipts auto-matched</p>
              </div>
              <Tag tone="brand">On track</Tag>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-body3">
              <div className="rounded-2xl bg-ink-100 px-3 py-2">
                <p className="text-ink-900 font-semibold">$642</p>
                <p className="text-ink-500">Flights</p>
              </div>
              <div className="rounded-2xl bg-ink-100 px-3 py-2">
                <p className="text-ink-900 font-semibold">$381</p>
                <p className="text-ink-500">Hotels</p>
              </div>
              <div className="rounded-2xl bg-ink-100 px-3 py-2">
                <p className="text-ink-900 font-semibold">$225</p>
                <p className="text-ink-500">Meals</p>
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body3 text-ink-500">New receipts</p>
                <p className="text-h3 font-semibold">4 need review</p>
              </div>
              <Button size="sm">Review now</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag tone="warning">Policy check</Tag>
              <Tag tone="success">Auto-tagged</Tag>
              <Tag tone="neutral">Duplicate found</Tag>
            </div>
          </Card>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 font-semibold">Recent captures</h2>
            <button className="text-body3 text-brand-600 font-semibold">View all</button>
          </div>
          <div className="mt-3 grid gap-3">
            {[
              {
                vendor: 'Hilton Downtown',
                amount: '$289.40',
                date: 'Feb 3 · Card ending 4481',
                status: 'Matched'
              },
              {
                vendor: 'Uber',
                amount: '$42.18',
                date: 'Feb 3 · SMS receipt',
                status: 'Needs category'
              },
              {
                vendor: 'Blue Bottle',
                amount: '$8.60',
                date: 'Feb 2 · Email receipt',
                status: 'Ready to submit'
              }
            ].map((item) => (
              <Card key={item.vendor} className="flex items-center justify-between">
                <div>
                  <p className="text-body1 font-semibold text-ink-900">{item.vendor}</p>
                  <p className="text-body3 text-ink-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-body1 font-semibold">{item.amount}</p>
                  <p className="text-body3 text-ink-500">{item.status}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-h4 font-semibold">Quick add</h2>
          <div className="mt-3 grid gap-3">
            <Input placeholder="Search by vendor or location" />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary">Upload receipt</Button>
              <Button variant="primary">New expense</Button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-card bg-ink-900 p-5 text-white">
          <h3 className="text-h4 font-semibold">Auto-matching confidence</h3>
          <p className="mt-1 text-body2 text-ink-200">
            We matched 19 of 23 receipts this week. Keep forwarding to receipts@spotnana.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
              Connect sources
            </Button>
            <span className="text-body3 text-ink-200">92% accuracy</span>
          </div>
        </section>
      </div>
    </main>
  );
}
