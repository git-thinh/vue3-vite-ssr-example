import { createSSRApp } from 'vue'
import renderer from '@vue/server-renderer';
import App from './App.vue'
import createRouter from './router'
import config from './config';
const express = require('express');
const path = require('path');
const server = express();

server.use('/_assets', express.static(path.join(__dirname, '../../client/_assets')));

server.get('*', (req, res) => {
    console.log(req.url);

    const router = createRouter();
    const app = createSSRApp(App);
    app.use(router);
    router.push(req.url)
    router.isReady().then(() => {
        if (router.currentRoute.value.matched.length === 0) {
            res.end();
            return;
        }
        ;
        (async () => {
            const html = await renderer.renderToString(app)
            //res.end(`__HTML__`)
            const s = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
    <link href="/_assets/style.541a243f.css" rel="stylesheet" />
</head>
<body>
  ` + html + `
    <script type="module" src="/_assets/entry-client.0d5a7a4a.js"></script>
</body>
</html>`;
            res.end(s);
        })()
    });
})

console.log(`started server on port ${config.port}`);
server.listen(config.port);