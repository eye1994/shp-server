const RouteMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

type RouteMethod = keyof typeof RouteMethods;

type RouteMiddleware = () => void;

type RouteHandler = () => void;

type RouteHandlers = {
  GET?: RouteHandler;
  POST?: RouteHandler;
  PUT?: RouteHandler;
  DELETE?: RouteHandler;
};

type RouteFragmenet = {
  fragment: string;
  middlewares: RouteMiddleware[];
  handlers: RouteHandlers;
  children: RouteFragmenet[];
  parameterName?: string;
};

const createRouteFragment = (fragment: string): RouteFragmenet => {
  return {
    fragment,
    middlewares: [],
    handlers: {},
    children: [],
  };
};

const PARAMETER_FRAGMENT_NAME = "$$PARAM$$";

class Router {
  __ROUTER__: RouteFragmenet;

  constructor() {
    this.__ROUTER__ = this.createRouteFragment("/");
  }

  insertHandler(route: string, method: RouteMethod, handler: RouteHandler) {
    const fragmenet = this.buildRoute(route);

    if (fragmenet.handlers[method]) {
      throw new Error(`Route ${route} with method ${method} is already used`);
    }

    fragmenet.handlers[method] = handler;
  }

  private buildRoute(route: string): RouteFragmenet {
    const parts = route.split("/");
    if (route.startsWith("/")) {
      parts.shift();
    }

    let currentFragment = this.__ROUTER__;

    for (let part of parts) {
      const isParameter = part.startsWith(":");
      const fragmentName = isParameter ? PARAMETER_FRAGMENT_NAME : part;

      const fragment = currentFragment.children.find(
        ({ fragment }) => fragment === fragmentName
      );

      if (fragment) {
        currentFragment = fragment;
      } else {
        const fragment = createRouteFragment(fragmentName);
        currentFragment.children.push(fragment);
        currentFragment = fragment;
        if (isParameter) {
          fragment.parameterName = part.replace(":", "");
        }
      }
    }

    return currentFragment;
  }

  private createRouteFragment(fragment: string): RouteFragmenet {
    return {
      fragment,
      middlewares: [],
      handlers: {},
      children: [],
    };
  }
}

const router = new Router();

/*
  @TODOS:
  - handle the following case
      insertHandler("/users", "GET", () => {});
      insertHandler("/users/posts", "GET", () => {});
*/

router.insertHandler("/users", "GET", () => {});
router.insertHandler("/users/:userId/articles", "GET", () => {});
router.insertHandler("/users/:userId/images", "GET", () => {});
router.insertHandler("/users/:userId/posts/:postId/comments", "GET", () => {});
router.insertHandler("/users/:userId/posts/:postId/comments", "POST", () => {});

console.log(JSON.stringify(router.__ROUTER__));
