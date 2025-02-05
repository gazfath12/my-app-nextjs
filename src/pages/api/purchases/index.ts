import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const purchases = await prisma.purchase.findMany({
      include: { product: true }
    });
    return res.status(200).json(purchases);
  } else if (req.method === 'POST') {
    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Stock tidak cukup" });
    }

    const totalPrice = product.price * quantity;

    const newPurchase = await prisma.purchase.create({
      data: { productId, quantity, totalPrice }
    });

    await prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity }
    });

    return res.status(201).json(newPurchase);
  }
}
