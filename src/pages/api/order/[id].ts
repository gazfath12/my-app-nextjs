import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const order = await prisma.order.findUnique({
        where: { id: String(id) },
        include: { products: { include: { product: true } } }
      });

      if (!order) return res.status(404).json({ error: 'Order not found' });

      return res.status(200).json(order);
    } 
    
    else if (req.method === 'PUT') {
      const { total, products } = req.body;
      const updatedOrder = await prisma.order.update({
        where: { id: String(id) },
        data: {
          total,
          products: {
            deleteMany: {},
            create: products.map((p: any) => ({
              product: {
                connectOrCreate: {
                  where: { title: p.title },
                  create: { title: p.title, price: p.price }
                }
              },
              quantity: p.quantity,
            }))
          }
        },
        include: { products: { include: { product: true } } }
      });

      return res.status(200).json(updatedOrder);
    } 
    
    else if (req.method === 'DELETE') {
      await prisma.order.delete({
        where: { id: String(id) }
      });

      return res.status(200).json({ message: 'Order deleted successfully' });
    } 
    
    else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
