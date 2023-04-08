import http from "http";
import { JSONResponse, RouteMethods, SHPServer } from "../lib";
import { Router } from "../lib/router";
import { Request } from "../lib/request";

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

  it("should let the router handle the request and respond to the http call with the response from handler", () => {
    const server = new SHPServer();
    const request = { url: "/users/1", method: "GET" } as http.IncomingMessage;
    const mockResponse = { writeHead: jest.fn(), end: jest.fn() };
    // @ts-ignore
    const mockRouterInstance = Router.mock.instances[0];
    mockRouterInstance.handleRequest.mockReturnValue(
      new JSONResponse({ test: "testing" }, 201)
    );
    callback(request, mockResponse);
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
          return new JSONResponse({});
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
    "Content-Type": "application/json",
  });
  expect(mockResponse.end).toBeCalledWith(JSON.stringify(body));
}
