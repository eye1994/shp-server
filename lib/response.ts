import http from "http";

export type Headers = Map<string, string | number>;

export type JSONData =
  | {
      [key: string]: string | number | JSONData | undefined | null;
    }
  | JSONData[]
  | string[]
  | number[];

export type ResponseBody = string | {} | ResponseBody[];

export type ResponseOptions = {
  status?: number;
  headers?: Map<string, string | number> | { [key: string]: string | number };
};

export class Response {
  headers: Headers = new Map<string, string | number>();
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

    if (typeof body !== "string" && !this.headers.has("Content-Type")) {
      this.headers.set("Content-Type", "application/json");
    }
  }
}
