import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const products = await prisma.product.findMany();
      return res.status(200).json(products);
    }

    else if (req.method === 'POST') {
      const { title, price } = req.body;
      if (!title || !price) {
        return res.status(400).json({ error: 'Title and price are required' });
      }

      const newProduct = await prisma.product.create({
        data: { title, price },
      });

      return res.status(201).json(newProduct);
    }

    else if (req.method === 'PUT') {
      const { id, title, price } = req.body;
      if (!id || !title || !price) {
        return res.status(400).json({ error: 'ID, title, and price are required' });
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { title, price },
      });

      return res.status(200).json(updatedProduct);
    }

    else if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      await prisma.product.delete({ where: { id } });

      return res.status(204).end();
    }

    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
