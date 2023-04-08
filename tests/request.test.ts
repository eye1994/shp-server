import http from "http";
import { Request } from "../lib/request";

describe("Request", () => {
  it("should set the url", () => {
    expect(new Request({ url: "/test" } as http.IncomingMessage).url).toEqual(
      "/test"
    );
  });

  it("should set correctly the pathname when the url contains query params", () => {
    expect(
      new Request({
        url: "/test?test1=a&test2=b&test3=c",
      } as http.IncomingMessage).pathname
    ).toEqual("/test");
  });

  it("should set the headers from request", () => {
    const headers = new Request({
      url: "/test",
      headers: { "accept-language": "en" },
    } as http.IncomingMessage).headers;
    expect(Object.fromEntries(headers)).toEqual({ "accept-language": "en" });
  });

  it("should parse the query params from the url", () => {
    const query = new Request({
      url: "/test?test1=a&test2=b&test3=c",
    } as http.IncomingMessage).queryParams;

    expect(Object.fromEntries(query)).toEqual({
      test1: "a",
      test2: "b",
      test3: "c",
    });
  });
});
