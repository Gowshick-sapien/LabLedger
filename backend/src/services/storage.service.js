import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const uploadFile = async (buffer, fileName, mimeType) => {

  const uniqueName = `${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from("experiment-attachments")
    .upload(uniqueName, buffer, {
      contentType: mimeType
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("experiment-attachments")
    .getPublicUrl(uniqueName);

  return data.publicUrl;
};
