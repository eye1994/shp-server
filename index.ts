import Router, { RouteMethod } from "./lib/router";
import http from "http";

const router = new Router();
/*
  @TODOS:
  - handle the following case
      insertHandler("/users", "GET", () => {});
      insertHandler("/users/posts", "GET", () => {});
*/

router.insertHandler("/users", "GET", () => {
  console.log("get users, should respond with", [{ id: 1, name: "John Doe" }]);
  return [{ id: 1, name: "John Doe" }];
});
router.insertHandler("/users/:userId", "GET", () => {
  return { id: 1, name: "John Doe" };
});
router.insertHandler("/users/:userId/articles", "GET", () => {
  return [{ id: 1, title: "Mock Article title" }];
});
router.insertHandler("/users/:userId/images", "GET", () => {
  return [{ id: 1, imageUrl: "//mock-url", title: "Mock Title" }];
});
router.insertHandler("/users/:userId/posts/:postId/comments", "GET", () => {
  return [{ id: 1, comment: "lorem ipsum", user_id: 1 }];
});
router.insertHandler("/users/:userId/posts/:postId/comments", "POST", () => {
  return { id: 1, comment: "lorem ipsum", user_id: 1 };
});

router.handleRequest("/users/11", "GET");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (!url || !method) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({}));
    return;
  }

  const response = router.handleRequest(url, method as RouteMethod);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(response));
});
server.listen(3000);
