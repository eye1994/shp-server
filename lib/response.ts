import { Headers } from "./types/headers";
import { JSONData } from "./types/json-data";
import { ResponseOptions } from "./types/response-options";

export class Response {
  headers: Headers = new Map<string, string | string[] | undefined>();
  status: number = 200;

  constructor(public body: JSONData | string, options: ResponseOptions = {}) {
    const { headers, status } = options;

    if (status) {
      this.status = status;
    }

    if (headers && headers instanceof Map) {
      this.headers = headers;
    } else if (headers) {
      this.headers = new Map(Object.entries(headers));
    }

    if (typeof body !== "string" && !this.headers.has("content-type")) {
      this.headers.set("content-type", "application/json");
    } else if (!this.headers.has("content-type")) {
      this.headers.set("content-type", "text/plain");
    }
  }
}
