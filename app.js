import express from 'express';
import { sendBulkEmail } from './mail/nodemail';
const app = express();


app.get("/send", sendBulkEmail)
app.listen(5500, () => {
    console.log("🟢 test MVP running on: http://localhost:5500")
})