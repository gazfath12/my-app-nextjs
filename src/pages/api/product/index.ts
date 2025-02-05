import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(prisma); // Cek apakah `product` ada dalam Prisma Client

  if (req.method === 'GET') {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const { title, description, price, img } = req.body;
    const newProduct = await prisma.product.create({
      data: { title, description, price, img },
    });
    return res.status(201).json(newProduct);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
