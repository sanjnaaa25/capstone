import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn, getRandomInterviewCover } from "@/lib/utils";

interface RecruiterInterviewCardProps {
  id: string;
  company?: string;
  logo?: string;
}

const RecruiterInterviewCard = ({
  id,
  company,
  logo,
}: RecruiterInterviewCardProps) => {
  return (
    <div
      className={cn(
        "card-border w-[340px] max-sm:w-full min-h-[280px] flex flex-col justify-between p-6 hover:shadow-lg transition-all duration-200"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <Image
          src={logo || getRandomInterviewCover()}
          alt={`${company || "Company"} logo`}
          width={100}
          height={100}
          className="rounded-full object-cover size-[100px]"
        />
        <h3 className="mt-4 text-xl font-semibold capitalize text-center">
          {company || "Unnamed Company"}
        </h3>
      </div>

      <div className="flex justify-center mt-6">
        <Button asChild className="btn-primary w-full">
          <Link href={`/interview/start/${id}`}>Take Interview</Link>
        </Button>
      </div>
    </div>
  );
};

export default RecruiterInterviewCard;
