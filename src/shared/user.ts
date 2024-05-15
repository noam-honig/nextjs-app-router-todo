import { Entity, Fields, ForbiddenError, remult } from "remult";

@Entity<User>("users", {
  allowApiRead: true,
  allowApiCrud: "admin",
  apiPrefilter: () => {
    if (!remult.authenticated()) throw new ForbiddenError();
    if (remult.isAllowed("admin")) return {};
    return { id: remult.user!.id };
  },
})
export class User {
  @Fields.cuid()
  id = "";
  @Fields.string()
  name = "";
  @Fields.boolean()
  admin = false;
}
