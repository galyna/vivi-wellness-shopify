// import { StreamingTextResponse } from 'ai';
import { ChatCompletionRequestMessage } from 'openai-edge';
import systemPrompt from "@/lib/system-promt";

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages: userMessages } = await req.json();
  const messages = [systemPrompt, ...userMessages.filter((m: ChatCompletionRequestMessage) => m.role !== "system")];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://openrouter.ai', // обязательно!
      'X-Title': 'Vivi AI Chat', // название приложения
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-haiku', //'meta-llama/llama-3-8b-instruct', // или 'openai/gpt-3.5-turbo' или 'anthropic/claude-3-haiku'
      messages: messages as ChatCompletionRequestMessage[],
      stream: true,
    }),
  });

  if (!response.body) {
    throw new Error("No response body from OpenRouter");
  }

  function extractContentFromSSE(buffer: string): string[] {
    const lines = buffer.split("\n");
    const result: string[] = [];
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const json = line.replace("data: ", "");
        if (json === "[DONE]") continue;
        try {
          const obj = JSON.parse(json);
          const content = obj.choices?.[0]?.delta?.content;
          if (content) result.push(content);
        } catch {}
      }
    }
    return result;
  }

  // Проксируем только текстовые чанки (content) из SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += new TextDecoder().decode(value);
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const content of extractContentFromSSE(lines.join("\n"))) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
