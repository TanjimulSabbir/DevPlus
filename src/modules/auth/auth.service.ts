import bcrypt from "bcrypt";
import { pool } from "../../database";
import { AppError } from "../../utils/app.error";
import { generateToken } from "../../utils/jwt";
import type { TUserLogin, TUserSignup } from "./auth.interface";
import { UserRoles } from "./constant";

export const AuthService = {
  signup: async (payload: TUserSignup) => {
    const { name, email, password, role } = payload;
    const existing = await pool.query(`SELECT id FROM users WHERE email=$1`, [
      email,
    ]);

    if (existing.rows.length > 0) {
      throw new AppError(409, "Email Already Exists", [
        {
          field: "email",
          message: "Email Already Exists",
          code: "DUPLICATE_VALUE",
        },
      ]);
    }
    if (role && !UserRoles.includes(role)) {
      throw new AppError(400, "Invalid role provided.", [
        {
          field: "role",
          message: "Invalid role provided.",
          code: "INVALID_ROLE",
        },
      ]);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at`,
      [name, email, hashPassword, role || "contributor"],
    );
    return result.rows[0];
  },

  login: async (payload: TUserLogin) => {
    const { email, password } = payload;

    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      throw new AppError(404, "User Not Found", [
        {
          field: "email",
          code: "NOT_FOUND",
          message: "user email is not found",
        },
      ]);
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError(401, "Invalid Credentials", [
        {
          field: "password",
          code: "INVALID_PASSWORD",
          message: "password is invalid",
        },
      ]);
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  },
};
