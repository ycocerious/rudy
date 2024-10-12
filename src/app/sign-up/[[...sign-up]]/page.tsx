import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start bg-[#0e4a4a] pt-10">
      <Image
        src="/logo.png"
        alt="logo"
        width={150}
        height={150}
        className="mb-6"
      />
      <h1 className="mb-2 text-2xl text-white">
        Welcome to <span className="text-[#5ce1e6]">Rudy!</span>
      </h1>
      <p className="text-md mb-10 text-center text-white">
        The simplest way to build habits and systems in your life
      </p>
      <SignUp />
    </div>
  );
}
