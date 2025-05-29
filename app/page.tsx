import CTA from "@/components/cta";
import PartnerCard from "@/components/PartnerCard";
import PartnersList from "@/components/PartnersList";
import { recentSessions } from "@/constants";
import React from "react";

const Page = () => {
  return (
    <main>
      <h1>Wizdom.ai</h1>
      <h1 className="text-2xl underline">Popular Partners</h1>
      <section className="home-section">
        <PartnerCard
          id="123"
          name="The Neural Brain"
          topic="Neural Network of the Brain"
          subject="science"
          duration={45}
          color="#ffdr59"
        />
        <PartnerCard
          id="456"
          name="How to make Mathy Curves?"
          topic="Integrals and Derivatives"
          subject="maths"
          duration={30}
          color="#e5d0ff"
        />
        <PartnerCard
          id="789"
          name="Vocabulary Builder"
          topic="Literature and Language"
          subject="language"
          duration={30}
          color="#bde7ff"
        />
      </section>

      <section className="home-section">
        <PartnersList 
        title="Recently Completed Lessons"
        partners={recentSessions}
        classNames="w-2/3 max-lg:w-full"/>
        <CTA />
      </section>
    </main>
  );
};

export default Page;
