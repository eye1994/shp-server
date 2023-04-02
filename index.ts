import Router from "./lib/router";

const router = new Router();

/*
  @TODOS:
  - handle the following case
      insertHandler("/users", "GET", () => {});
      insertHandler("/users/posts", "GET", () => {});
*/

router.insertHandler("/users", "GET", () => {
  console.log("GET users");
});
router.insertHandler("/users/:userId", "GET", () => {
  console.log("GET users/:userId");
});
router.insertHandler("/users/:userId/articles", "GET", () => {
  console.log("GET user articles");
});
router.insertHandler("/users/:userId/images", "GET", () => {
  console.log("GET user images");
});
router.insertHandler("/users/:userId/posts/:postId/comments", "GET", () => {
  console.log("GET user posts comment");
});
router.insertHandler("/users/:userId/posts/:postId/comments", "POST", () => {
  console.log("POST user posts comments");
});

router.handleRequest("/users/11", "GET");
