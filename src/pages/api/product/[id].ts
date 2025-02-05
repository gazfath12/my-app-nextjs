import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const product = await prisma.product.findUnique({ where: { id: String(id) } });
    return product ? res.status(200).json(product) : res.status(404).json({ message: 'Product not found' });
  }

  if (req.method === 'PUT') {
    const { title, description, price, img } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: String(id) },
      data: { title, description, price, img },
    });
    return res.status(200).json(updatedProduct);
  }

  if (req.method === 'DELETE') {
    await prisma.product.delete({ where: { id: String(id) } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
