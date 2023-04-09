import http from "http";
import { Router } from "../lib/router";
import { RouteMethods } from "./../lib";
import { Response } from "../lib/response";
import { createRequestObject } from "./helpers/create-request-object";

/*
  @Todo:
  - Test and implement the following scenario GET /users/:id  GET /users/image it should handle correctly both cases
  - Test that the correct route params ar passed to the handler
  - Test that the query params ar parsed correctly and passed to the handler
*/

describe("Router", () => {
  const getUsersHandler = jest.fn();
  const getUserHandler = jest.fn();
  const putUserHandler = jest.fn();
  const postUserHandler = jest.fn();
  const deleteUserHandler = jest.fn();
  const getArticlesHandler = jest.fn();
  const getImagesHandler = jest.fn();
  const getPostCommentsHandler = jest.fn();
  const postPostCommentsHandler = jest.fn();

  const router = new Router();

  router.insertHandler("/users", RouteMethods.GET, getUsersHandler);
  router.insertHandler("/users", RouteMethods.POST, postUserHandler);
  router.insertHandler("/users/:userId", RouteMethods.GET, getUserHandler);
  router.insertHandler("/users/:userId", RouteMethods.PUT, putUserHandler);
  router.insertHandler(
    "/users/:userId",
    RouteMethods.DELETE,
    deleteUserHandler
  );

  router.insertHandler(
    "/users/:userId/articles",
    RouteMethods.GET,
    getArticlesHandler
  );
  router.insertHandler(
    "/users/:userId/images",
    RouteMethods.GET,
    getImagesHandler
  );

  router.insertHandler(
    "/users/:userId/posts/:postId/comments",
    RouteMethods.GET,
    getPostCommentsHandler
  );

  router.insertHandler(
    "/users/:userId/posts/:postId/comments",
    RouteMethods.POST,
    postPostCommentsHandler
  );

  it("should respond with 404 when the url is missing from the request object", async () => {
    const response = await router.handleRequest({
      method: "GET",
    } as http.IncomingMessage);
    expect(response.body).toEqual({});
    expect(response.status).toEqual(404);
  });

  it("should respond with 404 when the method is missing from the request object", async () => {
    const response = await router.handleRequest({
      url: "/users",
    } as http.IncomingMessage);
    expect(response.body).toEqual({});
    expect(response.status).toEqual(404);
  });

  describe("user CRUD requests", () => {
    it("should call the getUsersHandler when a GET request is made at /users", async () => {
      await router.handleRequest(
        createRequestObject("/users", RouteMethods.GET)
      );
      expect(getUsersHandler).toHaveBeenCalledTimes(1);
    });

    it("should call the postUserHandler when a POST request is made at /users", async () => {
      await router.handleRequest(
        createRequestObject("/users", RouteMethods.POST, {
          test: "testing",
        })
      );
      expect(postUserHandler).toHaveBeenCalledTimes(1);
      expect(postUserHandler.mock.calls[0][0].body).toEqual({
        test: "testing",
      });
    });

    it("should call the getUserHandler when a GET request is made at /users/:userId", async () => {
      await router.handleRequest(
        createRequestObject("/users/111", RouteMethods.GET)
      );
      expect(getUserHandler).toHaveBeenCalledTimes(1);
    });

    it("should call the putUserHandler when a PUT request is made at /users/:userId", async () => {
      await router.handleRequest(
        createRequestObject("/users/111", RouteMethods.PUT, {})
      );
      expect(putUserHandler).toHaveBeenCalledTimes(1);
    });

    it("should call the deleteUserHandler when a DELETE request is made at /users/:userId", async () => {
      await router.handleRequest(
        createRequestObject("/users/111", RouteMethods.DELETE, {})
      );
      expect(deleteUserHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("nested routes", () => {
    it("should call the getArticlesHandler when a GET request is mate at /users/:userId/articles", async () => {
      await router.handleRequest(
        createRequestObject("/users/111/articles", RouteMethods.GET)
      );
      expect(getArticlesHandler).toHaveBeenCalledTimes(1);
    });

    it("should call the getImagesHandler when a GET request is mate at /users/:userId/images", async () => {
      await router.handleRequest(
        createRequestObject("/users/111/images", RouteMethods.GET)
      );
      expect(getImagesHandler).toHaveBeenCalledTimes(1);
    });

    it("should call the getPostCommentsHandler when a GET request is mate at /users/:userId/posts/:postId/comments", async () => {
      await router.handleRequest(
        createRequestObject("/users/222/posts/1/comments", RouteMethods.GET)
      );
      expect(getPostCommentsHandler).toHaveBeenCalledTimes(1);
    });

    it("should call the postPostCommentsHandler when a POST request is mate at /users/:userId/posts/:postId/comments", async () => {
      await router.handleRequest(
        createRequestObject(
          "/users/222/posts/1/comments",
          RouteMethods.POST,
          {}
        )
      );
      expect(postPostCommentsHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("route params", () => {
    it("should extract the parameters from route and make them available in the Request param", async () => {
      getPostCommentsHandler.mockReset();
      await router.handleRequest(
        createRequestObject("/users/222/posts/1/comments", RouteMethods.GET)
      );
      const request = getPostCommentsHandler.mock.calls[0][0];
      const params = request.params;
      expect(params.size).toEqual(2);
      expect(params.get("userId")).toEqual("222");
      expect(params.get("postId")).toEqual("1");
    });
  });

  describe("query params", () => {
    it("should match correctly the route handler when the url contains query params", async () => {
      getPostCommentsHandler.mockReset();
      await router.handleRequest(
        createRequestObject(
          "/users/222/posts/1/comments?q1=a&q2=b&q3=c",
          RouteMethods.GET
        )
      );
      expect(getPostCommentsHandler).toHaveBeenCalledTimes(1);
    });

    it("should extract the query params and passed them in the request object", async () => {
      getPostCommentsHandler.mockReset();
      await router.handleRequest(
        createRequestObject(
          "/users/222/posts/1/comments?q1=a&q2=b&q3=c",
          RouteMethods.GET
        )
      );
      const request = getPostCommentsHandler.mock.calls[0][0];
      const query = request.queryParams;

      expect(query.size).toEqual(3);
      expect(query.get("q1")).toEqual("a");
      expect(query.get("q2")).toEqual("b");
      expect(query.get("q3")).toEqual("c");
    });
  });

  describe("promise handler", () => {
    it("should wait for the returned promise to resolve", async () => {
      getPostCommentsHandler.mockImplementation(() => {
        return new Promise((resolve) =>
          resolve(new Response({ text: "Hello world" }))
        );
      });
      await router.handleRequest(
        createRequestObject("/users/222/posts/1/comments", RouteMethods.GET)
      );
      expect(postUserHandler.mock.calls[0][0].body).toEqual({
        test: "testing",
      });
    });
  });
});
