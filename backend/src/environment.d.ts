// src/types/environment.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    SECRET_TOKEN: string;
    PORT: string;
  }
}
