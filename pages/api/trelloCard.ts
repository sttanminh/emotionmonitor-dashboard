// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

const apiKey = process.env.API_KEY!;
const apiToken = process.env.API_TOKEN!;

type Data = {
  message: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
      const query = req.query;
      const { id } = query;
      const card = await getTrelloCard(id as string);
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ message: "ratings retrieved", ...card });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getTrelloCard(id: string) {
  //project includes cards name and id
  var result = await prisma.trelloCard.findFirst({
    where: { id: id },
  });
  await prisma.$disconnect();
  return { trelloCard: result };
}

export default handler;
