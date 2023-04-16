import http from "http";
import { createResponse } from "./request";
import { Response } from "./response";
import { RouteFragment } from "./route-fragment";
import { RouteHandler } from "./types/route-handler";
import { RouteFragmentOptions } from "./types/route-fragment-options";
import { RouteMethod } from "./types/route-method";
import { Context } from "./context";
import { RouteMiddleware } from "./types/route-middleware";

export class Router {
  __ROUTER__: RouteFragment;

  private readonly PARAMETER_FRAGMENT_NAME = "$$PARAM$$";

  constructor() {
    this.__ROUTER__ = new RouteFragment("/");
  }

  insertHandler(route: string, method: RouteMethod, handler: RouteHandler) {
    const fragment = this.findOrCreateRouteFragment(route);

    if (fragment.handlers.has(method)) {
      throw new Error(`Route ${route} with method ${method} is already used`);
    }

    fragment.handlers.set(method, handler);
  }

  insertMiddleware(route: string, handler: RouteMiddleware) {
    const fragment = this.findOrCreateRouteFragment(route);
    fragment.middleware.push(handler);
  }

  async handleRequest(_req: http.IncomingMessage): Promise<Response> {
    if (!_req.url || !_req.method) {
      return new Response({}, { status: 404 });
    }

    const req = await createResponse(_req);
    const context = new Context();
    const pathname = req.pathname as string;
    const method = req.method as RouteMethod;

    const parts = this.getRouteParts(pathname);
    let currentFragment = this.__ROUTER__;

    if (currentFragment.middleware.length > 0) {
      for (const middleware of currentFragment.middleware) {
        const response = await Promise.resolve(middleware(req, context));
        if (response) {
          return response;
        }
      }
    }


    for (const part of parts) {
      const routeFragment =
        this.findChildrenFragment(
          currentFragment,
          this.extractFragmentNameFromPart(part)
        ) || this.findChildrenFragmentOfTypeParam(currentFragment);

      if (routeFragment == null) {
        return new Response({}, { status: 404 });
      }

      if (!!routeFragment.getParameterName()) {
        req.params.set(routeFragment.getParameterName() as string, part);
      }

      if (routeFragment.middleware.length > 0) {
        for (const middleware of routeFragment.middleware) {
          const response = await Promise.resolve(middleware(req, context));
          if (response) {
            return response;
          }
        }
      }

      currentFragment = routeFragment;
    }

    return Promise.resolve(currentFragment.handle(method, req, context)).then((response: Response) => {
      for (const [header, headerValue] of context.headers) {
        response.headers.set(header, headerValue)
      }

      return response;
    });
  }

  private findOrCreateRouteFragment(route: string): RouteFragment {
    if (route === '/') {
      return this.__ROUTER__;
    }

    const parts = this.getRouteParts(route);

    let currentFragment = this.__ROUTER__;

    for (const part of parts) {
      const routeFragment = this.findChildrenFragment(
        currentFragment,
        this.extractFragmentNameFromPart(part)
      );

      if (routeFragment != null) {
        currentFragment = routeFragment;
      } else {
        const fragment = this.createRouteFragmentFromPart(part);
        currentFragment.children.push(fragment);
        currentFragment = fragment;
      }
    }

    return currentFragment;
  }

  private findChildrenFragment(
    routeFragment: RouteFragment,
    fragmentName: string
  ): RouteFragment | null {
    for (const currentRouteFragment of routeFragment.children) {
      if (currentRouteFragment.fragment === fragmentName) {
        return currentRouteFragment;
      }
    }

    return null;
  }

  private findChildrenFragmentOfTypeParam(
    routeFragment: RouteFragment
  ): RouteFragment | null {
    for (const currentRouteFragment of routeFragment.children) {
      if (currentRouteFragment.fragment === this.PARAMETER_FRAGMENT_NAME) {
        return currentRouteFragment;
      }
    }

    return null;
  }

  private getRouteParts(route: string): string[] {
    const parts = route.split("/");
    if (route.startsWith("/")) {
      parts.shift();
    }

    return parts;
  }

  private isParameterPart(part: string) {
    return part.startsWith(":");
  }

  private extractFragmentNameFromPart(part: string) {
    return this.isParameterPart(part) ? this.PARAMETER_FRAGMENT_NAME : part;
  }

  private extractParameterNameFromPart(part: string) {
    return part.replace(":", "");
  }

  private createRouteFragmentFromPart(part: string): RouteFragment {
    const options: RouteFragmentOptions = this.isParameterPart(part)
      ? { parameterName: this.extractParameterNameFromPart(part) }
      : {};
    return new RouteFragment(this.extractFragmentNameFromPart(part), options);
  }
}
