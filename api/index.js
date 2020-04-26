const app = require('./app');

const port = process.env.SERVER_PORT;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
