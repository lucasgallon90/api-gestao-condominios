const { connect } = require("./database");
connect();
const app = require("./app.js");
const PORT = process.env.PORT || 8001;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}
