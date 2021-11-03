"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const path_1 = require("path");
const stream_1 = require("stream");
const url_1 = require("url");
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3001;
app.prepare().then(() => {
    (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url || '', true);
        const { pathname } = parsedUrl;
        if (pathname === process.env.NEXT_PUBLIC_SERVICE_WORKER_SERVER_PATH) {
            res.setHeader('content-type', 'text/javascript');
            (0, stream_1.pipeline)((0, fs_1.createReadStream)((0, path_1.resolve)(__dirname, '../service-worker.js')), res, (err) => {
                if (err)
                    console.error('Error', err);
            });
        }
        else {
            handle(req, res, parsedUrl);
        }
    }).listen(port, () => {
        console.log(`Server is ready on ${process.env.NEXT_PUBLIC_SITE_URL} | PORT: ${port}`);
    });
});
