import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_ = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({
      message: "Token Not Found",
    });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET_);
  if (decoded) {
    const { id, role } = decoded;
    req.id = id;
    req.role = role;

    return next();
  } else {
    res.status(401).json({
      message: "Auth Failed",
    });
    return;
  }
};
export default auth;
