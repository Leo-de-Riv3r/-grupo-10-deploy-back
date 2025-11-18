import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import pedidosRouter from './routes/PedidosRoutes.js'
import productosRouter from './routes/ProductosRouter.js'
import usuariosRouter from './routes/UsuariosRoutes.js'
import authRouter from './routes/AuthRoutes.js'
import middleware from './utils/middleware.js'
import itemPedidoRouter from './routes/ItemPedidoRouter.js'
import cookieParser from 'cookie-parser'
import { DBConnector } from './utils/dbConnector.js'
import notificacionesRouter from './routes/NotificacionRoutes.js'
import config from './utils/config.js'
const app = express()

const connector = new DBConnector()
connector.connect()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin : config.ALLOWED_ORIGIN || true,
    credentials: true,
  }),
)

//loggear requests
app.use(middleware.requestLogger)


app.get('/api/health', (req,res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Tienda sol API Health Check EXITOSO',
        timestamp: new Date().toLocaleString()
    })
})
app.get('/hello', (req, res) => {
  res.json({ message: 
    'hello world' })
})


app.use('/api/pedidos', pedidosRouter)

app.use('/api/productos', productosRouter)

app.use('/api/notificaciones', notificacionesRouter)
app.use('/api/usuarios', usuariosRouter)
app.use('/api/auth', authRouter)
app.use('/api/itemPedidos', itemPedidoRouter)
//expone imagenes de productos
app.use('/uploads', express.static('uploads'))
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

const { PORT } = config
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`)
})
