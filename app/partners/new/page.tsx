import NewPartnerForm from "@/components/NewPartnerForm";
import React from "react";

const NewPartner = () => {
  return (
    <main className="items-center justify-center min-lg:w-1/3 min-md:w-2/3">
      <article className="w-full gap-4 flex flex-col">
        <h1>Learning Partner Builder 👩‍🏫</h1>
        <NewPartnerForm />
      </article>
    </main>
  );
};

export default NewPartner;
