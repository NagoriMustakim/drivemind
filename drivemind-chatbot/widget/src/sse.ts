/**
 * SSE reader (T052). Consumes a fetch streaming response and dispatches each
 * server-sent event so the reply can render progressively (token-by-token).
 */
export type SSEHandler = (event: string, data: unknown) => void;

/** Read an SSE body to completion, invoking `onEvent(event, data)` per event. */
export async function readSSE(body: ReadableStream<Uint8Array>, onEvent: SSEHandler): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const chunk = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const event = /event: (.*)/.exec(chunk)?.[1]?.trim();
      const dataLine = /data: (.*)/.exec(chunk)?.[1];
      if (!event || dataLine === undefined) continue;
      try {
        onEvent(event, JSON.parse(dataLine));
      } catch {
        // ignore malformed event lines
      }
    }
  }
}
