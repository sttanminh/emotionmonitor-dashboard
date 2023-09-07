// pages/api/ratings-by-project.js

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

type Data = {
  message: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
      const projectId = req.query.projectId as string;
      const ratings = await getRatingsByProject(projectId);
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ message: "ratings retrieved", ...ratings });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getRatingsByProject(projectId: string) {
  // Project includes cards include submissions include ratings
  const result = await prisma.project.findFirst({
    where: { id: projectId },
    include: {
      trelloCards: {
        include: {
          submissions: {
            include: {
              ratings: true,
            },
          },
        },
      },
    },
  });

  // Flatten the returned project inclusions to get all ratings
  const ratings = result?.trelloCards
    .flatMap((card) => card.submissions)
    .flatMap((submission) => submission.ratings);

  await prisma.$disconnect();
  return { ratings: ratings };
}

export default handler;
