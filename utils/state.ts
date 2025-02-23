import { atom, useAtom } from "jotai";

interface ResetInfo {
  email: string;
  otp: string;
  role: string;
}

const configAtom = atom({ selected: "" });
const command = atom(false);

const resetInfoAtom = atom<ResetInfo>({ email: "", otp: "", role: "" });

const resetPasswordKey = atom<boolean>(false);

export function usePost() {
  return useAtom(configAtom);
}

export function useCommand() {
  return useAtom(command);
}

export function useResetInfo() {
  return useAtom(resetInfoAtom);
}

export function useResetPassword() {
  return useAtom(resetPasswordKey);
}
