import "@/styles/globals.css";
import LandingPage from "./_components/landing-page";
import { PwaWrapper } from "./_components/pwa-wrapper";

export default function Home() {
  return (
    <PwaWrapper>
      <LandingPage />
    </PwaWrapper>
  );
}
