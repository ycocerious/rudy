import { Button } from "@/components/ui/button";
import Image from "next/image";
import { loginWithGoogle } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0e4a4a] px-4">
      <Image
        src="/logo.png"
        alt="logo"
        width={150}
        height={150}
        className="mb-6"
      />
      <h1 className="mb-2 text-2xl">
        Welcome to <span className="text-primary">Rudy!</span>
      </h1>
      <p className="text-md mb-10 px-6 text-center">
        A minimalist habit tracker - track only your sleep, exercise, and
        nutrition
      </p>
      <form>
        <Button
          formAction={loginWithGoogle}
          className="w-full rounded bg-white px-12 py-5 font-bold text-black hover:bg-white/90"
        >
          <Image
            src="/google.svg"
            alt="Google logo"
            width={20}
            height={20}
            className="mr-2"
          />
          <p className="text-base">Log in with Google</p>
        </Button>
      </form>
    </div>
  );
}
