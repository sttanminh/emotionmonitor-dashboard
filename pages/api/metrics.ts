// pages/api/metrics.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

type Data = {
  message: string;
  metric?: any[]; // Adjust the type to match your metric data structure
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const metrics = await getMetrics();
      res
        .status(200)
        .json({ message: "Metrics retrieved",...metrics });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getMetrics() {
  // Query metrics from your Prisma database
  var result = await prisma.metric.findMany()

  // Disconnect from the Prisma client
  await prisma.$disconnect();

  return result;
}
