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
      throw new AppError(409, "Issue with this title already exists");
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

  getAllIssues: async (sort = "newest", type?: string, status?: string) => {
    let query = `SELECT * FROM issues`;
    const values: string[] = [];
    const conditions: string[] = [];

    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
      ORDER BY created_at
      ${sort === "oldest" ? "ASC" : "DESC"}
    `;

    const issuesResult = await pool.query(query, values);

    const issues = issuesResult.rows;

    const formattedIssues = [];

    for (const issue of issues) {
      const reporterResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id],
      );

      formattedIssues.push({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterResult.rows[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      });
    }

    return formattedIssues;
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
      throw new AppError(404, "Issue not found");
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
      throw new AppError(404, "Issue not found");
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
