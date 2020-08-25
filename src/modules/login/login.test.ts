import { request } from "graphql-request";
import { invalidLogin } from "./errorMessages";

// const email = "tom@bob.com";
// const password = "asdfasdf";

// const registerMutation = (e: string, p: string) => `
// mutation {
//     register(email: "${e}", password: "${p}") {
//         path
//         message
//     }
// }
// `;

const loginMutation = (e: string, p: string) => `
mutation {
    login(email: "${e}", password: "${p}") {
        path
        message
    }
}
`;

describe("login", () => {
  test("email not found send back error", async () => {
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation("bob@bob.com", "whatever")
    );

    expect(response).toEqual({
      login: [
        {
          path: "email",
          message: invalidLogin,
        },
      ],
    });
  });
});
