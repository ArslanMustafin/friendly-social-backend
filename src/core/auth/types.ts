export type PayloadType = {
  email: string;
};
export type PayloadJwtType = PayloadType & {
  iat: number;
  exp: number;
};
