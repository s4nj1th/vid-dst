import MainPart from "@/components/MainPart";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-row gap-4 items-center justify-center">
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={72}
          height={72}
        />
        <h1 className="text-4xl font-bold text-center my-8">VidDst</h1>
      </div>
      <MainPart />
    </>
  );
}
