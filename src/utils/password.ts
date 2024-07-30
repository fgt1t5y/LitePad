import { nanoid } from "nanoid";
import md5 from "md5";

export const encryptPassword = (password: string) => {
  if (!password) {
    return { salt: "", encrypted: "" };
  }

  const salt = nanoid(12);
  const encrypted = md5(`${password}_${salt}`) as string;

  return { salt, encrypted };
};
