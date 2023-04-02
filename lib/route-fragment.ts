import { RouteHandler } from "./types/response-handler";
import { RouteFragmentOptions } from "./types/route-fragment-options";
import { RouteMethod } from "./types/route-method";
import { RouteMiddleware } from "./types/route-middleware";
import { Request } from "./request";
import { JSONResponse } from "./json-response";
import { Response } from "./response";

export class RouteFragmenet {
  fragment: string;
  middlewares: RouteMiddleware[] = [];
  handlers = new Map<RouteMethod, RouteHandler>();
  children: RouteFragmenet[] = [];
  private readonly parameterName?: string;

  constructor(fragment: string, options?: RouteFragmentOptions) {
    this.fragment = fragment;
    this.parameterName = options?.parameterName;
  }

  getParameterName(): string | undefined {
    return this.parameterName;
  }

  handle(
    method: RouteMethod,
    request: Request
  ): Response {
    if (!this.handlers.has(method)) {
      return new JSONResponse({}, 404);
    }

    const handler = this.handlers.get(method);
    try {
      return handler!(request);
    } catch(e) {
      return new JSONResponse({ error: e?.toString() }, 500);
    }
  }
}