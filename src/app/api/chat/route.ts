import { NextRequest } from "next/server";
import { openai, DEFAULT_MODEL, DEFAULT_TEMPERATURE } from "@/lib/openai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";
import type { ChatRequest, ChatMessage, ContentPart } from "@/lib/types/chat";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

function hasImageContent(message: ChatMessage): boolean {
  if (typeof message.content === "string") return false;
  return message.content.some((part) => part.type === "image_url");
}

function transformMessage(message: ChatMessage): ChatCompletionMessageParam {
  if (typeof message.content === "string") {
    if (message.role === "assistant") {
      return { role: "assistant", content: message.content };
    }
    return { role: "user", content: message.content };
  }

  // Transform content array to OpenAI format (only user messages support multimodal)
  const content = message.content.map((part: ContentPart) => {
    if (part.type === "text") {
      return { type: "text" as const, text: part.text };
    }
    return {
      type: "image_url" as const,
      image_url: {
        url: part.image_url.url,
        detail: part.image_url.detail || ("auto" as const),
      },
    };
  });

  // Multimodal content is only supported for user messages
  return { role: "user", content };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;

    if (!body.messages?.length) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if any message contains images
    const hasImages = body.messages.some(hasImageContent);

    // Transform messages to OpenAI format
    const transformedMessages = body.messages.map(transformMessage);

    const stream = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: DEFAULT_TEMPERATURE,
      stream: true,
      messages: [
        {
          role: "system",
          content: CHAT_SYSTEM_PROMPT,
        },
        ...transformedMessages,
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
