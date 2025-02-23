/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import ResetModal from "@/components/modals/resetmodal";
import { ResetPasswordAction, VerifyEmailAction } from "@/app/action";

export default function Page() {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (state) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      // Handle password reset logic
      const res = await ResetPasswordAction(email, otp, password, "recruit");
      if (res?.success) {
        toast.success(res.message);
        setTimeout(() => { }, 1000);
        router.push("/recruit");
      } else {
        if (res?.message) {
          toast.error(res.message);
        }
      }
    } else {
      // Handle email submission logic
      const res = await VerifyEmailAction(email, "recruit");
      if (res?.success) {
        setModal(true);
      } else {
        toast.error("Invalid email");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2 relative">
      <div
        className="block lg:hidden absolute inset-0 -z-10 
                   bg-[url('/side.jpg')] bg-cover bg-center bg-no-repeat"
      />
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center sm:py-12 py-16">
        <div className="mx-auto grid w-[320px] xs:w-[350px] gap-6 p-6 rounded-xl bg-white/30 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:rounded-none">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-balance text-black">
              {state
                ? "Enter your password to reset password"
                : "Enter your email below to change the password of your account"}
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {!state && (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  placeholder="johndoe@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            )}
            {state && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
            )}
            <Submit state={state} loading={loading} />
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block h-screen">
        <img
          src="/side.jpg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <Link href="/" className="absolute flex items-center gap-1 top-4 left-6 font-bold text-3xl text-purple-600">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src="/logo.svg" /> <span className="text-lg mt-2">InternHub</span>
      </Link>
      <ResetModal
        isModalOpen={modal}
        role="recruit"
        email={email}
        otp={otp}
        setOtp={setOtp}
        setState={setState}
        handleCloseModal={() => {
          setModal(false);
        }}
      />
      <Toaster />
    </div>
  );
}

function Submit({ state, loading }: { state: boolean; loading: boolean }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="block w-full rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white"
    >
      {loading ? (
        <div className="flex items-center justify-center w-full">
          <div className="loader"></div>
        </div>
      ) : state ? (
        "Reset"
      ) : (
        "Verify"
      )}
    </Button>
  );
}
