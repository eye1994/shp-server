import { SHPServer, Request } from "./../lib";
import { Response } from "./../lib/response";

const server = new SHPServer();

server.get("/users", () => {
  return new Response([{ id: 1, name: "John Doe" }]);
});
server.get("/users/:userId", () => {
  return new Response({ id: 1, name: "John Doe" });
});
server.get("/users/:userId/articles", (request: Request) => {
  throw new Error("test server error");
});
server.get("/users/:userId/images", () => {
  return new Response([{ id: 1, imageUrl: "//mock-url", title: "Mock Title" }]);
});
server.get("/users/:userId/posts/:postId/comments", () => {
  return new Response([{ id: 1, comment: "lorem ipsum", user_id: 1 }]);
});
server.post("/users/:userId/posts/:postId/comments", () => {
  return new Response({ id: 1, comment: "lorem ipsum", user_id: 1 });
});

server.listen(3000);
