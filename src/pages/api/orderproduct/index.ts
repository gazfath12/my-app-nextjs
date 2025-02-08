import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const orderProducts = await prisma.orderProduct.findMany({
        include: { order: true, product: true },
      });
      return res.status(200).json(orderProducts);
    }

    else if (req.method === 'POST') {
      // Cek apakah request memiliki Content-Type JSON
      if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Invalid Content-Type. Use application/json' });
      }

      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const { orderId, productId, quantity } = req.body;

      if (!orderId || !productId || !quantity) {
        return res.status(400).json({ error: 'Order ID, Product ID, and quantity are required' });
      }

      const orderProduct = await prisma.orderProduct.create({
        data: {
          order: { connect: { id: orderId } },
          product: { connect: { id: productId } },
          quantity,
        },
      });

      return res.status(201).json(orderProduct);
    }

    else if (req.method === 'DELETE') {
      if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Invalid Content-Type. Use application/json' });
      }

      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const { id } = req.body;

      if (!id) return res.status(400).json({ error: 'ID is required' });

      await prisma.orderProduct.delete({ where: { id } });

      return res.status(204).end();
    }

    else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);

    return res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : error,
    });
  }
}
