import { createReadStream } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import next from 'next';
import { resolve } from 'path';
import { pipeline } from 'stream';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3001;

app.prepare().then(() => {
  createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    const { pathname } = parsedUrl;

    if (pathname === process.env.NEXT_PUBLIC_SERVICE_WORKER_SERVER_PATH) {
      res.setHeader('content-type', 'text/javascript');
      pipeline(
        createReadStream(resolve(__dirname, '../service-worker.js')),
        res,
        (err) => {
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
