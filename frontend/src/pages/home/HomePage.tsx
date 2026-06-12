import PageMeta from "../../components/common/PageMeta";
import { HomeNavbar } from "./HomeNavbar";
import { HeroSection } from "./HeroSection";
import { StatsBar } from "./StatsBar";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { RolesSection } from "./RolesSection";
import { CTASection } from "./CTASection";
import { HomeFooter } from "./HomeFooter";

export function HomePage() {
  return (
    <>
      <PageMeta
        title="MySchool ERP — One ERP. Every School."
        description="A secure, multi-school ERP platform for academics, attendance, fees, examinations, and parent communication — built for Indian schools."
      />
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <HomeNavbar />
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <RolesSection />
        <CTASection />
        <HomeFooter />
      </div>
    </>
  );
}
