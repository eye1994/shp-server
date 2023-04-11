# SHP - Simple HTTP Server

![Tests branch parameter](https://github.com/eye1994/shp-server/actions/workflows/node.js.yml/badge.svg?branch=main)

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

### Usage examples

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

#### Reading the request body

The response body is automatically parsed as JSON if the request header content-type: "application/json" is present. If the header is not present the request.body will be set as String. Currently the server can handle only "application/json" or "text/plain" content type, in feature this will be extendable by using a middleware.

```typescript
import { Request, Response } from "shp-server";

server.post("/users/:userId/comments", (request: Request) => {
  const body = request.body;
  return new Response({});
});
```

#### Reading the route params

```typescript
import { Request, Response } from "shp-server";

server.get("/users/:userId/comments", (request: Request) => {
  const { userId } = request.params;
  return new Response({});
});
```

#### Reading the query params

```typescript
import { Request, Response } from "shp-server";

server.get("/users/:userId/comments?q1=a&q2=b&q3=c", (request: Request) => {
  const { q1, q2, q3 } = request.queryParams;
  return new Response({});
});
```

#### Reading the request headers

```typescript
import { Request, Response } from "shp-server";

server.get("/users/:userId/comments", (request: Request) => {
  const headers = request.headers;
  console.log(headers.get("content-type"));
  return new Response({});
});
```

#### Responding with custom headers

```typescript
import { Request, Response } from "shp-server";

server.get("/users/:userId/comments", (request: Request) => {
  const response = new Response();
  response.headers.set("access-control-allow-origin", "*");
  return new Response({});
});
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
