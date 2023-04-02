import { Response } from "./response";
import { Headers } from "./types/headers";

export class JSONResponse extends Response {
  constructor(
      data: unknown,
      status: number = 200, // @todo type
      headers: Headers = {}
    ) {
      super(data, status, headers);
      this.headers["Content-Type"] = "application/json";
    }
}