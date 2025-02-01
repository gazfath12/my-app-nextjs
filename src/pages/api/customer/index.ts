// src/pages/api/customer/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { name, email, phone } = req.body;
      console.log(`nama ${name}, email${email},phone${phone} siap digunakan`)
      const newCustomer = await prisma.customer.create({
        data: { name, email, phone },
      });
      return res.status(201).json(newCustomer);
    } else if (req.method === 'GET') {
      const customers = await prisma.customer.findMany({
        
      });
      console.log("data customers",customers);
      return res.status(200).json(customers);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
