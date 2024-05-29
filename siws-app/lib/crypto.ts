import { createHash, randomBytes  } from "crypto";

export const hashToken = (
  token: string,
  {
    noSecret = false,
  }: {
    noSecret?: boolean;
  } = {},
) => {
  return createHash("sha256")
    .update(`${token}${noSecret ? "" : process.env.NEXTAUTH_SECRET}`)
    .digest("hex");
};

export const hashBytes = (length: number) => {
  return randomBytes(length).toString("hex");
}