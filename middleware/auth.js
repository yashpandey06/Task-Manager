import jwt from "jsonwebtoken";

function GenerateToken(User) {
  // ! generate the jwt token

  const payload = {
    id: User._id,
    email: User.email,
  };
  const generated_token = jwt.sign(payload, process.env.SECRET_KEY);
  return generated_token;
}
// ! middleware function
async function authenticateToken(req, res, next) {
  const auth_headers = req.headers.authorization;
  const access_token = auth_headers.split(" ")[1];

  if (!access_token) {
    return res.json({
      message: "Unauthorized User",
    });
  }
  //   !  verify the token
  try {
    jwt.verify(access_token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.json({
          message: "Unauthorized User",
        });
      }
      req.user = decoded;
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
  next();
}

export { GenerateToken, authenticateToken };
