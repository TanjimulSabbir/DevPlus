export type TUserSignup = {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
};

export type TUserLogin={
    email:string,
    password:string
}

