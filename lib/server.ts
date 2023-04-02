import http from "http";
import { Router } from "./router";
import { RouteHandler } from "./types/response-handler";
import { RouteMethod } from "./types/route-method";
import { RouteMethods } from "./types/route-methods";

export class SHPServer {
  private router: Router;
  private httpServer;

  constructor() {
    this.router = new Router();
    this.httpServer = http.createServer(this.onRequest.bind(this))
  }

  get(route: string, handler: RouteHandler) {
    return this.router.insertHandler(route, RouteMethods.GET, handler);
  }

  post(route: string, handler: RouteHandler) {
    return this.router.insertHandler(route, RouteMethods.POST, handler);
  }

  put(route: string, handler: RouteHandler) {
    return this.router.insertHandler(route, RouteMethods.PUT, handler);
  }
  
  delete(route: string, handler: RouteHandler) {
    return this.router.insertHandler(route, RouteMethods.DELETE, handler);
  }

  listen(port: number) {
    this.httpServer.listen(port);
  }

  private onRequest(req, res) {
    const url = req.url;
    const method = req.method;

    if (!url || !method) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
      return;
    }

    const response = this.router.handleRequest(url, method as RouteMethod);
    res.writeHead(response.status, response?.headers);
    res.end(JSON.stringify(response.data));
  }
}