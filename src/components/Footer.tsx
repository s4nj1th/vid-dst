export default function Footer() {
  return (
    <footer className="w-full text-sm text-gray-400 bg-[#0d0d0d] border-t border-[#111] mt-10">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-4">
        <div>
          <h2 className="text-white font-semibold text-lg">Video Destination</h2>
          <p className="mt-1">
            A custom interface for{" "}
            <a
              href="https://vidsrc.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition"
            >
              VidSrc
            </a>
            , built to simplify and speed up streaming from a clean, responsive UI.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 text-sm">
          <a
            href="https://github.com/s4nj1th/vid-dst"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline"
          >
            Source Code
          </a>
          <a
            href="https://github.com/s4nj1th"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline"
          >
            GitHub Profile
          </a>
          <a
            href="mailto:sanjith.develops@gmail.com"
            className="hover:text-white underline"
          >
            Email
          </a>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-[#111] text-xs">
          <span>© {new Date().getFullYear()} Video Destination</span>
          <span>
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Next.js
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
