global.__basedir = __dirname;
const app = require("express")();
require("dotenv").config();
const cors = require("cors");

const routes = require("./routes");
const expressConfig = require("./config/expressConfig");
const dbConfig = require("./config/dbConfig");
const config = require("./config/config");
const http = require('http').createServer(app);

expressConfig(app);
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:4200"],
    })
);
dbConfig()
    .then(() => console.log("DB connected successfuly!"))
    .catch((err) => console.log("DB error! ", err.message));


app.use("/api", routes);

app.listen(process.env.PORT || 3000, console.log(`Listening on port ${process.env.PORT || 3000}!`));
