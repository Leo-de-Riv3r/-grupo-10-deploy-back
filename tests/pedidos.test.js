import request from "supertest";
import express from "express";
import asyncHandler from "express-async-handler";
import { jest } from "@jest/globals";

import { PedidoService } from "../services/PedidoService.js";
import { PedidosController } from "../controllers/PedidosController.js";

// ---- Mocks globales ----
const mockPedidoRepo = { save: jest.fn(), findById: jest.fn(), update: jest.fn() };
const mockUsuarioRepo = { findById: jest.fn() };
const mockProductosRepo = { findById: jest.fn(), updateProducto: jest.fn() };

// Service y Controller
const pedidoService = new PedidoService(mockPedidoRepo, mockUsuarioRepo, mockProductosRepo);
const pedidosController = new PedidosController(pedidoService);

// Router de pruebas
const pedidosRouter = express.Router();
pedidosRouter.post("/", asyncHandler((req, res) => pedidosController.crearPedido(req, res)));
pedidosRouter.patch("/:id/cancelado", asyncHandler((req, res) => pedidosController.cancelarPedido(req, res)));
pedidosRouter.patch("/:id/enviado", asyncHandler((req, res) => pedidosController.marcarEnviado(req, res)));

// App de tests
const app = express();
app.use(express.json());
app.use("/api/pedidos", pedidosRouter);

describe("Pedidos - Integración", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------- CREAR PEDIDO -----------------
  test("Crear pedido exitosamente", async () => {
    const body = {
      compradorId: "64f8c0a1e1d2a9b123456789",
      items: [{ productoId: "68d70fc516fb40fbe3befe6d", cantidad: 2, precioUnitario: 100 }],
      moneda: "PESO_ARG",
      calle: "Calle Falsa",
      altura: "123",
      piso: "1",
      departamento: "A",
      codigoPostal: "1000",
      ciudad: "Ciudad",
      provincia: "Provincia",
      pais: "Pais"
    };

    mockUsuarioRepo.findById.mockResolvedValue({ _id: body.compradorId, name: "Juan" });

    mockProductosRepo.findById.mockResolvedValue({
      _id: "68d70fc516fb40fbe3befe6d",
      stock: 100,
      ventas: 0,
      estaDisponible: jest.fn().mockReturnValue(true),
      reducirStock: jest.fn(),
      aumentarStock: jest.fn(),
      aumentarVentas: jest.fn()
    });

    // Mock save devuelve _id para que el DTO lo pueda usar
    mockPedidoRepo.save.mockResolvedValue({ _id: "pedido1" });

    const res = await request(app)
      .post("/api/pedidos")
      .send(body)
      .set("Content-Type", "application/json");

    expect(res.body.id).toBe("pedido1");
    
    /*expect(res.status).toBe(201);
    expect(res.body.compradorId).toBe(body.compradorId);
    expect(res.body.items.length).toBe(1);
    expect(mockPedidoRepo.save).toHaveBeenCalled();
    expect(mockUsuarioRepo.findById).toHaveBeenCalledWith(body.compradorId);
    expect(mockProductosRepo.findById).toHaveBeenCalledWith("68d70fc516fb40fbe3befe6d");
    expect(mockProductosRepo.updateProducto).toHaveBeenCalled();*/
  });

  test("Error al crear pedido sin comprador", async () => {
    const body = {
      items: [{ productoId: "68d70fc516fb40fbe3befe6d", cantidad: 2, precioUnitario: 100 }],
      moneda: "USD",
      calle: "Calle Falsa",
      altura: "123",
      codigoPostal: "1000",
      ciudad: "Ciudad",
      provincia: "Provincia",
      pais: "Pais"
    };

    mockUsuarioRepo.findById.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/pedidos")
      .send(body)
      .set("Content-Type", "application/json");
    console.log(res.body)
    console.log(res.status)
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("no existe");
  });

  test("Error al crear pedido con items vacíos", async () => {
    const body = {
      compradorId: "64f8c0a1e1d2a9b123456789",
      items: [],
      moneda: "USD",
      calle: "Calle Falsa",
      altura: "123",
      codigoPostal: "1000",
      ciudad: "Ciudad",
      provincia: "Provincia",
      pais: "Pais"
    };

    const res = await request(app)
      .post("/api/pedidos")
      .send(body)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body[0].message).toContain("Debe haber al menos un item");
  });

  // ----------------- CANCELAR PEDIDO -----------------
  test("Cancelar pedido exitosamente", async () => {
    const pedidoId = "64f8c0a1e1d2a9b12345678a";
    const motivo = "Cliente canceló";

    mockPedidoRepo.findById.mockResolvedValue({
      _id: pedidoId,
      estado: "CONFIRMADO",
      comprador: { _id: "usuario1" },
      historialEstados: [],
      items: [{ producto: { _id: "prod1" }, cantidad: 2, precioUnitario: 100 }],
      total: 200
    });

    mockUsuarioRepo.findById.mockResolvedValue({ _id: "usuario1", name: "Juan" });
    mockPedidoRepo.update.mockResolvedValue(true);
    mockProductosRepo.findById.mockResolvedValue({
      _id: "prod1",
      stock: 10,
      ventas: 0,
      aumentarStock: jest.fn()
    });
    mockProductosRepo.updateProducto.mockResolvedValue(true);

    const res = await request(app)
      .patch(`/api/pedidos/${pedidoId}/cancelado`)
      .send({ motivo })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe("CANCELADO");
    expect(res.body.historialEstados[res.body.historialEstados.length - 1].motivo).toBe(motivo);
    expect(mockPedidoRepo.findById).toHaveBeenCalledWith(pedidoId);
    expect(mockUsuarioRepo.findById).toHaveBeenCalled();
    expect(mockPedidoRepo.update).toHaveBeenCalled();
  });

  test("Error al cancelar pedido sin motivo", async () => {
    const pedidoId = "64f8c0a1e1d2a9b12345678a";

    const res = await request(app)
      .patch(`/api/pedidos/${pedidoId}/cancelado`)
      .send({})
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    console.log(res.body[0].message)
    expect(res.body[0].message).toBe("Motivo es obligatorio");
  });
});
