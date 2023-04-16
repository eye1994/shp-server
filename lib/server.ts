import http, { ServerResponse } from "http";
import { Router } from "./router";
import { RouteHandler } from "./types/route-handler";
import { RouteMethods } from "./types/route-methods";
import { RouteMiddleware } from "./types/route-middleware";

export class SHPServer {
  private router: Router;
  private httpServer;

  constructor() {
    this.router = new Router();
    this.httpServer = http.createServer(this.onRequest.bind(this));
  }

  get (route: string, handler: RouteHandler) {

    return this.router.insertHandler(route, RouteMethods.GET, handler);
  }

  post (route: string, handler: RouteHandler) {
    return this.router.insertHandler(route, RouteMethods.POST, handler);
  }

  put (route: string, handler: RouteHandler) {
    return this.router.insertHandler(route, RouteMethods.PUT, handler);
  }

  delete (route: string, handler: RouteHandler) {
    return this.router.insertHandler(route, RouteMethods.DELETE, handler);
  }

  middleware(route: string, handler: RouteMiddleware) {
    return this.router.insertMiddleware(route, handler);
  }

  listen (port: number) {
    this.httpServer.listen(port);
  }

  private onRequest (req: http.IncomingMessage, res: ServerResponse) {
    this.router.handleRequest(req).then(
      (response) => {
        res.writeHead(
          response.status,
          Object.fromEntries(response?.headers.entries())
        );

        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          res.end(JSON.stringify(response.body));
        } else {
          res.end(response.body);
        }
      },
      (error) => {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error }));
      }
    );
  }
}
