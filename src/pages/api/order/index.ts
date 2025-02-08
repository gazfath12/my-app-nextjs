import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Ambil semua order beserta produk yang terkait
      const orders = await prisma.order.findMany({
        include: { products: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(orders);
    }

    else if (req.method === 'POST') {
      const { products } = req.body;

      // Validasi jika tidak ada produk dikirim
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      // Pastikan semua productId ada di database
      const productIds = products.map(p => p.productId);
      console.log("apakah id ada",productIds)
      const existingProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
      console.log("product sudah ada belum",existingProducts)

      if (existingProducts.length !== productIds.length) {
        return res.status(400).json({ error: 'Some products do not exist' });
      }

      // Hitung total harga berdasarkan produk yang dipesan
      const totalPrice = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      console.log("total",totalPrice)
      // Simpan order ke database
      const newOrder = await prisma.order.create({
        data: {
          total: totalPrice,
          products: {
            create: products.map((p) => ({
              product: { connect: { id: p.productId } },
              quantity: p.quantity,
            })),
          },
        },
        include: { products: { include: { product: true } } },
      });

      return res.status(201).json(newOrder);
    }

    else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
