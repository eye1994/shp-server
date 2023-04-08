export type ResponseOptions = {
  status?: number;
  headers?:
    | Map<string, string | string[] | undefined>
    | { [key: string]: string | string[] | undefined };
};
