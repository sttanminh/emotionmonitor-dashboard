import { PrismaClient } from '@prisma/client'
import { ObjectId } from 'bson'

const prisma = new PrismaClient()
async function main() {
  const complexity = await prisma.metric.upsert({
    where: { name: 'Complexity' },
    update: {},
    create: {
      name: 'Complexity',
      default: true
    },
  })
  const difficulty = await prisma.metric.upsert({
    where: { name: 'Difficulty' },
    update: {},
    create: {
      name: 'Difficulty',
      default: true
    },
  })
	const workload = await prisma.metric.upsert({
    where: { name: 'Workload' },
    update: {},
    create: {
      name: 'Workload',
      default: true
    },
  })
  const objectId = "64424477e1b9b792905c2a68"
  const trelloCard = await prisma.trelloCard.upsert({
    where: {id: objectId},
    update: {},
    create: {id: objectId, taskName: "Trello Card 1: do the thing", projectId: objectId}
  })
  const submissionOne = await prisma.submission.create({
    data: {reflection: "this card is written terribly", timestamp: new Date(), trelloCardId: objectId, userId: objectId},
  })
  const submissionTwo = await prisma.submission.create({
    data: {reflection: "this card is written less terribly", timestamp: new Date(), trelloCardId: objectId, userId: objectId},
  })

  const rating1 = await prisma.rating.create({ 
    data: {emoScore: 1, level: 1, metricId: complexity.id, submissionId: submissionOne.id}
  })
  const rating2 = await prisma.rating.create({ 
    data: {emoScore: 3, level: 3, metricId: complexity.id, submissionId: submissionTwo.id}
  })
  const rating3 = await prisma.rating.create({ 
    data: {emoScore: 1, level: 1, metricId: difficulty.id, submissionId: submissionOne.id}
  })
  const rating4 = await prisma.rating.create({ 
    data: {emoScore: 3, level: 3, metricId: difficulty.id, submissionId: submissionTwo.id}
  })
  const rating5 = await prisma.rating.create({ 
    data: {emoScore: 1, level: 1, metricId: workload.id, submissionId: submissionOne.id}
  })
  const rating6 = await prisma.rating.create({ 
    data: {emoScore: 3, level: 3, metricId: workload.id, submissionId: submissionTwo.id}
  })

  const user = await prisma.user.upsert({
    where: {id: objectId},
    update: {},
    create: {id: objectId, name: "thisUser", email: "test@test.com" },
  })

  const project = await prisma.project.upsert({
    where: {id: objectId},
    update: {},
    create: {id: objectId, name: "Dev insights project", source: "TRELLO", levelLabel: "level",referenceNumber: 7, metricIds: [complexity.id, difficulty.id, workload.id] },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })