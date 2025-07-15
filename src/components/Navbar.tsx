import Image from "next/image";
import Link from "next/link";
import { MdHistory } from "react-icons/md";

export default function Navbar() {
  return (
    <nav className="bg-[#111] text-white border-b border-[#181818]">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4 h-20">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/favicon.ico" alt="Logo" width={48} height={48} />
          <h1 className="text-2xl font-bold">VidDst</h1>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/history"
            className="hover:text-white transition-all text-gray-300"
          >
            <MdHistory size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
