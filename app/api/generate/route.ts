import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { ingredientsList, servingSize, dailyDietContext } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert nutrition analyst. Decode food labels, rate ultra-processed ingredients using NOVA classification, assess artificial additive concerns, and suggest whole-food swaps. Use markdown with clear ratings and sections.`,
        },
        {
          role: "user",
          content: `Analyze this nutrition label:\n\nIngredients: ${ingredientsList}\nServing size: ${servingSize}\nDaily diet context: ${dailyDietContext}\n\nProvide:\n1. NOVA ultra-processed classification (1-4 scale with explanation)\n2. Ingredient concern ratings (flag concerning additives)\n3. Nutritional highlights and red flags\n4. Whole-food swap alternatives\n5. How it fits into a balanced daily diet`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
