import { PrismaClient, Task, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const tasks = [
  {
    name: "Task 1",
    description: "Do task 1",
    dueDate: "2024-12-16",
    status: TaskStatus.COMPLETED,
  },
  {
    name: "Task 2",
    description: "Do task 2",
    dueDate: "2024-12-16",
    status: TaskStatus.IN_PROGRESS,
  },
  {
    name: "Task 3",
    description: "Do task 3",
    dueDate: "2024-12-16",
    status: TaskStatus.COMPLETED,
  },
  {
    name: "Task 4",
    description: "Do task 4",
    dueDate: "2024-12-16",
    status: TaskStatus.OVERDUE,
  },
];
async function main() {
  try {
    const hashedPassword = await bcrypt.hash("Password@123", 10);
    const user1 = await prisma.user.create({
      data: {
        username: "Aryan",
        email: "aryan@gmail.com",
        password: hashedPassword,
      },
    });

    const promises = await Promise.all(
      tasks.map((task) => {
        return prisma.task.create({
          data: {
            ...task,
            user: {
              connect: { id: user1.id },
            },
          },
        });
      })
    );
  } catch (error) {
    console.log("Seeding Failed: ", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
