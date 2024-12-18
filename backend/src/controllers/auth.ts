import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../config/validation";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";
import { AuthError, ValidationError } from "../utils/errors";

const handleRegister = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword)
    throw new ValidationError("Password and confirm password don't match");

  const parseResult = registerSchema.safeParse({
    email,
    password,
    confirm: confirmPassword,
  });

  if (!parseResult.success) {
    const errors = parseResult.error.flatten().fieldErrors;
    console.log(parseResult.error.flatten());
    throw new ValidationError(
      Object.values(errors).flat()[0] || "Validation Error"
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AuthError(
        "User with this email already exists",
        "EMAIL_ALREADY_EXISTS"
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    // console.log("signup error: ", error);
    throw error;
  }
};

const handleLogin = async (email: string, password: string) => {
  const parseResult = loginSchema.safeParse({
    email,
    password,
  });

  if (!parseResult.success) {
    const errors = parseResult.error.flatten().fieldErrors;
    // console.log(parseResult.error.flatten());
    throw new ValidationError(
      Object.values(errors).flat()[0] || "Validation Error"
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new AuthError(
        "User with this email doesn't exist",
        "INVALID_CREDENTIALS"
      );

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
      });
      const refreshToken = generateRefreshToken({ id: user.id });
      await prisma.user.update({
        where: { email: user.email },
        data: { refreshToken },
      });
      return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, username: user.username },
      };
    } else {
      throw new AuthError("Incorrect Password", "INVALID_CREDENTIALS");
    }
  } catch (error) {
    console.log("login error: ", error);
    throw error;
  }
};

const handleLogout = async (id: string) => {
  await prisma.user.update({
    where: { id },
    data: {
      refreshToken: null,
    },
  });
};

const reassignAccessToken = async (refreshToken: string) => {
  const oldDecoded = verifyRefreshToken(refreshToken);
  const id = oldDecoded.id;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || refreshToken !== user.refreshToken)
    throw new AuthError("Failed to Verify Token", "INVALID_TOKEN");

  return generateAccessToken({ id: user.id, email: user.email });
};

const getCurrentUser = async (token: string) => {
  const decoded = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { username: true, email: true },
  });
  if (!user) {
    throw new AuthError(
      "User doesn't exist or is unauthenticated",
      "INVALID_CREDENTIALS"
    );
  }
  return user;
};
export {
  handleRegister,
  handleLogin,
  handleLogout,
  reassignAccessToken,
  getCurrentUser,
};
