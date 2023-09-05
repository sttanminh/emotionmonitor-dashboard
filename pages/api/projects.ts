// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ProjectProps } from "..";

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

/*
Metric cannot be renamed. User can only remove metrics and add new metrics. If rename is allowed, all other projects using
the same metrics will be affected
update:
Get a list of all current metrics
Disconnect to all other metrics connected to project that's not in the current metric list
If metric is new (id doesn't) -> check if any other metrics with the same name
If yes, connect to project, else create new metric, connect to project
Delete all current levels for the same project id
Insert new levels
Update project with new metrics and levels

*/
export async function configureProject(projectData: ProjectProps) {
  var projectId = projectData.projectid
  var newMetricData: any[] = []
  var existingMetricIds: any[] = []
  // Check if any new metrics already exists in metric table
  var newMetricNames = projectData.metrics.map(metric => metric.metricName)
  var existingMetrics = await prisma.metric.findMany({
    select: {
      id: true,
      name: true
    },
    where: {
      name: {
        in: newMetricNames
      }
    }
  })
  var existingMetricsNames = existingMetrics.map(metric => metric.name)
  projectData.metrics.forEach(metric => {
    if ((!metric.metricId || metric.metricId === '') && !existingMetricsNames.includes({"name": metric.metricName})) {
      newMetricData.push({
        name: metric.metricName
      })
    } else {
      existingMetricIds.push(metric.metricId)
    }
  })
  existingMetricIds.push.apply(existingMetrics.map(metric => metric.id))
  //Disconnect project to all metrics
  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      metrics: {
        set: []
      }
    },
  })
  
  // Create new metrics
  await prisma.$transaction([
    prisma.metric.deleteMany({ where: { name: {
      in: newMetricData.map(metric => metric.name)
    } } }),
    prisma.metric.createMany({
      data: newMetricData
    }),
  ])
  var newlyCreatedMetrics = await prisma.metric.findMany({
    where: {
      name: {
        in : newMetricData.map(metric => metric.name)
      }
    }
  })
  var newlyCreatedMetricIds = newlyCreatedMetrics.map(metric => metric.id)
  var newlyCreatedMetricIdObj: any = {}
  newlyCreatedMetrics.forEach(metric => newlyCreatedMetricIdObj[metric.name] = metric.id)
  var allMetricIds = existingMetricIds
  allMetricIds.push.apply(allMetricIds, newlyCreatedMetricIds)
  var connectVar = allMetricIds.map(id => {return {"id": id}})

  //Connect project to metrics
  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      metricIds: allMetricIds,
      metrics: {
        connect: connectVar
      }
    }
  })

  // Delete existing levels linked to project
  await prisma.level.deleteMany({where: {projectId: projectId}})
  // Add new levels
  var levelObjects: any[] = []
  projectData.metrics.forEach(metric => {
    console.log(metric)
    metric.levels.forEach(level => {
      levelObjects.push({
        levelLabel: level.levelLabel,
        levelOrder: level.levelOrder,
        metricId: !metric.metricId || metric.metricId === ''? newlyCreatedMetricIdObj[metric.metricName] : metric.metricId,
        projectId: projectId
      })
    })
  })
  await prisma.level.createMany({
    data: levelObjects
  })
}

export default handler;
