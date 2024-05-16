import { remultNextApp } from "remult/remult-next";
import { Task } from "../../../shared/task";
import { UserInfo, repo } from "remult";
import { TasksController } from "../../../shared/tasksController";
import { User } from "../../../shared/user";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";

export const api = remultNextApp({
  entities: [Task, User],
  controllers: [TasksController],
  getUser: async (req) => {
    return (await getServerSession(authOptions))?.user as UserInfo;
  },
  admin: true,
  initApi: async () => {
    if ((await repo(User).count()) === 0)
      await repo(User).insert([
        { id: "1", name: "Jane", admin: true },
        { id: "2", name: "Steve" },
      ]);
  },
});
