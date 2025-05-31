"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { subjects } from "@/constants";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SubjectFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("subject") || "";

  const [subject, setSubject] = useState<string>(query);
  useEffect(() => {
    let url = "";
    if (subject === "all") {
      url = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["subject"],
      });
    } else {
      url = formUrlQuery({
        params: searchParams.toString(),
        key: "subject",
        value: subject,
      });
    }
    router.push(url, {
      scroll: false,
    });
  }, [subject, router, searchParams]);

  return (
    <Select onValueChange={setSubject} value={subject}>
      <SelectTrigger className="input capitalize">
        <SelectValue placeholder="Select a subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subjects</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject} value={subject} className="capitalize">
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilters;
