# SHP - Simple HTTP Server

![Tests branch parameter](https://github.com/github/docs/actions/workflows/node.js.yml/badge.svg?branch=main)

The scope of the project is to explore how to build a library in NodeJS for creating REST API's without using third party libraries.

### Start example project

```
npm run build:watch
npm start
```

### Run tests

```
npm run test
```

### Usage example

```typescript
const server = new SHPServer();

server.get("/users", () => {
  return new Response([{ id: 1, name: "John Doe" }]);
});
server.get("/users/:userId", () => {
  return new Response({ id: 1, name: "John Doe" });
});

server.get("/users/:userId/comments", () => {
  return new Promise((resolve) => {
    resolve(new Response([]));
  });
});

server.listen(3000);
```

### Features

- [x] Routing with support for nested routes
- [x] Provide the request params inside the Request object
- [x] Provide the query params inside the Request object
- [x] Provide the request body inside the Request object
- [x] Provide Request headers in the Request object
- [x] Allow to respond with custom headers using the Response object
- [ ] Route Middleware that can be mounted at the server level or at a specific route
- [ ] Provide logging middleware
- [ ] Provide CORS middleware
- [ ] Allow routes to be split in multiple files by creating another Route instance that mounts to another route
