module.exports = (req, res, next) => {
  if(req.user?.tipoUsuario != "superAdmin"){
    return res.status(401).json({message:"Usuário não tem permissão"})
  } else{
    return next();
}
};
