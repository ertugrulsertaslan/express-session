import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import RedisStore from "connect-redis";
import redis from "redis";
const app = express();

const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});
redisClient.connect().catch(console.error);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "somesecret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
      secure: false,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (req.session.userid) {
    res.json({ message: `Hello, ${req.session.userid}` });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" || password === "admin") {
    req.session.userid = username;
    const sessionId = req.session.id;
    try {
      console.log(`Session ID: ${sessionId}`);
    } catch (err) {
      console.error("Error fetching session from Redis:", err);
    }
    res.json({ userid: req.session.userid });
  } else {
    return res.status(401).send("Invalid username or password");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.sendStatus(200);
  });
});

app.listen(5000, () => {
  console.log(`Server Running at port 5000`);
});
