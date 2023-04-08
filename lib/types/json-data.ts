export type JSONData =
  | {
      [key: string]: string | number | JSONData | undefined | null;
    }
  | JSONData[]
  | string[]
  | number[];
