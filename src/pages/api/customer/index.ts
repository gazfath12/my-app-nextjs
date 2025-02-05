// src/pages/api/customer/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { name, email, phone } = req.body;
      const newCustomer = await prisma.customer.create({
        data: { name, email, phone },
      });
      return res.status(201).json(newCustomer);
    } else if (req.method === 'GET') {
      const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        include: { purchases: true },
      });
      return res.status(200).json(customers);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
