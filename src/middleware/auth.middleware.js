const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ error: "Nenhum token encontrado" });

  const parts = authHeader.split(" ");

  if (parts.length < 2)
    return res.status(401).send({ error: "Token inválido" });

  const [scheme, token] = parts;

  if (!/^Bearer/.test(scheme))
    return res.status(401).send({ error: "Token mal formatado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token inválido" });
    req.user = decoded.user;
    return next();
  });
};
