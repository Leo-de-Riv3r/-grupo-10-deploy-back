import config from '../utils/config.js'
import jwt from 'jsonwebtoken'

const { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP, JWT_SECRET } = config

const generateTokens = (user) => {
  const userForToken = { nombre: user.nombre, email: user.email, id: user._id || user.id, tipo: user.tipo }
  const accessToken = jwt.sign(userForToken, JWT_SECRET, { expiresIn: 60 * ACCESS_TOKEN_EXP })
  const refreshToken = jwt.sign(userForToken, JWT_SECRET, { expiresIn: 60 * REFRESH_TOKEN_EXP })
  return { accessToken, refreshToken }
}

export default generateTokens