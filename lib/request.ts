import http from "http";
import url from "url";
import { RouteMethods } from "./types";

import { Headers } from "./types/headers";
import { JSONData } from "./types/json-data";
import { Params } from "./types/params";
import { RouteMethod } from "./types/route-method";

export class Request {
  body?: string | JSONData;
  url?: string;
  pathname?: string;
  method?: RouteMethod | undefined;
  headers: Headers = new Map<string, string | string[] | undefined>();
  params: Params = new Map<string, string>();
  queryParams: Params = new Map();

  constructor(req: http.IncomingMessage) {
    const { pathname, query } = url.parse(req.url || "", true);

    this.method = req.method as RouteMethod | undefined;
    this.url = req.url || "";
    this.pathname = pathname || "";

    if (query) {
      this.queryParams = new Map(Object.entries(query));
    }

    if (req.headers) {
      this.headers = new Map(Object.entries(req.headers));
    }
  }
}

export const readBody = async (req: http.IncomingMessage): Promise<string> => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  return Buffer.concat(buffers).toString();
};

export const createResponse = async (
  req: http.IncomingMessage
): Promise<Request> => {
  const request = new Request(req);

  if (request.method !== RouteMethods.GET) {
    request.body = await readBody(req);
  }

  if (
    request.headers.get("content-type")?.includes("application/json") &&
    request.body
  ) {
    request.body = JSON.parse(request.body as string);
  }

  return request;
};
