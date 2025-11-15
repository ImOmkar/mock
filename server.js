// server.js
const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  static: "public" // if you want to serve static files
});

// enable CORS so your frontend (Vercel/ngrok) can call it
server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Example: add createdAt automatically on POST to /content
server.post("/content", (req, res, next) => {
  if (!req.body.createdAt) {
    req.body.createdAt = new Date().toISOString();
  }
  // ensure views default
  if (typeof req.body.views === "undefined") {
    req.body.views = 0;
  }
  next();
});

// (Optional) simple bookmark endpoints skeleton if you used them in frontend
server.post("/content/:id/bookmark", (req, res) => {
  // non-persistent - json-server cannot reliably persist custom logic,
  // but keep endpoint so frontend doesn't fail. Return 200.
  res.status(200).json({ success: true });
});
server.delete("/content/:id/bookmark", (req, res) => {
  res.status(200).json({ success: true });
});

// mount router (db.json)
server.use(router);

// start server (Render will use 'npm start')
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
