import { NextResponse } from "next/server";

export class BodyTooLargeError extends Error {}
export class InvalidJsonError extends Error {}

/**
 * Read a JSON request body with a size cap. Rejects oversized payloads
 * (413) and malformed JSON (400) instead of letting them OOM the handler
 * or surface as 500s.
 */
export async function readJsonBody(
  req: Request,
  maxBytes = 32 * 1024
): Promise<unknown> {
  const declared = req.headers.get("content-length");
  if (declared != null && Number(declared) > maxBytes) {
    throw new BodyTooLargeError(
      `Request body exceeds ${maxBytes} bytes`
    );
  }
  const text = await req.text();
  if (text.length > maxBytes) {
    throw new BodyTooLargeError(
      `Request body exceeds ${maxBytes} bytes`
    );
  }
  if (!text.trim()) {
    throw new InvalidJsonError("Empty request body");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new InvalidJsonError("Malformed JSON body");
  }
}

/** Map body-parsing failures to the right HTTP status. */
export function bodyErrorResponse(err: unknown): NextResponse | null {
  if (err instanceof BodyTooLargeError) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 413 }
    );
  }
  if (err instanceof InvalidJsonError) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 400 }
    );
  }
  return null;
}

/** 429 response with a Retry-After hint. */
export function rateLimitedResponse(
  message = "Too many requests — retry in a minute",
  retryAfterSeconds = 60
): NextResponse {
  return NextResponse.json(
    { ok: false, error: message },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}
