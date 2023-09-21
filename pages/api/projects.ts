// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ProjectProps } from "../config";

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
  } else if (req.method === "PUT") {
    try {
      const query = req.query;
      const { projectData } = query;
      await configureProject(projectData as ProjectProps)
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

export async function getProject(projectId: string) {
  return await prisma.project.findFirst({
    where: {
      id: projectId
    },
    include: {
      metrics: true,
      levels: true
    }
  })
}

//TODO: update this function to configure emojis and reference number
export async function configureProject(projectData: ProjectProps) {
  await configureMetricsAndLevels(projectData)
  //Add your code here
}

async function configureMetricsAndLevels(projectData:ProjectProps) {
  var projectId = projectData.projectid
  var newMetrics: any[] = []
  var pastMetrics: any[] = []
  var existingMetrics: any[] = []

  var allMetrics = await prisma.metric.findMany({
    where: {
      projectId: projectId
    }
  })
  var metricNameArray = allMetrics.map(metricObject => metricObject.name)

  // Sort incoming metrics
  projectData.metrics.forEach(metric => {
    if (metric.metricId && metric.metricId != '') {
      existingMetrics.push(metric)
    } else if (metricNameArray.includes(metric.metricName)) {
      pastMetrics.push(metric)
    } else {
      newMetrics.push(metric)
    }
  })

  // Deactivate all metrics
  await prisma.metric.updateMany({
    where: {
      projectId: projectId
    },
    data: {
      active: false
    }
  })
  // Create new metrics
  if (newMetrics.length > 0) {
    var newMetricData = newMetrics.map(metric => {
      return {
        name: metric.metricName,
        projectId: projectId
      }
    })
    await prisma.$transaction([
      prisma.metric.deleteMany({ where: { name: {
        in: newMetrics.map(metric => metric.name)
      } } }),
      prisma.metric.createMany({
        data: newMetricData
      }),
    ])
  }
  

  // Reinstate existing metrics
  for await (var metric of existingMetrics){
    await prisma.metric.update({
      where: {
        id: metric.metricId
      },
      data: {
        name: metric.metricName,
        active: true
      }
    })
  }

  // Update past metrics
  var pastMetricNames = pastMetrics.map(metric => metric.metricName)
  await prisma.metric.updateMany({
    where: {
      name: {
        in: pastMetricNames
      }
    },
    data: {
      active: true
    }
  })
  
  var activeMetrics = await prisma.metric.findMany({
    where: {
      projectId: projectId,
      active: true
    }
  })
  var activeMetricsDictionary: any = {}
  activeMetrics.forEach(metric => {
    activeMetricsDictionary[metric.name] = metric.id
  })
  // Delete existing levels linked to project
  await prisma.level.deleteMany({where: {projectId: projectId}})
  // Add new levels
  var levelData: any[] = []
  projectData.metrics.forEach(metric => {
    metric.levels.forEach(level => {
      levelData.push({
        levelLabel: level.levelLabel,
        levelOrder: level.levelOrder,
        metricId: activeMetricsDictionary[metric.metricName],
        projectId: projectId
      })
    })
  })
  await prisma.level.createMany({
    data: levelData
  })
}

export default handler;
