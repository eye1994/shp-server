import { Request } from "./../request";
import { Response } from "../response";
import { Context } from "../context";

/*
  request: Request 
  context: Context { headers } & T where T is the ContextType 
  provided when the server was created


  When Response or a Promise<Response> is returned the server will respond
  and the other middlewares or route handlers are not called

  If void or Promise<void> is returned the next middlewares
  and handlers are called

*/
export type RouteMiddleware = (request: Request, context: Context) => Response | Promise<Response> | Promise<void> | void;
