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
      const projects = await getProjects();
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ message: "ratings retrieved", ...projects });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getProjects() {
  //project includes cards name and id
  var result = await prisma.project.findMany({
    include: {
      trelloCards: {
        select: { taskName: true, id: true },
      },
    },
  });
  await prisma.$disconnect();
  return { projects: result };
}

export default handler;
