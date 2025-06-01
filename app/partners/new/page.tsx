import { auth } from "@clerk/nextjs/server";
import NewPartnerForm from "@/components/NewPartnerForm";
import { redirect } from "next/navigation";
import { newCompanionPermissions } from "@/lib/actions/partner.actions";
import Image from "next/image";
import Link from "next/link";

const NewPartner = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const canCreatePartner = await newCompanionPermissions();

  return (
    <main className="items-center justify-center min-lg:w-1/3 min-md:w-2/3">
      {canCreatePartner ? (
        <article className="w-full gap-4 flex flex-col">
          <h1>Learning Partner Builder 👩‍🏫</h1>
          <NewPartnerForm />
        </article>
      ) : (
        <article className="companion-limit">
          <Image
            src="/images/limit.svg"
            alt="Partner Limit Reached. 😞"
            width={360}
            height={240}
          />
          <div className="cta-badge">Upgrade your plan.</div>
          <h1>You've reached the limit of active learning partners.</h1>
          <p>
            Upgrade to create more learning partners and premium features. 🚀
          </p>
          <Link
            href="/subscription"
            className="btn-primary w-full justify-center"
          >
            Upgrade My Plan
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewPartner;
