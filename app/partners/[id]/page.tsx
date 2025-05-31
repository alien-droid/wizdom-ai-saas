import { getPartnerById } from "@/lib/actions/partner.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import ConversationComponent from "@/components/ConversationComponent";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

const Session = async ({ params }: SessionPageProps) => {
  const { id } = await params;
  const partner = await getPartnerById(id);

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!partner || !partner.name) {
    redirect("/partners");
  }

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex justify-center items-center max-md:hidden rounded-lg"
            style={{ backgroundColor: getSubjectColor(partner.subject) }}
          >
            <Image
              src={`/icons/${partner.subject}.svg`}
              alt={partner.subject}
              width={35}
              height={35}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{partner.name}</p>
              <div className="subject-badge max-sm:hidden">
                {partner.subject}
              </div>
            </div>
            <p className="text-lg">{partner.topic}</p>
          </div>
        </div>
        <div className="items-start text-2xl max-md:hidden">
          {partner.duration} minutes
        </div>
      </article>
      <ConversationComponent
        {...partner}
        partnerId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
      />
    </main>
  );
};

export default Session;
