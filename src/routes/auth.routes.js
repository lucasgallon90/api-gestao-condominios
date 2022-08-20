var express = require("express");
var router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../repositories/usuario.repository");
const {
  register,
  authenticate,
  authenticateGoogle,
  success,
  failed,
  userInfo,
} = require("../controllers/auth.controller");
const { messages } = require("joi-translation-pt-br");
const UsuarioDTO = require("../database/dtos/usuario.dto.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const { celebrate } = require("celebrate");

router.post(
  "/login/local",
  /* #swagger.tags = ['Autenticação']
  #swagger.parameters['body'] = { in: 'body', description: 'Usuário - Email', type: 'string',  schema: {
                    $email: 'joaquim@gestaodecondominios.com.br',
                    $senha: '123',
                }}
  */
  async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      try {
        if (err || !user || info) {
          return res
            .status(401)
            .json({ error: info?.message || "Credenciais incorretas" });
        }
        const token = generateToken({ user });

        return res.json({ token, user });
      } catch (error) {
        return res.status(500).json({ error: "Erro ao processar o login" });
      }
    })(req, res, next);
  }
);

router.get(
  "/login/google",
  /* #swagger.tags = ['Autenticação']
   */
  passport.authenticate("google", { scope: ["email"] })
);

router.get(
  "/register/google",
  /* #swagger.tags = ['Autenticação']
   */
  passport.authenticate("register-google", { scope: ["email"] })
);

router.get(
  "/login/google/callback",
  /* #swagger.tags = ['Autenticação']
   */
  passport.authenticate("google", {
    //successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/login?failedlogin=true`,
  }),
  function (req, res) {
    const token = generateToken({ user: req.user });
    return res.redirect(`${process.env.CLIENT_URL}/?oauthtoken=` + token);
  }
);

router.get(
  "/register/google/callback",
  /* #swagger.tags = ['Autenticação']
   */
  passport.authenticate("register-google", {
    //successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/login?failedregister=true`,
  }),
  function (req, res) {
    const { user } = req;
    res.redirect(
      `${process.env.CLIENT_URL}/register?id=${user?.id}&email=${user?.email}`
    );
  }
);

router.post(
  "/register",
  celebrate(
    {
      body: UsuarioDTO,
    },
    {
      messages: messages,
    }
  ),
  /* #swagger.tags = ['Autenticação']
  #swagger.parameters['body'] = { in: 'body', description: 'Registrar usuário', type: 'string',  schema: {
                      $nome: "Olavo M.",
                      email: "olavo@mockgestaocondominios.com",
                      $senha: "123",
                      telefone: "51900000000",
                      $apto: "201",
                      bloco:"A",
                      googleId: "18098ca98s7c89a7sc7123",
                }}
  */
  register
);

router.get(
  "/authenticate",
  /* #swagger.tags = ['Autenticação']
  #swagger.description = 'Autenticar usuário (Refresh Token)'
  */
  authMiddleware,
  authenticate
);

router.get(
  "/user-info",
  /* #swagger.tags = ['Autenticação']
 #swagger.description = 'Dados do usuário logado'
  */
  authMiddleware,
  userInfo
);

module.exports = router;
