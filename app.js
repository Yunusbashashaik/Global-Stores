/**
 * GoDaddy / cPanel Application Manager startup file.
 * Set "Application startup file" to app.js
 */
import { app, startServer } from "./server/src/index.js";

export default app;
startServer();
