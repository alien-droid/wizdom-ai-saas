import Image from "next/image";
import Link from "next/link";
interface PartnerCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
}

const PartnerCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
}: PartnerCardProps) => {
  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex items-center justify-between">
        <div className="subject-badge">{subject}</div>
        <button className="companion-bookmark">
          <Image
            src={"/icons/bookmark.svg"}
            alt={"bookmark"}
            width={13}
            height={15}
          />
        </button>
      </div>
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image src={"/icons/clock.svg"} alt={"clock"} width={14} height={14} />
        <p className="text-sm">{duration} mins</p>
      </div>
      <Link href={`/partners/${id}`} className="w-full">
        <button className="w-full btn-primary justify-center">
          Launch Lesson
        </button>
      </Link>
    </article>
  );
};

export default PartnerCard;
