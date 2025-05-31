import { auth } from "@clerk/nextjs/server";
import NewPartnerForm from "@/components/NewPartnerForm";
import { redirect } from "next/navigation";

const NewPartner = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

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
