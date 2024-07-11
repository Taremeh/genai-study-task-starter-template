"use server"

import { PlatformUserCreateInput } from "@enterprise-commerce/core/platform/types"
import { cookies } from "next/headers"
import { storefrontClient } from "clients/storefrontClient"
import internalClient from "clients/internalClient"
import { COOKIE_ACCESS_TOKEN } from "constants/index"

export async function signupUser({ email, password }: { email: string; password: string }) {
  // const user = await storefrontClient.createUser({ email, password })
  const user = await internalClient.registerUser({ email, password })
  return user
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  //const user = await storefrontClient.createUserAccessToken({ email, password })
  const user = await internalClient.loginUser({ email, password })
  cookies().set(COOKIE_ACCESS_TOKEN, user?.accessToken || "", { expires: new Date(user?.expiresAt || "") })
  return user
}

export async function getCurrentUser() {
  const accessToken = cookies().get(COOKIE_ACCESS_TOKEN)?.value
  // const user = await storefrontClient.getUser(accessToken || "")
  const user = await internalClient.getUser(accessToken || "")
  return user
}

export async function updateUser(input: Pick<PlatformUserCreateInput, "firstName" | "lastName" | "phone">) {
  const accessToken = cookies().get(COOKIE_ACCESS_TOKEN)?.value

  const user = await storefrontClient.updateUser(accessToken!, { ...input })
  return user
}

export async function logoutUser() {
  cookies().delete(COOKIE_ACCESS_TOKEN)
}
