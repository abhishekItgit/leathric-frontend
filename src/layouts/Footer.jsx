import { Link } from 'react-router-dom';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M6.94 8.5a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88Zm-1.2 10.5h2.4V10h-2.4v9Zm6.14 0h2.4v-4.4c0-1.16.2-2.28 1.64-2.28 1.42 0 1.44 1.32 1.44 2.36V19h2.4v-4.8c0-2.36-.5-4.2-3.26-4.2-1.32 0-2.2.72-2.56 1.4h-.04V10h-2.3v9Z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M22 12c0 2.74-.32 4.44-.58 5.24a2.92 2.92 0 0 1-2.06 2.06C18.56 19.58 16.86 20 12 20s-6.56-.42-7.36-.7a2.92 2.92 0 0 1-2.06-2.06C2.32 16.44 2 14.74 2 12s.32-4.44.58-5.24A2.92 2.92 0 0 1 4.64 4.7C5.44 4.42 7.14 4 12 4s6.56.42 7.36.7a2.92 2.92 0 0 1 2.06 2.06c.26.8.58 2.5.58 5.24ZM10 9.75v4.5L15 12l-5-2.25Z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-sm text-stone-300 sm:grid-cols-2 lg:grid-cols-4 md:px-6">
        <div>
          <h4 className="text-lg font-bold uppercase tracking-[0.15em] text-leather-accent">Leathric</h4>
          <p className="mt-3 max-w-xs leading-relaxed">Authentic leather craftsmanship designed in India.</p>
          <Link to="/our-story" className="mt-4 inline-block text-sm text-stone-200 transition-colors hover:text-leather-accent">
            Our Story
          </Link>
        </div>

        <div>
          <h5 className="font-semibold text-stone-100">Support</h5>
          <ul className="mt-4 space-y-2">
            {[
              ['Shipping & Returns', '/shipping'],
              ['Warranty', '/warranty'],
              ['Contact', '/contact'],
              ['Privacy Policy', '/privacy-policy'],
              ['Terms & Conditions', '/terms'],
            ].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="group inline-flex items-center gap-2 transition-colors hover:text-leather-accent">
                  <span className="h-px w-0 bg-leather-accent transition-all duration-300 group-hover:w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-stone-100">Contact Info</h5>
          <div className="mt-4 space-y-2 leading-relaxed">
            <p>
              <span className="text-stone-400">Phone:</span> 7068834066
            </p>
            <p>
              <span className="text-stone-400">Email:</span> mrabhishekdwivediit@gmail.com
            </p>
            <p className="text-stone-400">Registered Address:</p>
            <p>
              Jajmau, Kanpur
              <br />
              Uttar Pradesh
              <br />
              India
              <br />
              Pincode: 208010
            </p>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-stone-100">Social</h5>
          <ul className="mt-4 space-y-3">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-leather-accent"
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
