import { Headers } from "./types/headers";

export class Context {
  headers: Headers;
  
  constructor() {
    this.headers = new Map<string, string | string[] | undefined>();
  }
}

/*

function (request, context) {
  context.headers.set('some-header', 'some-value');
}

function (request, context) {
  context.headers.set('some header', 'some-value');
  return new Response({ }, 404);
}

function (request, context) {
  return new Promise((resolve) => {
    context.header.set("Authrization", "");
    resolve();
  });
}

function (request, context) {
  const token = request.headers.get("Authrization"); 

  if (!token || isInvalidToken(token)) {
    return new Response({ error: "Invalid token" }, 401);
  }

  const { userId } = decodeToken(token);
  return User.findById(userId).then((user) => {
    if (!user) {
      return new Response({ error: "User not found" }, 401);
    }

    ctx.user = user;
  }, () => {
    return new Response({error: "Internal server error" }, 500);
  });
}

*/
