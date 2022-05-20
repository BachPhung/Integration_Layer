import FromOrder from '../src/models/FromOrder';
import ToOrder from '../src/models/ToOrder';
import CargoOrder from '../src/models/CargoOrder';
import supertest from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import helper from '../src/util/test_helper';
import axios from 'axios';
import requestMethod from '../src/util/requestMethod';



const api = supertest(app);

jest.mock('../src/util/requestMethod.ts', () => {
  const original = jest.requireActual('../src/util/requestMethod')
  return {
    __esModule: true,
    default: jest.fn(original.default)
 }
})

describe("Test integration layer", () => {
  
  beforeEach(async () => {
    await Promise.all([FromOrder.deleteMany(), ToOrder.deleteMany(), CargoOrder.deleteMany()]);
  })

  test('creation success with a proper type: FROM order', async () => {
    const newFromOrder = {
      extOrderId: "bda73cd4-30a0-40e5-bd0b-2bc3c907be47",
      type: "from",
      fromLocation: "Porvoo"
    }
    await api.post('/api/integration')
      .send(newFromOrder)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fromOrdersAtEnd = await helper.fromOrdersInDb();
    expect(fromOrdersAtEnd).toHaveLength(1);
  })

  test('creation fail with a unknow type', async () => {
    const unknownOrder = {
      extOrderId: "bda73cd4-30a0-40e5-bd0b-2bc3c907be47",
      type: "fro",  // Should be "from"
      fromLocation: "Porvoo"
    }
    const res = await api.post('/api/integration')
      .send(unknownOrder)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(res.body).toBe("Unknown type of order")
  })

  test('creation fail with a wrong type of order', async () => {
    const wrongOrder = {
      asdf: "afwea",
      dfas: "afwea"
    }
    const res = await api.post('/api/integration')
      .send(wrongOrder)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(res.body).toBe("Wrong message")
  })

  test('ignore the duplicated message', async () => {
    const newFromOrder = {
      extOrderId: "bda73cd4-30a0-40e5-bd0b-2bc3c907be47",
      type: "from",
      fromLocation: "Porvoo"
    }
    await api.post('/api/integration')
      .send(newFromOrder)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    //Send again the same message
    const res = await api.post('/api/integration')
      .send(newFromOrder)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(res.body).toBe("Existed message")
    const fromOrdersAtEnd = await helper.fromOrdersInDb();
    expect(fromOrdersAtEnd).toHaveLength(1); // Only the first message is save to database
  })

  test('3 messages (same order) received-> make POST request to Seaber', async () => {
    const newFromOrder = {
      extOrderId: "bda73cd4-30a02-40e5-bd0b-2bc3c907be47",
      type: "from",
      fromLocation: "Porvoo"
    }
    const newToOrder = {
      extOrderId: "bda73cd4-30a02-40e5-bd0b-2bc3c907be47",
      type: "to",
      toLocation: "Kokkola"
    }
    const newCargoOrder = {
      extOrderId: "bda73cd4-30a02-40e5-bd0b-2bc3c907be47",
      type: "cargo",
      cargoType: "Pasta",
      cargoAmount: "100"
    }
    // POST first 3 types of messages: FROM & TO & CARGO

    await api.post('/api/integration')
        .send(newFromOrder)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    await api.post('/api/integration')
        .send(newToOrder)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    await api.post('/api/integration')
        .send(newCargoOrder)
        .expect('Content-Type', /application\/json/)

    const fromOrdersAtEnd = await helper.fromOrdersInDb();
    const toOrdersAtEnd = await helper.toOrdersInDb();
    const cargoOrdersAtEnd = await helper.cargoOrdersInDb();
    expect(fromOrdersAtEnd.length + toOrdersAtEnd.length + cargoOrdersAtEnd.length).toBe(3);

  })

  afterAll(() => {
    mongoose.connection.close();
  })
})
