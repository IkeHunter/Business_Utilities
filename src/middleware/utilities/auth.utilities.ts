/**
 * @fileoverview Utility functions for authentication middleware.
 */
import "dotenv/config";
import {  NODE_ENV } from "src/config";

/** Error message if no token provided */
export const errNoToken = { message: "No token, authorization denied" };
/** Unit testing, force token to be invalid */
export const invalidToken = "invalidToken";
/** Error message if token unauthorized */
export const errUnauthorized = { message: "Unauthorized" };
/** Error message if token invalid */
export const errInvalidToken = { message: "Invalid token" };

export interface AuthServiceResponse {
  status: number;
  userId: string;
  email: string;
}

/**
 * Verify user if connected to network,
 * otherwise mock verification process.
 *
 * @param token Authorization token (without bearer string)
 * @returns object representing user data returned from auth service
 */
export const verifyUser = async (token: string): Promise<AuthServiceResponse> => {
  let data: AuthServiceResponse = {
    status: 200,
    userId: "",
    email: "",
  };

  if (NODE_ENV === "production" || NODE_ENV === "network") {
    console.log("Verifying user with auth service, token: ", token);
    // let authRes: any = await fetch(AUTH_SERVICE_URL + "/verify", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // data.status = authRes.status;
    // if (authRes.status !== 200) return data;

    // try {
    //   (data.userId = authRes.userId), (data.email = authRes.email);
    // } catch (error) {
    //   console.log(error);
    //   data.userId = "";
    //   data.email = "";
    //   return data;
    // }
  } else {
    if (token === invalidToken) {
      data.status = 401;
      return data;
    }
  }
  return data;
};
