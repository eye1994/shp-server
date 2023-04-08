import http from "http";
import { Readable } from "stream";
import { JSONData } from "../../lib/types/json-data";

export const createRequestObject = (
  url: string,
  method: string,
  body?: JSONData
) => {
  if (body) {
    const req = Readable.from(
      Buffer.from(JSON.stringify(body))
    ) as http.IncomingMessage;
    req.url = url;
    req.method = method;
    req.headers = { "content-type": "application/json" };
    return req;
  }

  return {
    url,
    method,
  } as http.IncomingMessage;
};
