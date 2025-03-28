import { config } from "dotenv";

config({ path: ".env.dev" });
export const { PORT, RESEND_API_KEY, MAX_FILE_SIZE } = process.env;
