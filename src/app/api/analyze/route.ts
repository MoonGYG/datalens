import { NextRequest, NextResponse } from "next/server";

const MIMO_API_URL = "https://opengateway.gitlawb.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { messages, dataPreview } = await req.json();

    const systemMessage = {
      role: "system",
      content: `You are DataLens AI, a professional data analyst assistant. You help users analyze their data by answering questions, finding patterns, suggesting insights, and recommending visualizations.

When given data, you should:
1. Identify key statistics (mean, median, min, max, correlations)
2. Spot trends, outliers, and patterns
3. Suggest relevant visualizations
4. Provide actionable insights
5. Answer specific questions about the data

Always respond in a structured, professional manner. Use markdown formatting for clarity.

Current data preview:
${dataPreview || "No data loaded yet."}`,
    };

    const response = await fetch(MIMO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "xiaomi-mimo",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 2048,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("MiMo API error:", errorText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "No response from AI.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
