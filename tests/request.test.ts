import http from "http";
import { Request } from "../lib/request";

describe("Request", () => {
  it("set the url", () => {
    expect(new Request({ url: "/test" } as http.IncomingMessage).url).toEqual(
      "/test"
    );
  });
});
