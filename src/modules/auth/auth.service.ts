import { pool } from "../../database";
import { AppError } from "../../utils/app.error";

const AuthService = () => {
  signup: async <T>(payload: T) => {
    const {name, email, password, role}=payload;
    const existing=await pool.query(`
        SELECT id FROM users WHERE email=$1`,[email]);

        if(existing.rows.length>0){
            throw new AppError(409, "Email Already Exists")
        }
  };
};




