import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello ${name || "World"}`,
  },
};
