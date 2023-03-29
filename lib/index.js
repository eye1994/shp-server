var RouteMethods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};
var createRouteFragment = function (fragment) {
    return {
        fragment: fragment,
        middlewares: [],
        handlers: {},
        children: [],
    };
};
var PARAMETER_FRAGMENT_NAME = "$$PARAM$$";
var Router = /** @class */ (function () {
    function Router() {
        this.__ROUTER__ = this.createRouteFragment("/");
    }
    Router.prototype.insertHandler = function (route, method, handler) {
        var fragmenet = this.buildRoute(route);
        if (fragmenet.handlers[method]) {
            throw new Error("Route ".concat(route, " with method ").concat(method, " is already used"));
        }
        fragmenet.handlers[method] = handler;
    };
    Router.prototype.buildRoute = function (route) {
        var parts = route.split("/");
        if (route.startsWith("/")) {
            parts.shift();
        }
        var currentFragment = this.__ROUTER__;
        var _loop_1 = function (part) {
            var isParameter = part.startsWith(":");
            var fragmentName = isParameter ? PARAMETER_FRAGMENT_NAME : part;
            var fragment = currentFragment.children.find(function (_a) {
                var fragment = _a.fragment;
                return fragment === fragmentName;
            });
            if (fragment) {
                currentFragment = fragment;
            }
            else {
                var fragment_1 = createRouteFragment(fragmentName);
                currentFragment.children.push(fragment_1);
                currentFragment = fragment_1;
                if (isParameter) {
                    fragment_1.parameterName = part.replace(":", "");
                }
            }
        };
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            _loop_1(part);
        }
        return currentFragment;
    };
    Router.prototype.createRouteFragment = function (fragment) {
        return {
            fragment: fragment,
            middlewares: [],
            handlers: {},
            children: [],
        };
    };
    return Router;
}());
var router = new Router();
/*
  @TODOS:
  - handle the following case
      insertHandler("/users", "GET", () => {});
      insertHandler("/users/posts", "GET", () => {});
*/
router.insertHandler("/users", "GET", function () { });
router.insertHandler("/users/:userId/articles", "GET", function () { });
router.insertHandler("/users/:userId/images", "GET", function () { });
router.insertHandler("/users/:userId/posts/:postId/comments", "GET", function () { });
router.insertHandler("/users/:userId/posts/:postId/comments", "POST", function () { });
// insertHandler(
//   "/users/:userId/posts/:postId/comments/:commentId",
//   "PUT",
//   () => {}
// );
// insertHandler(
//   "/users/:userId/posts/:postId/comments/:commentId",
//   "PUT",
//   () => {}
// );
// insertHandler(
//   "/users/:userId/posts/:postId/comments/:commentId",
//   "DELETE",
//   () => {}
// );
console.log(JSON.stringify(router.__ROUTER__));
