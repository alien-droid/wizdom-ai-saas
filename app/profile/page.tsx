import PartnersList from "@/components/PartnersList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getBookmarkedPartners,
  getUserPartners,
  getUserSessions,
} from "@/lib/actions/partner.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const partners = await getUserPartners(user.id);
  const sessions = await getUserSessions(user.id);
  const bookmarks = await getBookmarkedPartners(user.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between items-center gap-4 max-sm:flex-col">
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl!}
            alt={user.firstName!}
            width={110}
            height={110}
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border border-black p-3 gap-2 flex flex-col h-fit rounded-md">
            <div className="flex gap-2 items-center">
              <Image
                src={`/icons/check.svg`}
                alt="check"
                width={20}
                height={20}
              />
              <p className="text-2xl font-bold">{sessions.length}</p>
            </div>
            <div>Lessons completed</div>
          </div>
          <div className="border border-black p-3 gap-2 flex flex-col h-fit rounded-md">
            <div className="flex gap-2 items-center">
              <Image
                src={`/icons/cap.svg`}
                alt="check"
                width={20}
                height={20}
              />
              <p className="text-2xl font-bold">{partners.length}</p>
            </div>
            <div>Partners created</div>
          </div>
        </div>
      </section>
      <Accordion type="multiple">
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            Bookmarked Lessons
          </AccordionTrigger>
          <AccordionContent>
            <PartnersList title="Bookmarked Lessons" partners={bookmarks} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            Recent Lessons
          </AccordionTrigger>
          <AccordionContent>
            <PartnersList title="Recent Lessons" partners={sessions} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="partners">
          <AccordionTrigger className="text-2xl font-bold">
            My Learning Partners{" "}
            {partners.length > 0 ? `(${partners.length})` : ""}
          </AccordionTrigger>
          <AccordionContent>
            <PartnersList title="My Learning Partners" partners={partners} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Profile;
