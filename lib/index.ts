import { METHODS } from "http";

const RouteMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

type RouteMethod = keyof typeof RouteMethods;

type RouterHandlerResponse = void;

type RouteMiddleware = () => RouterHandlerResponse;

type RouteHandler = () => RouterHandlerResponse;

type RequestInformations = {
  params: Map<string, string>;
};

export type RouteFragmentOptions = {
  parameterName?: string;
};

class RouteFragmenet {
  fragment: string;
  middlewares: RouteMiddleware[] = [];
  handlers: Map<RouteMethod, RouteHandler> = new Map();
  children: RouteFragmenet[] = [];
  private parameterName?: string;

  constructor(fragment: string, options?: RouteFragmentOptions) {
    this.fragment = fragment;
    this.parameterName = options?.parameterName;
  }

  getParameterName() {
    return this.parameterName;
  }

  handle(
    method: RouteMethod,
    info: RequestInformations
  ): RouterHandlerResponse {
    if (!this.handlers.has(method)) {
      console.error(`Usuported method type ${method}`);
      return;
    }

    const handler = this.handlers.get(method);
    // @TODO when will integrate will node server
    console.log("--------------------");
    console.log("request parameters: ", info.params.entries());
    return handler.apply(this);
  }
}

const createRouteFragment = (fragment: string): RouteFragmenet => {
  return new RouteFragmenet(fragment);
};

class Router {
  __ROUTER__: RouteFragmenet;

  private PARAMETER_FRAGMENT_NAME = "$$PARAM$$";

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
  handleRequest(route: string, method: RouteMethod) {
    const parts = this.getRouteParts(route);
    let currentFragment = this.__ROUTER__;
    const params = new Map<string, string>();

    for (let part of parts) {
      const routeFragment =
        this.findChildrenFragment(
          currentFragment,
          this.extractFramgentNameFromPart(part)
        ) || this.findChildreFragmentOfTypeParam(currentFragment);

      if (!routeFragment) {
        // @Todo will respond with 404 when integrated with the server
        console.error(`${method} ${route} - Status 404`);
        return;
      }

      if (!!routeFragment.getParameterName()) {
        params.set(routeFragment.getParameterName(), part);
      }

      currentFragment = routeFragment;
    }

    currentFragment.handle(method, { params });
  }

  private findOrCreateRouteFragment(route: string): RouteFragmenet {
    const parts = this.getRouteParts(route);

    let currentFragment = this.__ROUTER__;

    for (let part of parts) {
      const routeFragment = this.findChildrenFragment(
        currentFragment,
        this.extractFramgentNameFromPart(part)
      );

      if (routeFragment) {
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

const router = new Router();

/*
  @TODOS:
  - handle the following case
      insertHandler("/users", "GET", () => {});
      insertHandler("/users/posts", "GET", () => {});
*/

router.insertHandler("/users", "GET", () => {
  console.log("GET users");
});
router.insertHandler("/users/:userId", "GET", () => {
  console.log("GET users/:userId");
});
router.insertHandler("/users/:userId/articles", "GET", () => {
  console.log("GET user articles");
});
router.insertHandler("/users/:userId/images", "GET", () => {
  console.log("GET user images");
});
router.insertHandler("/users/:userId/posts/:postId/comments", "GET", () => {
  console.log("GET user posts comment");
});
router.insertHandler("/users/:userId/posts/:postId/comments", "POST", () => {
  console.log("POST user posts comments");
});

router.handleRequest("/users/11", "GET");
