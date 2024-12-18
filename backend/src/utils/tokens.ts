import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AuthError } from "./errors";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/tokens";

const generateAccessToken = ({ id, email }: AccessTokenPayload) => {
  const token = jwt.sign(
    { id, email },
    process.env.JWT_SECRET || "accessSecretFallback",
    {
      expiresIn: 15 * 60,
    }
  );
  return token;
};

const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    // console.log("token received: ", token);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "accessSecretFallback"
    ) as AccessTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthError("Access token has expired", "SESSION_EXPIRED");
    }
    console.error("Error verifying access token: ", error);
    throw new AuthError("Invalid access token", "INVALID_TOKEN");
  }
};

const generateRefreshToken = ({ id }: RefreshTokenPayload) => {
  const refreshToken = jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET || "refreshSecretFallback",
    { expiresIn: "15d" }
  );
  return refreshToken;
};

const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || "refreshSecretFallback"
    ) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthError("Refresh token has expired", "SESSION_EXPIRED");
    }
    throw new AuthError("Invalid refresh token", "INVALID_TOKEN");
  }
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
