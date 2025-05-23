// vite.js

import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Helpers to get __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Logger setup
const viteLogger = createLogger();

export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Sets up Vite middleware in development mode
 * @param {import("express").Express} app 
 * @param {import("http").Server} server 
 */
export async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false, // avoid reloading config
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1); // Exit on fatal vite error
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;

      const clientTemplatePath = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplatePath, "utf-8");

      // Add a unique nanoid to force reload frontend
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const transformedHtml = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(transformedHtml);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

/**
 * Serves static files in production mode
 * @param {import("express").Express} app 
 */
export function serveStatic(app) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Make sure to build the client first.`
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
