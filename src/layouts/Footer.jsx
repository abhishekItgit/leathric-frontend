import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import leathricHorseLogo from '../assets/leathric-horse-logo.svg';

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'LinkedIn', href: 'https://linkedin.com' },
  { name: 'YouTube', href: 'https://youtube.com' },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-14 border-t border-leather-700/20 bg-[#f3efe8]"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-sm text-leather-900 sm:grid-cols-2 lg:grid-cols-4 md:px-6">
        <div>
          <img src={leathricHorseLogo} alt="Leathric horse logo" className="h-11 w-auto" loading="lazy" />
          <p className="mt-3 max-w-xs leading-relaxed">WalkEra · Step Into the New Era. Premium leather craftsmanship designed in India.</p>
        </div>

        <div>
          <h5 className="font-semibold uppercase tracking-[0.12em] text-leather-950">Support</h5>
          <ul className="mt-4 space-y-2">
            {[
              ['Shipping & Returns', '/shipping'],
              ['Warranty', '/warranty'],
              ['Contact', '/contact'],
              ['Privacy Policy', '/privacy-policy'],
              ['Terms & Conditions', '/terms'],
            ].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="transition hover:text-leather-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold uppercase tracking-[0.12em] text-leather-950">Contact</h5>
          <div className="mt-4 space-y-2">
            <p>Phone: 7068834066</p>
            <p>Email: mrabhishekdwivediit@gmail.com</p>
            <p>Kanpur, Uttar Pradesh, India · 208010</p>
          </div>
        </div>

        <div>
          <h5 className="font-semibold uppercase tracking-[0.12em] text-leather-950">Social</h5>
          <ul className="mt-4 space-y-2">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a href={social.href} target="_blank" rel="noreferrer" className="transition hover:text-leather-accent">
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.footer>
  );
}
