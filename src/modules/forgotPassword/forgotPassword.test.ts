import { Connection } from "typeorm";
import * as faker from "faker";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { TestClient } from "../../utils/testClient";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import * as Redis from "ioredis";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import { forgotPasswordLockedError } from "../login/errorMessages";
import { passwordNotLongEnough } from "../register/errorMessages";
import { expiredKeyError } from "./errorMessages";

let userId: string;
let conn: Connection;
const redis = new Redis();
const email = faker.internet.email();
const password = faker.internet.password();
const newPassword = faker.internet.password();

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

describe("forgot password", () => {
  test("make sure it works", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    // lock account
    await forgotPasswordLockAccount(userId, redis);
    const url = await createForgotPasswordLink("", userId, redis);

    const parts = url.split("/");
    const key = parts[parts.length - 1];

    // make sure you can't login to locked account
    expect(await client.login(email, password)).toEqual({
      data: {
        login: [
          {
            path: "email",
            message: forgotPasswordLockedError,
          },
        ],
      },
    });

    expect(await client.forgotPasswordChange("a", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "newPassword",
            message: passwordNotLongEnough,
          },
        ],
      },
    });

    const response = await client.forgotPasswordChange(newPassword, key);

    expect(response.data).toEqual({
      forgotPasswordChange: null,
    });

    // make sure redis key expires after a password change
    expect(await client.forgotPasswordChange("asldfkajsfdljk", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "key",
            message: expiredKeyError,
          },
        ],
      },
    });

    //verifying login with new credentials
    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null,
      },
    });
  });
});
