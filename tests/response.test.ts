import http from "http";
import { Response } from "../lib/response";

describe("Response", () => {
  it("set the status", () => {
    expect(new Response({ url: "/test" }, { status: 201 }).status).toEqual(201);
  });
});
