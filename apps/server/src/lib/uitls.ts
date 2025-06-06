import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const secret = (process.env.JWT_SECRET as string) || "secret";

const issueToken = (id: number, roleId: string): string => {
  const token = sign({ id, roleId }, secret);
  return token;
};

const verifyToken = (token: string): any => {
  try {
    return verify(token, secret);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

const hashedPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};

const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Password comparison failed");
  }
};

export { hashedPassword, comparePassword, issueToken, verifyToken };
