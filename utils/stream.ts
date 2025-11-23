// utils/stream.ts
import { NextResponse } from "next/server";

/**
 * Stream SSE (Server-Sent Events) responses from OpenRouter to the client
 */
export async function streamResponse(openRouterResponse: Response) {
    if (!openRouterResponse.body) {
        return NextResponse.json({ error: "No response body" }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            const reader = openRouterResponse.body!.getReader();

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6);

                            if (data === "[DONE]") {
                                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content;

                                if (content) {
                                    controller.enqueue(
                                        encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                                    );
                                }
                            } catch (e) {
                                // Skip invalid JSON
                                console.warn("Failed to parse SSE data:", data);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Stream error:", error);
                controller.error(error);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
