import http from "http";
import { Response, SHPServer } from "../lib";
import request, { Response as SuperTestResponse } from "supertest";

jest.spyOn(http, "createServer");
const server = new SHPServer();
let httpServer = (http.createServer as jest.Mock).mock.results[0].value;

const getCommentsHandler = jest.fn();
const postCommentsHandler = jest.fn();

const getUsers = jest.fn();
const getUserById = jest.fn();
const postUser = jest.fn();
const putUser = jest.fn();
const deleteUser = jest.fn();

const getPosts = jest.fn();
const getPostById = jest.fn();
const postPost = jest.fn();
const putPost = jest.fn();
const deletePost = jest.fn();

server.get("/users", getUsers);
server.post("/users", postUser);
server.get("/users/:userId", getUserById);
server.put("/users/:userId", putUser);
server.delete("/users/:userId", deleteUser);

server.get("/users/:userId/posts", getPosts);
server.post("/users/:userId/posts", postPost);
server.get("/users/:userId/posts/:postId", getPostById);
server.put("/users/:userId/posts/:postId", putPost);
server.delete("/users/:userId/posts/:postId", deletePost);

server.get("/users/:userId/posts/:postId/comments", getCommentsHandler);
server.post("/users/:userId/posts/:postId/comments", postCommentsHandler);

