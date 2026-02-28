import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AppJwtPayload {
  userId: number;
  email: string;
  name: string;
}

export const signAccessToken = (payload: AppJwtPayload): string => {
  return jwt.sign(
    payload,
    config.JWT_ACCESS_SECRET as string,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    }
  );
};

export const signRefreshToken = (payload: AppJwtPayload): string => {
  return jwt.sign(
    payload,
    config.JWT_REFRESH_SECRET as string,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    }
  );
};

export const verifyAccessToken = (token: string): AppJwtPayload => {
  return jwt.verify(
    token,
    config.JWT_ACCESS_SECRET as string
  ) as AppJwtPayload;
};

export const verifyRefreshToken = (token: string): AppJwtPayload => {
  return jwt.verify(
    token,
    config.JWT_REFRESH_SECRET as string
  ) as AppJwtPayload;
};