export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm text-stone-300 md:grid-cols-3 md:px-6">
        <div>
          <h4 className="text-lg font-bold text-leather-accent">Leathric</h4>
          <p className="mt-2">Crafted leather essentials for modern lifestyles.</p>
        </div>
        <div>
          <h5 className="font-semibold text-stone-100">Support</h5>
          <ul className="mt-3 space-y-2">
            <li>Shipping & Returns</li>
            <li>Warranty</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-stone-100">Stay in touch</h5>
          <p className="mt-2">support@leathric.com</p>
        </div>
      </div>
    </footer>
  );
}
