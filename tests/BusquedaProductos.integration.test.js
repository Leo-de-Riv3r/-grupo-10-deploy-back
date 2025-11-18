import { expect, jest } from "@jest/globals";
import request from 'supertest'
import { ProductosController } from "../controllers/ProductosController.js";
import { ProductoService } from "../services/ProductoService.js";
import express from 'express'
import asyncHandler from 'express-async-handler'
import middleware from "../utils/middleware.js";
import { ProductoRepository } from "../models/repositories/ProductosRepository.js";
import { CategoriaRepository } from "../models/repositories/CategoriaRepository.js";
import { UsuarioRepository } from "../models/repositories/UsuariosRepository.js";

const mockProductoRepo = {
  getProductos: jest.fn(),
  findAll: jest.fn()
}

const mockUsuarioRepo = {
  findById: jest.fn()
}

//lo pongo asi porque se requiere en el constructor 
//pero no lo uso en buscarProductos()
const categoriaRepo = {}
const mockProductoService = new ProductoService(mockProductoRepo, categoriaRepo, mockUsuarioRepo)
const productosController = new ProductosController(mockProductoService)

const productosRouter = express.Router()
productosRouter.get('/', asyncHandler(async (req, res) => {
  return await productosController.obtenerProductos(req, res)
}))

const app = express();
app.use(express.json());
app.use("/api/productos", productosRouter)
app.use(middleware.errorHandler)

mockProductoRepo.getProductos.mockResolvedValue([
  {nombre: "lavarropas", precio: 100, moneda: "DOLAR_USA", totalVentas: 10},
  {nombre: "reproductor cassette", precio: 50, moneda: "DOLAR_USA", totalVentas: 20},
  {nombre: "A.D.I.D.A.S T-Shirt", precio: 30, moneda: "DOLAR_USA", totalVentas: 50},
  {nombre: "Remera 'silencio gil 2'", precio: 20000, moneda: "PESO_ARG", totalVentas: 42},
  {nombre: "Perfume vierge", precio: 120000, moneda: "PESO_ARG", totalVentas: 30},
  {nombre: "Limp bizkit red cap", precio: 18, moneda: "DOLAR_USA", totalVentas: 80},
])

describe("busqueda de productos", () => {
  test("Error 400 si no recibe vendedorId", async () => {
    const response = await request(app).get("/api/productos")
    expect(response.status).toBe(400)
    expect(response.body[0].message).toContain("No se recibio un id de usuario");
    expect(response.body[0].path[0]).toContain("vendedorId");
  })

  test("Error 404 por id inexistente", async () => {
    mockUsuarioRepo.findById.mockResolvedValue(undefined)
    const response = await request(app).get("/api/productos?vendedorId=68d6cab39b8125b409b72c05");
    expect(response.status).toBe(404)
  })

  test("Obtengo productos ordenados por precio ascendente", async () => {
    mockUsuarioRepo.findById.mockResolvedValue({name: "alf"})
    const response = await request(app).get("/api/productos?vendedorId=68d6cab39b8125b409b72c05&ordenarPor=PRECIO&ordenPrecio=ASC");
    expect(response.status).toBe(200)
    expect(response.body.productos[0].precio).toBe(20000)
    expect(response.body.productos[5].precio).toBe(100)
  })

  test("Obtengo productos ordenados por precio descendente", async () => {
    const response = await request(app).get("/api/productos?vendedorId=68d6cab39b8125b409b72c05&ordenarPor=PRECIO");
    expect(response.status).toBe(200)
    expect(response.body.productos[0].precio).toBe(100)
    expect(response.body.productos[5].precio).toBe(20000)
  })

  test("Obtengo productos paginados de entre 40000 y 100000 pesos", async () => {
    const response = await request(app)
  .get("/api/productos")
  .query({
    vendedorId: "68d6cab39b8125b409b72c05",
    precioMin: 40000,
    precioMax: 100000,
    tipoMoneda: "PESO_ARG",
    ordenarPor: "PRECIO",
    ordenPrecio: "ASC",
    perPage: 1
  });

    console.log(response.body)
    expect(response.status).toBe(200)
    expect(response.body.productos.length).toBe(1)
    expect(response.body.page).toBe(1)
    expect(response.body.totalPages).toBe(2)
  })
})


