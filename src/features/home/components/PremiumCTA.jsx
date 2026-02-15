import { Link } from 'react-router-dom';
import { GradientButton } from '../../../components/ui/GradientButton';
import { SectionContainer } from '../../../components/ui/SectionContainer';

export function PremiumCTA() {
  return (
    <SectionContainer className="py-20">
      <section className="noise-bg relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-black via-[#18120d] to-black px-6 py-16 text-center md:px-12">
        <h3 className="text-3xl font-semibold text-[#EDEDED] md:text-5xl">Own Leather That Lasts Years.</h3>
        <p className="mx-auto mt-4 max-w-2xl text-stone-300">Join the Leathric movement and invest in products made to evolve with your story.</p>
        <div className="mt-8">
          <Link to="/products">
            <GradientButton>Shop Now</GradientButton>
          </Link>
        </div>
      </section>
    </SectionContainer>
  );
}
