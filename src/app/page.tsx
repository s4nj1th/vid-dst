import Footer from "@/components/Footer";
import MainPart from "@/components/MainPart";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <nav className="flex flex-row gap-2 items-center px-10 py-4 bg-[#111] text-white h-16">
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={60}
          height={60}
        />
        <h1 className="text-3xl font-bold text-center my-8">VidDst</h1>
      </nav>
      <MainPart />
      <Footer />
    </>
  );
}
