// src/pages/api/customer/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID tidak valid' });
  }

  try {
    if (req.method === 'GET') {
      const customer = await prisma.customer.findUnique({
        where: { id: Number(id) },
        include: { purchases: true },
      });
      if (!customer) {
        return res.status(404).json({ error: 'Customer tidak ditemukan' });
      }
      return res.status(200).json(customer);
    } else if (req.method === 'PUT') {
      const { name, email, phone } = req.body;
      const updatedCustomer = await prisma.customer.update({
        where: { id: Number(id) },
        data: { name, email, phone },
      });
      return res.status(200).json(updatedCustomer);
    } else if (req.method === 'DELETE') {
      const deletedCustomer = await prisma.customer.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json(deletedCustomer);
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
