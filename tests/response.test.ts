import { Response } from "../lib/response";

describe("Response", () => {
  it("set the status", () => {
    expect(new Response({ test: "testing" }, { status: 201 }).status).toEqual(
      201
    );
  });

  it("should default the status to 200", () => {
    expect(new Response({ test: "testing" }).status).toEqual(200);
  });

  it("should set the headers when passed in the options as Record type", () => {
    const response = new Response(
      { test: "testing" },
      { headers: { "accept-language": "en" } }
    );
    expect(response.headers.get("accept-language")).toEqual("en");
  });

  it("should set the headers when passed in the options as Map type", () => {
    const response = new Response(
      { test: "testing" },
      { headers: new Map([["accept-language", "en-US"]]) }
    );
    expect(response.headers.get("accept-language")).toEqual("en-US");
  });

  it("should set the content-type header as application/json when the body is a Record type", () => {
    const response = new Response({ test: "testing" });
    expect(response.headers.get("content-type")).toEqual("application/json");
  });

  it("should keep the original content-type header when is passed in the options", () => {
    const response = new Response(
      { test: "testing" },
      { headers: { "content-type": "text/plain" } }
    );
    expect(response.headers.get("content-type")).toEqual("text/plain");
  });

  it("should set the content-type header to text/plain when the body is a string", () => {
    const response = new Response("Hello world!");
    expect(response.headers.get("content-type")).toEqual("text/plain");
  });
});
