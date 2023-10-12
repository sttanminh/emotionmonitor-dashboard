import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const objectId = "64424477e1b9b792905c2a68";
  const trelloCard2Id = "64524477e1b9b792905c2a68";
  const project = await prisma.project.upsert({
    where: { id: objectId },
    update: {},
    create: {
      id: objectId,
      name: "Dev insights project",
      source: "TRELLO",
      referenceNumber: 7,
    },
  });
  const complexity = await prisma.metric.create({
    data: {
      name: "Complexity",
      active: true,
      projectId: project.id,
    },
  });

  const level1 = await prisma.level.create({
    data: {
      levelLabel: "low",
      levelOrder: 1,
      active: true,
      metricId: complexity.id,
    },
  });
  const level2 = await prisma.level.create({
    data: {
      levelLabel: "medium",
      levelOrder: 2,
      active: true,
      metricId: complexity.id,
    },
  });
  const level3 = await prisma.level.create({
    data: {
      levelLabel: "high",
      levelOrder: 3,
      active: true,
      metricId: complexity.id,
    },
  });
  const difficulty = await prisma.metric.create({
    data: {
      name: "Difficulty",
      active: true,
      projectId: project.id,
    },
  });
  const difLevel1 = await prisma.level.create({
    data: {
      levelLabel: "easy",
      levelOrder: 1,
      active: true,
      metricId: difficulty.id,
    },
  });
  const difLevel2 = await prisma.level.create({
    data: {
      levelLabel: "medium",
      levelOrder: 2,
      active: true,
      metricId: difficulty.id,
    },
  });
  const difLevel3 = await prisma.level.create({
    data: {
      levelLabel: "hard",
      levelOrder: 3,
      active: true,
      metricId: difficulty.id,
    },
  });
  const workload = await prisma.metric.create({
    data: {
      name: "Workload",
      active: true,
      projectId: project.id,
    },
  });
  const workloadLevel1 = await prisma.level.create({
    data: {
      levelLabel: "low",
      levelOrder: 1,
      active: true,
      metricId: workload.id,
    },
  });
  const workloadLevel2 = await prisma.level.create({
    data: {
      levelLabel: "medium",
      levelOrder: 2,
      active: true,
      metricId: workload.id,
    },
  });
  const workloadLevel3 = await prisma.level.create({
    data: {
      levelLabel: "high",
      levelOrder: 3,
      active: true,
      metricId: workload.id,
    },
  });

  const trelloCard = await prisma.trelloCard.upsert({
    where: { id: objectId },
    update: {},
    create: {
      id: objectId,
      taskName: "Trello Card 1: do the thing",
      projectId: objectId,
      description: "the thing must be done",
    },
  });
  const trelloCard2 = await prisma.trelloCard.upsert({
    where: { id: trelloCard2Id },
    update: {},
    create: {
      id: trelloCard2Id,
      taskName: "Trello Card 2: undo the thing",
      projectId: objectId,
      description: "the thing was wrong. delete it",
    },
  });
  const submissionOne = await prisma.submission.create({
    data: {
      reflection: "this card is written terribly",
      timestamp: new Date(),
      trelloCardId: objectId,
      userId: objectId,
    },
  });
  const submissionTwo = await prisma.submission.create({
    data: {
      reflection: "this card is written less terribly",
      timestamp: new Date(),
      trelloCardId: objectId,
      userId: objectId,
    },
  });
  const submissionThree = await prisma.submission.create({
    data: {
      reflection: "this card is a bit vague",
      timestamp: new Date(),
      trelloCardId: trelloCard2.id,
      userId: objectId,
    },
  });
  const submissionFour = await prisma.submission.create({
    data: {
      reflection: "I love deleting code",
      timestamp: new Date(),
      trelloCardId: trelloCard2.id,
      userId: objectId,
    },
  });

  const rating1 = await prisma.rating.create({
    data: {
      emoScore: 0,
      level: 1,
      levelId: level1.id,
      metricId: complexity.id,
      submissionId: submissionOne.id,
    },
  });
  const rating2 = await prisma.rating.create({
    data: {
      emoScore: 3,
      level: 3,
      levelId: level3.id,
      metricId: complexity.id,
      submissionId: submissionTwo.id,
    },
  });
  const rating3 = await prisma.rating.create({
    data: {
      emoScore: 2,
      level: 1,
      levelId: difLevel1.id,
      metricId: difficulty.id,
      submissionId: submissionOne.id,
    },
  });
  const rating4 = await prisma.rating.create({
    data: {
      emoScore: 0,
      level: 3,
      levelId: difLevel3.id,
      metricId: difficulty.id,
      submissionId: submissionTwo.id,
    },
  });
  const rating5 = await prisma.rating.create({
    data: {
      emoScore: 1,
      level: 1,
      levelId: workloadLevel1.id,
      metricId: workload.id,
      submissionId: submissionOne.id,
    },
  });
  const rating6 = await prisma.rating.create({
    data: {
      emoScore: 5,
      level: 3,
      levelId: workloadLevel3.id,
      metricId: workload.id,
      submissionId: submissionTwo.id,
    },
  });
  const rating7 = await prisma.rating.create({
    data: {
      emoScore: 5,
      level: 1,
      levelId: level1.id,
      metricId: complexity.id,
      submissionId: submissionThree.id,
    },
  });
  const rating8 = await prisma.rating.create({
    data: {
      emoScore: 2,
      level: 3,
      levelId: level3.id,
      metricId: complexity.id,
      submissionId: submissionFour.id,
    },
  });
  const rating9 = await prisma.rating.create({
    data: {
      emoScore: 0,
      level: 1,
      levelId: difLevel1.id,
      metricId: difficulty.id,
      submissionId: submissionThree.id,
    },
  });
  const rating10 = await prisma.rating.create({
    data: {
      emoScore: 4,
      level: 3,
      levelId: difLevel3.id,
      metricId: difficulty.id,
      submissionId: submissionFour.id,
    },
  });
  const rating11 = await prisma.rating.create({
    data: {
      emoScore: 2,
      level: 1,
      levelId: workloadLevel1.id,
      metricId: workload.id,
      submissionId: submissionThree.id,
    },
  });
  const rating12 = await prisma.rating.create({
    data: {
      emoScore: 1,
      level: 3,
      levelId: workloadLevel3.id,
      metricId: workload.id,
      submissionId: submissionFour.id,
    },
  });

  const user = await prisma.user.upsert({
    where: { id: objectId },
    update: {},
    create: { id: objectId, name: "thisUser", email: "test@test.com" },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
