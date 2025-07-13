"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { MdLink, MdMonitor, MdCheckCircle } from "react-icons/md";

type MediaType = "movie" | "series";
type IdType = "imdb" | "tmdb" | null;

export default function InputPlace() {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [season, setSeason] = useState<number | "">("");
  const [episode, setEpisode] = useState<number | "">("");
  const [url, setUrl] = useState<string>("");
  const [theatreMode, setTheatreMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [showToast, setShowToast] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleSeasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSeason(value === "" ? "" : parseInt(value));
  };

  const handleEpisodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEpisode(value === "" ? "" : parseInt(value));
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const extractIdFromUrl = (inputUrl: string): { id: string; type: IdType } => {
    try {
      const parsed = new URL(inputUrl);
      const hostname = parsed.hostname;
      const segments = parsed.pathname.split("/").filter(Boolean);

      if (hostname.includes("imdb.com") && segments[0] === "title") {
        return { id: segments[1], type: "imdb" };
      }

      if (hostname.includes("themoviedb.org")) {
        const isMovie = segments[0] === "movie";
        const isTV = segments[0] === "tv";
        const numericId = segments[1]?.split("-")[0];

        if (numericId && /^\d+$/.test(numericId) && (isMovie || isTV)) {
          return { id: numericId, type: "tmdb" };
        }
      }

      return { id: "", type: null };
    } catch {
      return { id: "", type: null };
    }
  };

  const { id: extractedId, type: idType } = extractIdFromUrl(url);

  const getEmbedUrl = (): string | null => {
    if (!extractedId || !idType) return null;

    const base = mediaType === "movie" ? "movie" : "tv";
    const param = `${idType}=${extractedId}`;
    const seasonValue = season || 1;
    const episodeValue = episode || 1;

    return mediaType === "movie"
      ? `https://vidsrc.xyz/embed/${base}?${param}`
      : `https://vidsrc.xyz/embed/${base}?${param}&season=${seasonValue}&episode=${episodeValue}`;
  };

  const embedUrl = getEmbedUrl();

  const handleCopy = () => {
    if (!embedUrl) return;
    navigator.clipboard.writeText(embedUrl).then(() => {
      setCopySuccess("Copied!");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setCopySuccess(""), 300); // wait for fade-out
      }, 2000);
    });
  };

  useEffect(() => {
    const html = document.documentElement;
    if (theatreMode) {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      html.style.overflow = "";
    }
  }, [theatreMode]);

  useEffect(() => {
    if (!theatreMode) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        playerRef.current &&
        !playerRef.current.contains(event.target as Node)
      ) {
        setTheatreMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [theatreMode]);

  return (
    <div className="flex flex-col gap-6 items-center max-w-5xl m-auto p-6 min-h-screen text-white relative z-10">
      {!theatreMode && (
        <>
          <div className="flex gap-4 transition-all duration-300 ease-in-out">
            {(["movie", "series"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-4 py-2 rounded border transition-all duration-300 ease-in-out cursor-pointer ${
                  mediaType === type
                    ? "bg-white text-black hover:bg-[#f1f1f1] border-white font-black"
                    : "bg-transparent text-white hover:bg-[#222e] border-[#eeec]"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {mediaType === "series" && (
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <div className="flex">
                <span className="px-4 flex items-center justify-center bg-[#111] text-white rounded-l text-sm w-24 border border-r-0 border-[#111]">
                  Season
                </span>
                <input
                  type="number"
                  min={1}
                  value={season}
                  onChange={handleSeasonChange}
                  placeholder="1"
                  className="flex-1 bg-[#0d0d0d] text-white border border-l-0 border-[#111] rounded-r px-4 py-2 outline-none"
                />
              </div>
              <div className="flex">
                <span className="px-4 flex items-center justify-center bg-[#111] text-white rounded-l text-sm w-24 border border-r-0 border-[#111]">
                  Episode
                </span>
                <input
                  type="number"
                  min={1}
                  value={episode}
                  onChange={handleEpisodeChange}
                  placeholder="1"
                  className="flex-1 bg-[#0d0d0d] text-white border border-l-0 border-[#111] rounded-r px-4 py-2 outline-none"
                />
              </div>
            </div>
          )}

          <input
            type="url"
            placeholder="Enter IMDb or TMDB URL"
            value={url}
            onChange={handleUrlChange}
            className="w-full max-w-sm bg-[#111] text-white border border-[#181818] rounded px-4 py-2 outline-none transition-all duration-300"
          />
        </>
      )}

      {embedUrl && (
        <>
          <div
            className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-all duration-500 ease-in-out ${
              theatreMode
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div ref={playerRef} className="w-full max-w-6xl aspect-video">
              <iframe
                src={embedUrl}
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {!theatreMode && (
            <>
              <div className="w-full max-w-3xl aspect-video mt-4 transition-all duration-500 ease-in-out">
                <iframe
                  src={embedUrl}
                  allowFullScreen
                  className="w-full h-full p-4 border border-[#111] rounded"
                />
              </div>

              <div className="flex gap-0 mt-4">
                <button
                  onClick={handleCopy}
                  className="relative px-4 py-2 bg-[#111] rounded-l-md cursor-pointer border border-[#181818] font-medium transition-all duration-300 ease-in-out flex items-center gap-2"
                >
                  <MdLink className="text-xl" />
                </button>

                <button
                  onClick={() => setTheatreMode(true)}
                  className="px-4 py-2 bg-[#111] rounded-r-md border transition-all duration-300 ease-in-out cursor-pointer text-white hover:bg-[#222] border-[#181818] flex items-center gap-2"
                >
                  <MdMonitor className="text-xl" />
                </button>
              </div>

              {/* Toast */}
              {copySuccess && (
                <div
                  className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-[100] transition-all duration-300 ease-out
                    ${showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
                  `}
                >
                  <MdCheckCircle className="text-xl" />
                  <span>{copySuccess}</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
