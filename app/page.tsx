import CTA from "@/components/cta";
import PartnerCard from "@/components/PartnerCard";
import PartnersList from "@/components/PartnersList";
import { getPartners, getRecentSessions } from "@/lib/actions/partner.actions";
import { getSubjectColor } from "@/lib/utils";
import React from "react";

const Page = async () => {
  const partners = await getPartners({ limit: 3 });
  const recentSessions = await getRecentSessions(10);

  return (
    <main>
      <h1>Wizdom.ai</h1>
      <h1 className="text-2xl underline">Popular Partners</h1>
      <section className="home-section">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            {...partner}
            color={getSubjectColor(partner.subject)}
          />
        ))}
      </section>

      <section className="home-section">
        <PartnersList
          title="Recently Completed Lessons"
          partners={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
