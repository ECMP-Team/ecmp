import { config } from "dotenv";

config({ path: ".env.dev" });
export const { PORT, RESEND_API_KEY } = process.env;
