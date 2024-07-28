import { nanoid } from "nanoid";
import md5 from "md5";

export const encryptPassword = (password: string) => {
  const salt = nanoid(12);
  const encrypted = md5(`${password}_${salt}`) as string;

  return { salt, encrypted };
};
