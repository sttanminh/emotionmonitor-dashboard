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
      const { projectId, cardId, metricId } = query;
      const ratings = await getRatings(
        projectId as string,
        (cardId as string) ?? undefined,
        (metricId as string) ?? undefined
      );
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ message: "ratings retrieved", ...ratings });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getRatings(
  projectId: string,
  cardId?: string,
  metricId?: string
) {
  //project includes cards include submission include rating
  var result = await prisma.project.findFirst({
    where: {
      ...{ id: projectId },
    },
    include: {
      trelloCards: {
        where: { ...(cardId ? { id: cardId } : {}) },
        include: {
          submissions: {
            include: {
              ratings: {
                where: { ...(metricId ? { metricId: metricId } : {}) },
              },
            },
          },
        },
      },
    },
  });
  // only return ratings by flattening the returned project inclusions
  const ratings = result?.trelloCards
    .flatMap((card) => card.submissions)
    .flatMap((submission) => submission.ratings);
  await prisma.$disconnect();
  return { ratings: ratings };
}

export default handler;
