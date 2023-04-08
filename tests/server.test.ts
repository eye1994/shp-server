import http from "http";
import { Response, RouteMethods, SHPServer } from "../lib";
import { Router } from "../lib/router";
import { Request } from "../lib/request";
import { createRequestObject } from "./helpers/create-request-object";

jest.mock("../lib/router");

let callback: any;
const serverMock = { listen: jest.fn() };

jest.mock("http", () => ({
  createServer: jest.fn((fn) => {
    callback = fn;
    return serverMock;
  }),
}));

describe("SHPServer", () => {
  beforeEach(() => {
    // @ts-ignore
    Router.mockReset();
  });

  it("should create a new http server", () => {
    const server = new SHPServer();
    expect(http.createServer).toHaveBeenCalled();
  });

  it("should let the router handle the request and respond to the http call with the response from handler", async () => {
    const server = new SHPServer();
    const request = createRequestObject("/usesrs/1", RouteMethods.GET);
    const mockResponse = { writeHead: jest.fn(), end: jest.fn() };
    // @ts-ignore
    const mockRouterInstance = Router.mock.instances[0];
    const handlerResponse = new Promise((resolve) =>
      resolve(new Response({ test: "testing" }, { status: 201 }))
    );
    mockRouterInstance.handleRequest.mockReturnValue(handlerResponse);
    callback(request, mockResponse);
    await handlerResponse;
    expect(mockRouterInstance.handleRequest).toBeCalledTimes(1);
    expect(mockRouterInstance.handleRequest).toHaveBeenCalledWith(request);
    expectJSONResponse({ test: "testing" }, 201, mockResponse);
  });

  describe("listen() ", () => {
    it("should start the http server on port 3000", () => {
      const server = new SHPServer();
      server.listen(3000);
      expect(serverMock.listen).toBeCalledWith(3000);
    });
  });

  Object.keys(RouteMethods).forEach((method) => {
    describe(`${method.toLowerCase()}() `, () => {
      it("should insert a new handler on the router", () => {
        const handler = (req: Request) => {
          return new Response({});
        };

        const server = new SHPServer();

        // @ts-ignore
        const mockRouterInstance = Router.mock.instances[0];
        // @ts-ignore
        server[method.toLowerCase()]("/users/:userId/posts", handler);
        expect(mockRouterInstance.insertHandler).toHaveBeenCalledWith(
          "/users/:userId/posts",
          method,
          handler
        );
      });
    });
  });
});

function expect404Response(response: {
  writeHead: jest.Mock<any, any, any>;
  end: jest.Mock<any, any, any>;
}) {
  expectJSONResponse({}, 404, response);
}

function expectJSONResponse(
  body: unknown,
  status: number,
  mockResponse: {
    writeHead: jest.Mock<any, any, any>;
    end: jest.Mock<any, any, any>;
  }
) {
  expect(mockResponse.writeHead).toBeCalledTimes(1);
  expect(mockResponse.end).toBeCalledTimes(1);
  expect(mockResponse.writeHead).toBeCalledWith(status, {
    "content-type": "application/json",
  });
  expect(mockResponse.end).toBeCalledWith(JSON.stringify(body));
}
