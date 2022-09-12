const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const Usuario = require("../database/models/usuario.schema.js");
const bcrypt = require("bcrypt");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}v1/auth/login/google/callback`,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      Usuario.findOne({ googleId: profile.id })
        .then((user) => {
          return done(null, user);
        })
        .catch((error) => {
          return done(null, null);
        });
    }
  )
);

passport.use(
  "register-google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}v1/auth/register/google/callback`,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "senha",
    },
    (email, senha, done) => {
      Usuario.findOne({ email }).then((user) => {
        if (!user) {
          return done(null, false, { message: "Credenciais incorretas" });
        }
        bcrypt.compare(senha, user.senha, (error, result) => {
          if (result) {
            const usr = { ...user._doc };
            const { senha, createdAt, updatedAt, ...rest } = usr;
            return done(null, rest);
          } else {
            return done(null, false, { message: "Credenciais incorretas" });
          }
        });
      });
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
