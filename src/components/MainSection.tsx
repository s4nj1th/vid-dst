"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { MdLink, MdMonitor, MdCheckCircle, MdClose } from "react-icons/md";

type MediaType = "movie" | "series";
type IdType = "imdb" | "tmdb" | null;
type HistoryEntry = {
  url: string;
  mediaType: "movie" | "series";
  season?: number;
  episode?: number;
  timestamp: number;
};

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
        setTimeout(() => setCopySuccess(""), 300);
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

  useEffect(() => {
    if (embedUrl) {
      saveToHistory({
        url,
        mediaType,
        season: mediaType === "series" ? season || 1 : undefined,
        episode: mediaType === "series" ? episode || 1 : undefined,
      });
    }
  }, [embedUrl, url, mediaType, season, episode]);

  return (
    <div className="flex flex-col gap-6 items-center max-w-5xl m-auto p-6 min-h-screen text-white relative z-10">
      {!theatreMode && (
        <>
          <div className="flex gap-4">
            {(["movie", "series"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-4 py-2 rounded border transition-all duration-300 ease-in-out cursor-pointer ${
                  mediaType === type
                    ? "bg-white text-black hover:bg-[#f1f1f1] border-white font-black"
                    : "bg-transparent text-white hover:bg-[#222e] border-[#111]"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-sm">
            <input
              type="url"
              placeholder="Enter IMDb or TMDB URL"
              value={url}
              onChange={handleUrlChange}
              className="w-full bg-[#111] text-white border border-[#181818] rounded px-4 py-2 outline-none transition-all duration-300 pr-10"
            />
            {url && (
              <button
                onClick={() => setUrl("")}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition"
              >
                <MdClose className="text-lg" />
              </button>
            )}
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
        </>
      )}

      {embedUrl ? (
        <>
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
              theatreMode
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setTheatreMode(false)}
          />

          <div
            ref={playerRef}
            className={`${
              theatreMode
                ? "fixed z-50 left-0 top-[50%] translate-y-[-50%] w-screen aspect-video transition-opacity duration-300"
                : "relative w-full max-w-3xl mt-10 aspect-video border border-[#111] p-4 rounded"
            }`}
          >
            <iframe
              key={`embed-${embedUrl}`}
              src={embedUrl}
              allowFullScreen
              className="w-full h-full shadow-lg shadow-[#0008]"
            />
          </div>

          {!theatreMode && (
            <div className="flex gap-0">
              <button
                onClick={handleCopy}
                className="cursor-pointer px-4 py-2 bg-[#111] rounded-l-md border border-[#181818] hover:bg-[#222] items-center"
              >
                <MdLink className="text-xl" />
              </button>
              <button
                onClick={() => setTheatreMode(true)}
                className="cursor-pointer px-4 py-2 bg-[#111] rounded-r-md border border-[#181818] hover:bg-[#222] items-center"
              >
                <MdMonitor className="text-xl" />
              </button>
            </div>
          )}

          {copySuccess && (
            <div
              className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-[100] transition-all duration-300 ${
                showToast
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <MdCheckCircle className="text-xl" />
              <span>{copySuccess}</span>
            </div>
          )}
        </>
      ) : (
        <div
          ref={playerRef}
          className="relative w-full max-w-3xl mt-10 aspect-video border border-[#111] p-4 rounded"
        >
          <div className="w-full h-full bg-black flex items-center justify-center text-[#888] text-sm">
            {"<"} your {mediaType} here {">"}
          </div>
        </div>
      )}
    </div>
  );
}

const saveToHistory = (entry: {
  url: string;
  mediaType: MediaType;
  season?: number;
  episode?: number;
}) => {
  const history: HistoryEntry[] = JSON.parse(
    localStorage.getItem("watchHistory") || "[]"
  );

  const exists = history.find((item) => item.url === entry.url);
  if (!exists) {
    const updated: HistoryEntry[] = [
      { ...entry, timestamp: Date.now() },
      ...history,
    ].slice(0, 100);
    localStorage.setItem("watchHistory", JSON.stringify(updated));
  }
};
