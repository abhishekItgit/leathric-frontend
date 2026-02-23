import { Link } from 'react-router-dom';
import { GradientButton } from '../../../components/ui/GradientButton';
import { SectionContainer } from '../../../components/ui/SectionContainer';

export function PremiumCTA() {
  return (
    <SectionContainer className="py-20">
      <section className="noise-bg relative overflow-hidden rounded-[2rem] border border-leather-700/20 bg-gradient-to-r from-leather-950 via-leather-900 to-leather-950 px-6 py-16 text-center md:px-12">
        <h3 className="text-3xl font-semibold text-leather-cream md:text-5xl">Own Leather That Lasts Years.</h3>
        <p className="mx-auto mt-4 max-w-2xl text-leather-neutral">Join the WalkEra movement and invest in products made to evolve with your story.</p>
        <div className="mt-8">
          <Link to="/products">
            <GradientButton>Shop Now</GradientButton>
          </Link>
        </div>
      </section>
    </SectionContainer>
  );
}
