import http from "http";

import { Headers } from "./headers";
import { Params } from "./params";
import { RouteMethod } from "./route-method";

export class Request {
  url?: string;
  method?: RouteMethod | undefined;
  params: Params = new Map();
  queryParams: Params = new Map();
  headers?: Headers;

  constructor(req: http.IncomingMessage) {
    this.url = req.url;
    this.method = req.method as RouteMethod | undefined;
  }
}
