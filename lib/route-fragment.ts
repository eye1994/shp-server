import { RouteHandler } from "./types/response-handler";
import { RouteFragmentOptions } from "./types/route-fragment-options";
import { RouteMethod } from "./types/route-method";
import { RouteMiddleware } from "./types/route-middleware";
import { Request } from "./request";
import { Response } from "./response";

export class RouteFragment {
  fragment: string;
  middleware: RouteMiddleware[] = [];
  handlers = new Map<RouteMethod, RouteHandler>();
  children: RouteFragment[] = [];
  private readonly parameterName?: string;

  constructor(fragment: string, options?: RouteFragmentOptions) {
    this.fragment = fragment;
    this.parameterName = options?.parameterName;
  }

  getParameterName(): string | undefined {
    return this.parameterName;
  }

  handle(method: RouteMethod, request: Request): Response {
    if (!this.handlers.has(method)) {
      return new Response({}, { status: 404 });
    }

    const handler = this.handlers.get(method);
    try {
      return handler!(request);
    } catch (e) {
      return new Response({ error: e?.toString() }, { status: 500 });
    }
  }
}
