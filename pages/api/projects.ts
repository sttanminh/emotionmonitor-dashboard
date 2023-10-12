// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ProjectProps } from "../config";
import { Metric, Project } from "@prisma/client";

const apiKey = process.env.API_KEY!;
const apiToken = process.env.API_TOKEN!;

type Data = {
  message: string;
};

type Level = {
  id?: string;
  levelLabel: string;
  levelOrder: number;
  active: boolean;
  metricId: string;
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
      const { projectData } = req.body;
      await configureProject(projectData);
      res.status(201).json({ message: "Project configured!" });
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
      metrics: {
        where: { active: true },
        include: { levels: { where: { active: true } } },
      },
    },
  });
  await prisma.$disconnect();
  return { projects: result };
}

export async function getProject(projectId: string): Promise<
  | (Project & {
      metrics: (Metric & { levels: Level[] })[];
    })
  | null
> {
  return await prisma.project.findFirst({
    where: {
      id: projectId,
    },
    include: {
      metrics: {
        include: {
          levels: true,
        },
      },
    },
  });
}

export async function configureProject(projectData: ProjectProps) {
  await configureMetricsAndLevels(projectData);
  await updateProjectEmojisAndReference(projectData);
}

async function configureMetricsAndLevels(projectData: ProjectProps) {
  var projectId = projectData.projectId;
  var newMetrics: any[] = [];
  var pastMetrics: any[] = [];
  var existingMetrics: any[] = [];

  var allMetrics = await prisma.metric.findMany({
    where: {
      projectId: projectId,
    },
  });
  var metricNameArray = allMetrics.map((metricObject) => metricObject.name);

  // Sort incoming metrics
  projectData.metrics.forEach((metric) => {
    if (metric.metricId && metric.metricId != "") {
      existingMetrics.push(metric);
    } else if (metricNameArray.includes(metric.metricName)) {
      pastMetrics.push(metric);
    } else {
      newMetrics.push(metric);
    }
  });

  // Deactivate all metrics
  await prisma.metric.updateMany({
    where: {
      projectId: projectId,
    },
    data: {
      active: false,
    },
  });
  // Create new metrics
  if (newMetrics.length > 0) {
    var newMetricData = newMetrics.map((metric) => {
      return {
        name: metric.metricName,
        projectId: projectId,
      };
    });
    await prisma.$transaction([
      prisma.metric.deleteMany({
        where: {
          name: {
            in: newMetricData.map((metric) => metric.name),
          },
        },
      }),
      prisma.metric.createMany({
        data: newMetricData,
      }),
    ]);
  }

  // Reinstate existing metrics
  for await (var metric of existingMetrics) {
    await prisma.metric.update({
      where: {
        id: metric.metricId,
      },
      data: {
        name: metric.metricName,
        active: true,
      },
    });
  }

  // Update past metrics
  var pastMetricNames = pastMetrics.map((metric) => metric.metricName);
  await prisma.metric.updateMany({
    where: {
      name: {
        in: pastMetricNames,
      },
    },
    data: {
      active: true,
    },
  });

  var metrics: (Metric & { levels: Level[] })[] = await prisma.metric.findMany({
    where: {
      projectId: projectId,
    },
    include: {
      levels: true,
    },
  });
  var allMetricIds = metrics.map((metric) => metric.id);
  var activeMetrics = metrics.filter((metric) => metric.active);
  // Deactive all existing levels linked to project
  await prisma.level.updateMany({
    where: {
      metricId: {
        in: allMetricIds,
      },
    },
    data: {
      active: false,
    },
  });

  // Sort incoming levels
  var newLevels: Level[] = [];
  var existingLevelIds: string[] = [];
  var metricDictionary: { [metricName: string]: string } = {};
  metrics.forEach((metric) => {
    metricDictionary[metric.name] = metric.id;
  });

  var existingActiveLevels: Level[] = [];
  activeMetrics.forEach((metric) => {
    metric.levels.forEach((level) => existingActiveLevels.push(level));
  });
  projectData.metrics.forEach((metric) => {
    metric.levels.forEach((level) => {
      let check = existingActiveLevels.filter(
        (existingLevel: any) =>
          existingLevel.levelLabel == level.levelLabel &&
          existingLevel.levelOrder == level.levelOrder &&
          existingLevel.metricId == metricDictionary[metric.metricName]
      );
      if (check.length == 0) {
        newLevels.push({
          ...level,
          active: true,
          metricId: metricDictionary[metric.metricName],
        });
      } else {
        existingLevelIds.push(check[0].id!);
      }
    });
  });
  if (newLevels.length > 0) {
    await prisma.level.createMany({
      data: newLevels,
    });
  }
  if (existingLevelIds.length > 0) {
    await prisma.level.updateMany({
      data: {
        active: true,
      },
      where: {
        id: {
          in: existingLevelIds,
        },
      },
    });
  }
}

async function updateProjectEmojisAndReference(projectData: ProjectProps) {
  return await prisma.project.updateMany({
    where: {
      id: projectData.projectId,
    },
    data: {
      emojis: projectData.emojis,
      referenceNumber: projectData.referenceNumber,
    },
  });
}

export default handler;
