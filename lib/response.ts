import { Headers } from "./types/headers";

export class Response {
  constructor(
    public body: any,
    public status: number, // @tood type
    public headers: Headers = {}
  ) {
  }
}