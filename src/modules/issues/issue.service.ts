import { pool } from "../../database";
import { AppError } from "../../utils/app.error";
import type { TCreateIssue, TUpdateIssue } from "./issue.interface";

export const IssueService = {
  createIssue: async (payload: TCreateIssue, reporterId: number) => {
    const { title, description, type } = payload;

    const existing = await pool.query(
      `SELECT id FROM issues WHERE title = $1`,
      [title],
    );

    if (existing.rows.length > 0) {
      throw new AppError(409, "Issue with this title already exists", [
        {
          field: "title",
          message: "This title is already taken. Please use a unique title.",
          code: "DUPLICATE_VALUE",
        },
      ]);
    }

    const result = await pool.query(
      `
      INSERT INTO issues
      (title, description, type, reporter_id)

      VALUES ($1, $2, $3, $4)

      RETURNING *
      `,
      [title, description, type, reporterId],
    );

    return result.rows[0];
  },

  getAllIssues: async (
    sort: "newest" | "oldest" = "newest",
    type?: string,
    status?: string,
  ) => {
    let query = `
    SELECT 
      i.id,
      i.title,
      i.description,
      i.type,
      i.status,
      i.created_at,
      i.updated_at,
      u.id AS reporter_id,
      u.name AS reporter_name,
      u.role AS reporter_role
    FROM issues i
    LEFT JOIN users u ON i.reporter_id = u.id
  `;

    const values: any[] = [];
    const conditions: string[] = [];

    // Filters
    if (type) {
      values.push(type);
      conditions.push(`i.type = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`i.status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Sorting
    query += ` ORDER BY i.created_at ${sort === "oldest" ? "ASC" : "DESC"}`;

    const result = await pool.query(query, values);
    const rows = result.rows;

    if (rows.length === 0) {
      throw new AppError(404, "No issues found", [
        {
          field: "issues",
          message: "No issues match the given filters",
          code: "NOT_FOUND",
        },
      ]);
    }

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      status: row.status,
      reporter: row.reporter_id
        ? {
            id: row.reporter_id,
            name: row.reporter_name,
            role: row.reporter_role,
          }
        : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  },
  getSingleIssue: async (id: number) => {
    const issueResult = await pool.query(
      `
      SELECT * FROM issues
      WHERE id = $1
      `,
      [id],
    );

    if (issueResult.rows.length === 0) {
      throw new AppError(404, "Issue not found", [
        {
          field: "issues",
          message: "Issue not found",
          code: "NOT_FOUND",
        },
      ]);
    }

    const issue = issueResult.rows[0];

    const reporterResult = await pool.query(
      `
      SELECT id, name, role
      FROM users
      WHERE id = $1
      `,
      [issue.reporter_id],
    );

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterResult.rows[0],
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  },

  updateIssue: async (issueId: number, payload: TUpdateIssue, user: any) => {
    const issueResult = await pool.query(
      `
      SELECT * FROM issues
      WHERE id = $1
      `,
      [issueId],
    );

    if (issueResult.rows.length === 0) {
      throw new AppError(404, "Issue not found", [
        {
          field: "issues",
          message: "Issue not found",
          code: "NOT_FOUND",
        },
      ]);
    }

    const issue = issueResult.rows[0];

    // contributor rules
    if (user.role === "contributor") {
      if (issue.reporter_id !== user.id) {
        throw new AppError(403, "You are not allowed to update this issue");
      }

      if (issue.status !== "open") {
        throw new AppError(409, "Only open issues can be updated");
      }
    }

    const { title, description, type, status } = payload;

    const updatedResult = await pool.query(
      `
      UPDATE issues
      SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      status = COALESCE($4, status),
      updated_at = CURRENT_TIMESTAMP

      WHERE id = $5

      RETURNING *
      `,
      [title, description, type, status, issueId],
    );

    return updatedResult.rows[0];
  },

  deleteIssue: async (issueId: number) => {
    const issueResult = await pool.query(
      `
      SELECT * FROM issues
      WHERE id = $1
      `,
      [issueId],
    );

    if (issueResult.rows.length === 0) {
      throw new AppError(404, "Issue not found");
    }

    await pool.query(
      `
      DELETE FROM issues
      WHERE id = $1
      `,
      [issueId],
    );

    return null;
  },
};
