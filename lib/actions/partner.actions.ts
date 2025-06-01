"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createPartner = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("partners")
    .insert({ ...formData, author })
    .select();

  if (error || !data || data.length === 0) {
    throw new Error(error?.message || "Failed to create a partner");
  }

  return data[0];
};

export const getPartners = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient();
  let query = supabase.from("partners").select();
  const { userId } = await auth();

  // query search based on subject and topic
  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: partners, error } = await query;

  if (error || !partners) {
    throw new Error(error?.message || "Failed to get partners");
  }

  const partnerIds = partners.map(({ id }) => id);

  // Get the bookmarks where user_id is the current user and companion_id is in the array of companion IDs
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select()
    .eq("user_id", userId)
    .in("partner_id", partnerIds); // Notice the in() function used to filter the bookmarks by array

  const marks = new Set(bookmarks?.map(({ partner_id }) => partner_id));

  // Add a bookmarked property to each companion
  partners.forEach((partner) => {
    partner.bookmarked = marks.has(partner.id);
  });

  // Return the companions as before, but with the bookmarked property added
  return partners;
};

export const getPartnerById = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("partners").select().eq("id", id);

  if (error || !data) {
    throw new Error(error?.message || "Failed to get partner");
  }
  return data[0];
};

export const addToSessionHistory = async (partnerId: string) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .insert({ partner_id: partnerId, user_id: author })
    .select();

  if (error) {
    throw new Error(error.message || "Failed to add to session history");
  }

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`partners:partner_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || "Failed to get recent sessions");
  }

  return data.map(({ partners }) => partners);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select("partners:partner_id (*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || "Failed to get recent sessions");
  }

  return data.map(({ partners }) => partners);
};

export const getUserPartners = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("partners")
    .select()
    .eq("author", userId);

  if (error) {
    throw new Error(error.message || "Failed to get user partners");
  }
  return data;
};

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;
  if (has({ plan: "pro" })) {
    return true;
  } else if (has({ feature: "3_active_partners" })) {
    limit = 3;
  } else if (has({ feature: "10_active_partners" })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("partners")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) {
    throw new Error(error.message || "Failed to get user partners");
  }
  const partnerCount = data?.length || 0;

  return partnerCount < limit;
};

// bookmarks
export const addBookmark = async (partnerId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    partner_id: partnerId,
    user_id: userId,
  });
  if (error) {
    throw new Error(error.message);
  }
  // Revalidate the path to force a re-render of the page

  revalidatePath(path);
  return data;
};

export const removeBookmark = async (partnerId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("partner_id", partnerId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

export const getBookmarkedPartners = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`partners:partner_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  // We don't need the bookmarks data, so we return only the companions
  return data.map(({ partners }) => partners);
};
