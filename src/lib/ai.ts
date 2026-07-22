"use server";

import { Listing } from "@/types"; // Use your actual Listing import path
import { getSupabaseClient, getSupabaseServiceClient } from "./supabase";
import { revalidatePath } from "next/cache";

export async function generateListingCrux(listing: Listing): Promise<string> {
  const apiKey = process.env.NEXT_GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("Missing NEXT_GROQ_API_KEY environment variable");
    return "";
  }

    const numericPrice = Number(listing.price || 0);
    let indianPriceFormatted = "Contact Agent";

    if (numericPrice > 0) {
        if (numericPrice >= 10000000) {
            // 1 Crore = 10,000,000 (7 zeros)
            indianPriceFormatted = `₹ ${(numericPrice / 10000000).toFixed(2)} Crore`;
        } else {
            // 1 Lakh = 100,000 (5 zeros)
            // 2500000 / 100000 = 25 Lakh
            indianPriceFormatted = `₹ ${(numericPrice / 100000).toFixed(2)} Lakh`;
        }
    }

  try {
    const listingContext = [
      `Type: ${listing.property_type}`,
      `Price: $${indianPriceFormatted}`,
      `Beds/Baths: ${listing.bedrooms}b/${listing.bathrooms}b`,
      `Loc: ${listing.location}`,
      `Desc: ${(listing.description || "").slice(0, 100)}` 
    ].join(" | ");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "groq/compound-mini", 
        messages: [
          { 
            role: "system", 
            content: "You are an elite Indian real estate copywriter. Write a compelling, high-converting marketing crux of this property to lure Indian home buyers. Use the exact price and structural details provided in the context directly without altering numbers. Use premium Indian real estate terms (e.g., independent house, premium location, spacious layout). Output exactly 2 to 3 persuasive sentences, under 50 words total. Do not use introductory fluff or meta-commentary. Take reference from this example: Embrace premium independent living in Mohali’s highly coveted Sector 71 with this exceptional independent house. Boasting a spacious 200 gajj single-storey layout featuring two comfortable bedrooms and three modern baths, it offers the ultimate family lifestyle value. Move-in ready and priced perfectly at ₹25 Lakhs, this rare property is primed for immediate sale." 
          },
          { role: "user", content: `Analyze this context and output the crux: ${listingContext}` }
        ],
        temperature: 1, 
      }),
    });
    if (!response.ok) {
        console.error('No response from groq')
        return "";
    };
    const data = await response.json();
    const crux = data.choices?.[0]?.message?.content?.trim() || "";
    if (!crux) {
      console.error("Groq returned an empty crux response:", data);
      return "";
    }

    console.log(`Returned crux from Groq: ${crux}`);
    const supabase = getSupabaseServiceClient() ?? getSupabaseClient();
    if (!supabase) {
      console.error(
        `❌ No Supabase client available for listing ${listing.id}. ` +
          "Set NEXT_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY."
      );
    } else {
      const { error: updateError } = await supabase
        .from("listings")
        .update({ ai_crux: crux })
        .eq("id", listing.id);

      if (updateError) {
        console.error(`❌ [Server DB Error] Failed to write crux for listing ${listing.id}:`, updateError.message);
      } else {
        console.log(`✅ [AI Cache Saved] Server securely saved crux for: ${listing.id}`);
        revalidatePath(`/property/${listing.id}`);
      }
    }
    return crux;
  } catch (error) {
    console.error("AI Crux generation failed:", error);
    return "";
  }
}