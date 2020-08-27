import * as bcrypt from "bcryptjs";

import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { User } from "../../entity/User";
import { invalidLogin, confirmEmailError } from "./errorMessages";
import { userSessionIdPrefix } from "../../constants";

const errorResponse = [
  {
    path: "email",
    message: invalidLogin,
  },
];

export const resolvers: ResolverMap = {
  Mutation: {},
};