describe("SHP Server", () => {
  it("should call the getUsers handler when a GET call is made at /users", () => {
    getUsers.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .get("/users")
      .then(() => {
        expect(getUsers).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the postUser handler when a POST call is made at /users", () => {
    postUser.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .post("/users")
      .then(() => {
        expect(postUser).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the getUserById handler when a GET call is made at /users/1", () => {
    getUserById.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .get("/users/1")
      .then(() => {
        expect(getUserById).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the putUser handler when a PUT call is made at /users/1", () => {
    putUser.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .put("/users/1")
      .then(() => {
        expect(putUser).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the deleteUser handler when a DELETE call is made at /users/1", () => {
    deleteUser.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .delete("/users/1")
      .then(() => {
        expect(deleteUser).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the getPosts handler when a GET call is made at /users/1/posts", () => {
    getPosts.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .get("/users/1/posts")
      .then(() => {
        expect(getPosts).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the postPost handler when a POST call is made at /users/1/posts", () => {
    postPost.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .post("/users/1/posts")
      .then(() => {
        expect(postPost).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the getPostById handler when a GET call is made at /users/1/posts/2", () => {
    getPostById.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .get("/users/1/posts/1")
      .then(() => {
        expect(getPostById).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the putPost handler when a PUT call is made at /users/1/posts/2", () => {
    putPost.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .put("/users/1/posts/1")
      .then(() => {
        expect(putPost).toHaveBeenCalledTimes(1);
      });
  });

  it("should call the deletePost handler when a DELETE call is made at /users/1/posts/2", () => {
    deletePost.mockReset().mockReturnValue(new Response({}));
    return request(httpServer)
      .delete("/users/1/posts/1")
      .then(() => {
        expect(deletePost).toHaveBeenCalledTimes(1);
      });
  });

  it("should respond with 404 if the url is not matched by the server", () => {
    return request(httpServer)
      .get("/other")
      .expect("Content-Type", "application/json")
      .expect(404);
  });

  it("should extract the route params from url", () => {
    getCommentsHandler.mockReset().mockResolvedValue(new Response({}));
    return request(httpServer)
      .get("/users/1/posts/2/comments")
      .then(() => {
        expect(getCommentsHandler).toHaveBeenCalledTimes(1);
        const params = getCommentsHandler.mock.calls[0][0].params;
        expect(params.size).toEqual(2);
        expect(params.get("userId")).toEqual("1");
        expect(params.get("postId")).toEqual("2");
      });
  });

  it("should extract the route query params from url", () => {
    getCommentsHandler.mockReset().mockResolvedValue(new Response({}));
    return request(httpServer)
      .get("/users/1/posts/2/comments?q1=a&q2=b&q3=c")
      .then(() => {
        expect(getCommentsHandler).toHaveBeenCalledTimes(1);
        const query = getCommentsHandler.mock.calls[0][0].queryParams;
        expect(query.size).toEqual(3);
        expect(query.get("q1")).toEqual("a");
        expect(query.get("q2")).toEqual("b");
        expect(query.get("q3")).toEqual("c");
      });
  });

  it("should provide the request headers in the request object", () => {
    getCommentsHandler.mockReset().mockResolvedValue(new Response({}));
    return request(httpServer)
      .get("/users/1/posts/2/comments")
      .set("content-type", "application/json")
      .set("accept-language", "en")
      .set("authorization", "token")
      .then(() => {
        expect(getCommentsHandler).toHaveBeenCalledTimes(1);
        const headers = getCommentsHandler.mock.calls[0][0].headers;
        expect(headers.get("content-type")).toEqual("application/json");
        expect(headers.get("accept-language")).toEqual("en");
        expect(headers.get("authorization")).toEqual("token");
      });
  });

  it("should respond with the headers set in the response object", () => {
    const response = new Response({});
    response.headers.set("server", "mock-server");
    response.headers.set("access-control-allow-origin", "*");

    getCommentsHandler.mockReset().mockResolvedValue(response);
    return request(httpServer)
      .get("/users/1/posts/2/comments")
      .expect("server", "mock-server")
      .expect("access-control-allow-origin", "*");
  });

  it("should respond with content type application/json when the response body provided is a Record", () => {
    const response = new Response({ message: "Hello world!" });
    getCommentsHandler.mockReset().mockResolvedValue(response);
    return request(httpServer)
      .get("/users/1/posts/2/comments")
      .expect("content-type", "application/json")
      .expect(200)
      .then((response: SuperTestResponse) => {
        expect(response.body).toEqual({ message: "Hello world!" });
      });
  });

  it("should respond with content type text/plain when the response body provided is a string", () => {
    const response = new Response("Hello world!");
    getCommentsHandler.mockReset().mockResolvedValue(response);
    return request(httpServer)
      .get("/users/1/posts/2/comments")
      .set("accept", "text/plain")
      .expect("content-type", "text/plain")
      .expect(200)
      .then((response: SuperTestResponse) => {
        expect(response.text).toEqual("Hello world!");
      });
  });

  it("should parse the body as JSON when content-type is sent as application/json", () => {
    postCommentsHandler.mockReset().mockResolvedValue(new Response({}));
    return request(httpServer)
      .post("/users/3/posts/6/comments")
      .send({ title: "Lorem Ipsum", comment: "Some comment" })
      .set("content-type", "application/json")
      .then(() => {
        expect(postCommentsHandler).toHaveBeenCalledTimes(1);
        const body = postCommentsHandler.mock.calls[0][0].body;
        expect(body).toEqual({ title: "Lorem Ipsum", comment: "Some comment" });
      });
  });

  it("should parse the body as string when content-type is sent as plain/text", () => {
    postCommentsHandler.mockReset().mockResolvedValue(new Response({}));
    return request(httpServer)
      .post("/users/3/posts/6/comments")
      .send("Hello world!")
      .set("content-type", "plain/text")
      .then(() => {
        expect(postCommentsHandler).toHaveBeenCalledTimes(1);
        const body = postCommentsHandler.mock.calls[0][0].body;
        expect(body).toEqual("Hello world!");
      });
  });

  it("should allow the route handler to return a promise", () => {
    postCommentsHandler
      .mockReset()
      .mockResolvedValue(
        new Promise((resolve) =>
          resolve(new Response({ message: "Hello world!" }))
        )
      );
    return request(httpServer)
      .post("/users/3/posts/6/comments")
      .send({})
      .then((response: SuperTestResponse) => {
        expect(response.body).toEqual({ message: "Hello world!" });
      });
  });
});
