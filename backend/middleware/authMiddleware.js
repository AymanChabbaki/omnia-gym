import dotenv from 'dotenv';
dotenv.config();

export const protectAdmin = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized, invalid or missing admin token'));
  }
};
