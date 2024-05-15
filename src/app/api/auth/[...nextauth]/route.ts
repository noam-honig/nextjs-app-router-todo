import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserInfo, remult, repo } from "remult";

import { User } from "../../../../shared/user";
import { api } from "../../[...remult]/api";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        name: {
          placeholder: "Try Steve or Jane",
        },
      },
      authorize: (info) =>
        api.withRemult(async () => {
          if (!info?.name) return null;
          const r = remult;
          console.log("authorize", process.pid, r.dataProvider);
          const user = await repo(User).findFirst({ name: info.name });
          if (!user) return null;
          // validate password etc...
          return toUserInfo(user);
        }, true),
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return api.withRemult(async () => {
        const r = remult;
        console.log("session", process.pid, r.dataProvider);
        return {
          ...session,
          user: token?.sub
            ? toUserInfo(await repo(User).findId(token?.sub))
            : undefined,
        };
      }, true);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

function toUserInfo(user: User): UserInfo {
  if (!user)
    throw new Error("User not found. This should not happen. Please debug.");
  return { id: user.id, name: user.name, roles: user.admin ? ["admin"] : [] };
}
