export type TJwtPayload = {
  id: number;
  name: string;
  email: string;
  role: "contributor" | "maintainer";
  iat?: number;
  exp?: number;
};
