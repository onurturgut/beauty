import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services")
      .select(
        "id,name,description,duration_min,price,image_key,sort,category:service_categories(name,slug)",
      )
      .eq("is_published", true)
      .order("sort");
    if (error) throw error;
    return data;
  },
});

export const staffQuery = queryOptions({
  queryKey: ["staff"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("staff")
      .select(
        "id,full_name,title,bio,photo_key,sort,staff_services(service_id)",
      )
      .eq("is_active", true)
      .order("sort");
    if (error) throw error;
    return data;
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort");
    if (error) throw error;
    return data;
  },
});

export const heroContentQuery = queryOptions({
  queryKey: ["content", "hero"],
  queryFn: async () => {
    const { data } = await supabase
      .from("content_sections")
      .select("value")
      .eq("key", "hero")
      .maybeSingle();
    return (data?.value ?? null) as {
      eyebrow?: string;
      title?: string;
      subtitle?: string;
    } | null;
  },
});
