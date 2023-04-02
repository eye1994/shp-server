import { Response } from "./response";
import { Headers } from "./types/headers";

export class JSONResponse extends Response {
  constructor(
      body: unknown,
      status: number = 200, // @todo type
      headers: Headers = {}
    ) {
      super(body, status, headers);
      this.headers["Content-Type"] = "application/json";
    }
}