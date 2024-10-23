import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start bg-[#0e4a4a] px-4 pt-20">
      <Image
        src="/logo.png"
        alt="logo"
        width={150}
        height={150}
        className="mb-6"
      />
      <h1 className="mb-2 text-2xl text-foreground">
        Welcome to <span className="text-primary">Rudy!</span>
      </h1>
      <p className="text-md mb-10 px-6 text-center text-foreground">
        The simplest way to build habits and systems in your life
      </p>
      <SignUp />
    </div>
  );
}
