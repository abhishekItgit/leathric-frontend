import { Link } from 'react-router-dom';
import { Button } from '../../../components/Button';

export function Hero() {
  return (
    <section className="grid gap-8 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,#3a3027_0%,#13110f_48%,#090909_100%)] p-8 md:grid-cols-2 md:items-center md:p-12">
      <div className="space-y-6 animate-fadeInUp">
        <p className="text-sm uppercase tracking-[0.2em] text-leather-accent">Leathric Atelier</p>
        <h1 className="text-4xl font-extrabold leading-tight text-stone-100 md:text-6xl">Handcrafted Leather Essentials</h1>
        <p className="max-w-xl text-lg text-stone-300">
          Premium wallets, boots, belts and bags made for a lifetime.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products">
            <Button className="bg-leather-accent text-black hover:bg-[#d7ad7e]">Shop Collection</Button>
          </Link>
          <Link to="/our-story">
            <Button variant="outline" className="border-leather-accent/60 text-leather-accent hover:bg-leather-accent/10">
              Our Craftsmanship
            </Button>
          </Link>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-3xl shadow-premium animate-fadeInUp">
        <img
          className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="https://images.unsplash.com/photo-1548032885-b5e38734688a?auto=format&fit=crop&w=1400&q=80"
          alt="Premium leather wallets, boots, belts and bags"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
    </section>
  );
}
