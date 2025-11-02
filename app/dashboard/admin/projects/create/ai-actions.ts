"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

export async function enhanceMarkdownWithAI(content: string) {
  try {
    if (!content || content.trim() === "") {
      return {
        success: false,
        error: "Content is empty",
      };
    }

    const prompt = `You are a technical writing assistant specialized in creating clear, well-structured markdown documentation for cloud computing and DevOps tutorials.

Your task is to enhance the following content into proper, professional markdown format while preserving the original meaning and intent.

Requirements:
1. Use proper markdown syntax (headings, lists, code blocks, etc.)
2. Structure the content logically with clear sections
3. Ensure technical accuracy
4. Make instructions clear and actionable
5. Use appropriate formatting for commands, file paths, and technical terms
6. Add proper spacing and organization
7. DO NOT change the core message or add new information that wasn't implied
8. Keep the same level of detail but make it more readable
9. IMPORTANT: Return ONLY the enhanced markdown content. Do NOT wrap it in markdown code fences (no \`\`\`markdown). Just return the raw markdown.

Original content:
${content}

Enhanced markdown:`;

    const stream = createStreamableValue("");

    (async () => {
      try {
        const result = await streamText({
          model: google("gemini-2.0-flash-exp"),
          prompt,
        });

        for await (const delta of result.textStream) {
          stream.update(delta);
        }

        stream.done();
      } catch (error) {
        console.error("AI Enhancement Error:", error);
        stream.error(error);
      }
    })();

    return {
      success: true,
      stream: stream.value,
    };
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to enhance content",
    };
  }
}
