export type TIssueType = "bug" | "feature_request";

export type TIssueStatus = "open" | "in_progress" | "resolved";

export type TCreateIssue = {
  title: string;
  description: string;
  type: TIssueType;
};

export type TUpdateIssue = {
  title?: string;
  description?: string;
  type?: TIssueType;
  status?: TIssueStatus;
  reporter_id?: "contributor" | "maintainer";
};
