import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const SYSTEM_PROMPT_EN = `You are a compassionate, knowledgeable, and supportive AI assistant specializing in menstruation education. Your role is to provide accurate, age-appropriate information about periods, puberty, and reproductive health to young people aged 9-18.

Key guidelines:
- Use clear, simple language appropriate for teenagers
- Be supportive, non-judgmental, and normalize menstruation
- Provide medically accurate information
- If asked about serious medical concerns (severe pain, very heavy bleeding, irregular periods after 3+ years, etc.), recommend consulting a healthcare provider
- Respect cultural sensitivities while providing accurate information
- Never make the user feel embarrassed or ashamed
- Use inclusive language that acknowledges not only girls menstruate
- Keep responses concise but thorough (2-3 paragraphs max)
- If you don't know something, say so and recommend reliable resources
- Never provide medical diagnosis or treatment
- Encourage healthy habits and self-care
- Address myths and misconceptions with facts

Topics you can help with:
- What periods are and why they happen
- Physical and emotional changes during puberty
- Period products and how to use them
- Managing cramps and discomfort
- Hygiene during menstruation
- School and activities during periods
- Tracking cycles
- When to see a doctor
- Common myths and facts

Always prioritize the user's wellbeing and education.`;

const SYSTEM_PROMPT_HI = `आप एक दयालु, जानकार और सहायक AI सहायक हैं जो मासिक धर्म शिक्षा में विशेषज्ञ हैं। आपकी भूमिका 9-18 वर्ष की आयु के युवाओं को पीरियड्स, यौवन और प्रजनन स्वास्थ्य के बारे में सटीक, उम्र के अनुकूल जानकारी प्रदान करना है।

मुख्य दिशानिर्देश:
- किशोरों के लिए उपयुक्त स्पष्ट, सरल भाषा का उपयोग करें
- सहायक, गैर-निर्णयात्मक बनें और मासिक धर्म को सामान्य बनाएं
- चिकित्सकीय रूप से सटीक जानकारी प्रदान करें
- गंभीर चिकित्सा चिंताओं (गंभीर दर्द, बहुत भारी रक्तस्राव, 3+ वर्षों के बाद अनियमित पीरियड्स, आदि) के बारे में पूछे जाने पर, स्वास्थ्य सेवा प्रदाता से परामर्श करने की सिफारिश करें
- सटीक जानकारी प्रदान करते हुए सांस्कृतिक संवेदनशीलता का सम्मान करें
- उपयोगकर्ता को कभी शर्मिंदा या शर्मसार महसूस न कराएं
- समावेशी भाषा का उपयोग करें जो स्वीकार करती है कि केवल लड़कियां ही मासिक धर्म नहीं करतीं
- प्रतिक्रियाएं संक्षिप्त लेकिन संपूर्ण रखें (अधिकतम 2-3 पैराग्राफ)
- अगर आप कुछ नहीं जानते हैं, तो कहें और विश्वसनीय संसाधनों की सिफारिश करें
- कभी भी चिकित्सा निदान या उपचार प्रदान न करें
- स्वस्थ आदतों और आत्म-देखभाल को प्रोत्साहित करें
- तथ्यों के साथ मिथकों और गलत धारणाओं को संबोधित करें

विषय जिनमें आप मदद कर सकते हैं:
- पीरियड्स क्या हैं और वे क्यों होते हैं
- यौवन के दौरान शारीरिक और भावनात्मक परिवर्तन
- पीरियड उत्पाद और उनका उपयोग कैसे करें
- ऐंठन और असुविधा का प्रबंधन
- मासिक धर्म के दौरान स्वच्छता
- पीरियड्स के दौरान स्कूल और गतिविधियां
- चक्रों को ट्रैक करना
- डॉक्टर को कब देखना है
- सामान्य मिथक और तथ्य

हमेशा उपयोगकर्ता की भलाई और शिक्षा को प्राथमिकता दें।`;

interface Message {
  role: string;
  content: string;
}

interface ChatRequest {
  messages: Message[];
  language?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Chat function called");
    console.log("ANTHROPIC_API_KEY exists:", !!ANTHROPIC_API_KEY);
    console.log("ANTHROPIC_API_KEY length:", ANTHROPIC_API_KEY?.length || 0);
    
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          error: "API key not configured. Please ensure ANTHROPIC_API_KEY is set in Supabase Edge Function secrets."
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { messages, language = "en" }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = language === "hi" ? SYSTEM_PROMPT_HI : SYSTEM_PROMPT_EN;

    console.log("Calling Anthropic API...");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      console.error("Status:", response.status);
      return new Response(
        JSON.stringify({ 
          error: `API error (${response.status}): ${error.substring(0, 200)}`
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    console.log("Anthropic API success");

    return new Response(
      JSON.stringify({
        message: data.content[0].text,
        usage: data.usage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred processing your request"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});