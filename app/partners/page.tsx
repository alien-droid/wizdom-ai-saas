import PartnerCard from "@/components/PartnerCard";
import SubjectFilters from "@/components/subjectFilters";
import SearchBar from "@/components/SearchBar";
import { getPartners } from "@/lib/actions/partner.actions";
import { getSubjectColor } from "@/lib/utils";

const PartnersLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;

  const subject = filters.subject || "";
  const topic = filters.topic || "";

  const partners = await getPartners({ subject, topic });
  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Partners Library</h1>
        <div className="flex gap-4">
          <SearchBar />

          <SubjectFilters />
        </div>
      </section>
      <section className="companions-grid">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            {...partner}
            color={getSubjectColor(partner.subject)}
          />
        ))}
      </section>
    </main>
  );
};

export default PartnersLibrary;
