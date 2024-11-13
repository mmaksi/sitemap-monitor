import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllCronJobs() {
  const jobs = await prisma.job.findMany();
  return jobs;
}
