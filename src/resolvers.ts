import { ResolverMap } from "./types/graphql-utils";
import { GQL } from "./types/schema";
import * as bcypt from "bcryptjs";
import { User } from "./entity/User";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello ${name || "World"}`,
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPassword = await bcypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });

      await user.save();
      return true;
    },
  },
};
