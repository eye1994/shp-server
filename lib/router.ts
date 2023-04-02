import { JSONResponse } from "./json-response";
import { Request } from "./request";
import { Response } from "./response";
import { RouteFragmenet } from "./route-fragment";
import { RouteHandler } from "./types/response-handler";
import { RouteFragmentOptions } from "./types/route-fragment-options";
import { RouteMethod } from "./types/route-method";

export class Router {
  __ROUTER__: RouteFragmenet;

  private readonly PARAMETER_FRAGMENT_NAME = "$$PARAM$$";

  constructor() {
    this.__ROUTER__ = new RouteFragmenet("/");
  }

  insertHandler(route: string, method: RouteMethod, handler: RouteHandler) {
    const fragmenet = this.findOrCreateRouteFragment(route);

    if (fragmenet.handlers.has(method)) {
      throw new Error(`Route ${route} with method ${method} is already used`);
    }

    fragmenet.handlers.set(method, handler);
  }

  // For now just to simulate that the correct handler is beeing called
  handleRequest(route: string, method: RouteMethod): Response {
    const parts = this.getRouteParts(route);
    let currentFragment = this.__ROUTER__;
    const request = new Request();

    for (const part of parts) {
      const routeFragment =
        this.findChildrenFragment(
          currentFragment,
          this.extractFramgentNameFromPart(part)
        ) || this.findChildreFragmentOfTypeParam(currentFragment);

      if (routeFragment == null) {
        // @Todo will respond with 404 when integrated with the server
        console.error(`${method} ${route} - Status 404`);
        return new JSONResponse({}, 404);
      }

      if (!!routeFragment.getParameterName()) {
        request.params.set(routeFragment.getParameterName() as string, part);
      }

      currentFragment = routeFragment;
    }

    return currentFragment.handle(method, request);
  }

  private findOrCreateRouteFragment(route: string): RouteFragmenet {
    const parts = this.getRouteParts(route);

    let currentFragment = this.__ROUTER__;

    for (const part of parts) {
      const routeFragment = this.findChildrenFragment(
        currentFragment,
        this.extractFramgentNameFromPart(part)
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
    routeFragment: RouteFragmenet,
    fragmentName: string
  ): RouteFragmenet | null {
    for (const currentRouteFragment of routeFragment.children) {
      if (currentRouteFragment.fragment === fragmentName) {
        return currentRouteFragment;
      }
    }

    return null;
  }

  private findChildreFragmentOfTypeParam(
    routeFragment: RouteFragmenet
  ): RouteFragmenet | null {
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

  private extractFramgentNameFromPart(part: string) {
    return this.isParameterPart(part) ? this.PARAMETER_FRAGMENT_NAME : part;
  }

  private extractParameterNameFromPart(part: string) {
    return part.replace(":", "");
  }

  private createRouteFragmentFromPart(part: string): RouteFragmenet {
    const options: RouteFragmentOptions = this.isParameterPart(part)
      ? { parameterName: this.extractParameterNameFromPart(part) }
      : {};
    return new RouteFragmenet(this.extractFramgentNameFromPart(part), options);
  }
}
