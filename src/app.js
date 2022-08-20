const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./doc/swagger_output.json");
const AuthRoutes = require("./routes/auth.routes.js");
const CondominioRoutes = require("./routes/condominio.routes.js");
const UsuarioRoutes = require("./routes/usuario.routes.js");
const OcorrenciaRoutes = require("./routes/ocorrencia.routes.js");
const MovimentacaoRoutes = require("./routes/movimentacao.routes.js");
const CobrancaRoutes = require("./routes/cobranca.routes.js");
const CaixaRoutes = require("./routes/caixa.routes.js");
const LeituraRoutes = require("./routes/leitura.routes.js");
const TipoLeituraRoutes = require("./routes/tipoLeitura.routes.js");
const TipoMovimentacaoRoutes = require("./routes/tipoMovimentacao.routes.js");
const { errors } = require("celebrate");
const authMiddleware = require("./middleware/auth.middleware.js");
const authAdminMiddleware = require("./middleware/authAdmin.middleware.js");
require("./config/auth.js");

var optionsSwagger = {
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.2.1/swagger-ui.css",
};

const app = express();
const version = "v1";
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, optionsSwagger));
app.use(`/${version}/auth/`, AuthRoutes);
app.use(authMiddleware);
app.use(`/${version}/usuarios/`, UsuarioRoutes);
app.use(`/${version}/ocorrencias/`, OcorrenciaRoutes);
app.use(`/${version}/movimentacoes/`, authAdminMiddleware, MovimentacaoRoutes);
app.use(`/${version}/caixa/`, authAdminMiddleware, CaixaRoutes);
app.use(`/${version}/cobrancas/`, authAdminMiddleware, CobrancaRoutes);
app.use(`/${version}/leituras/`, authAdminMiddleware, LeituraRoutes);
app.use(`/${version}/tipos-leitura/`, authAdminMiddleware, TipoLeituraRoutes);
app.use(
  `/${version}/tipos-movimentacao/`,
  authAdminMiddleware,
  TipoMovimentacaoRoutes
);
app.use(`/${version}/condominios/`, CondominioRoutes);

// Handle errors.
app.use(errors());

module.exports = app;
