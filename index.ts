import { SHPServer, JSONResponse, Request } from "./lib";

const server = new SHPServer();

server.get("/users", () => {
  return new JSONResponse([{ id: 1, name: "John Doe" }]);
});
server.get("/users/:userId", () => {
  return new JSONResponse({ id: 1, name: "John Doe" });
});
server.get("/users/:userId/articles", (request: Request) => {
  throw new Error("test server error");
  return new JSONResponse([{ id: request.params.get('userId'), title: "Mock Article title" }]);
});
server.get("/users/:userId/images", () => {
  return new JSONResponse([{ id: 1, imageUrl: "//mock-url", title: "Mock Title" }]);
});
server.get("/users/:userId/posts/:postId/comments", () => {
  return new JSONResponse([{ id: 1, comment: "lorem ipsum", user_id: 1 }]);
});
server.post("/users/:userId/posts/:postId/comments", () => {
  return new JSONResponse({ id: 1, comment: "lorem ipsum", user_id: 1 });
});

server.listen(3000);
