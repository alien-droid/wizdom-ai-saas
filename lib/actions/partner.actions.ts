"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

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
    .limit(limit)

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
