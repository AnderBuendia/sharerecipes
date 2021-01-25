const { createReadStream } = require('fs');
const { createServer } = require('http');
const next = require('next');
const { resolve } = require('path');
const { pipeline } = require('stream');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url || '', true);
        const { pathname } = parsedUrl;

        if (pathname === process.env.NEXT_PUBLIC_SERVICE_WORKER_SERVER_PATH) {
            res.setHeader('content-type', 'text/javascript');
            pipeline(
                createReadStream(resolve(__dirname, '../service-worker.js')),
				res,
				err => {
					if (err) console.error('Error', err);
				}    
            );
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(port, () => {
        console.log(
            `Server is ready on ${process.env.NEXT_PUBLIC_SITE_URL} | PORT: ${port}` 
        );
    });
});