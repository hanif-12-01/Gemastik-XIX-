import React from 'react'
import { HeroSection } from '../../components/landing/HeroSection'
import { ProblemSection } from '../../components/landing/ProblemSection'
import { ProcessSection } from '../../components/landing/ProcessSection'
import { MitraValueSection } from '../../components/landing/MitraValueSection'
import { AdminValueSection } from '../../components/landing/AdminValueSection'
import { DppSection } from '../../components/landing/DppSection'
import { ImpactSection } from '../../components/landing/ImpactSection'
import { ProductPreviewSection } from '../../components/landing/ProductPreviewSection'
import { TeamSection } from '../../components/landing/TeamSection'

export const LandingPage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <ProblemSection />
      <ProcessSection />
      <MitraValueSection />
      <AdminValueSection />
      <DppSection />
      <ImpactSection />
      <ProductPreviewSection />
      <TeamSection />
    </div>
  )
}
