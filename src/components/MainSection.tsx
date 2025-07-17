"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent } from "react";
import { IoMdClipboard } from "react-icons/io";
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

export default function MainSection() {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [season, setSeason] = useState<number | "">("");
  const [episode, setEpisode] = useState<number | "">("");
  const [url, setUrl] = useState<string>("");
  const [theatreMode, setTheatreMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [showToast, setShowToast] = useState(false);

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
      const url = new URL(inputUrl);
      const hostname = url.hostname.toLowerCase();
      const pathSegments = url.pathname.split("/").filter(Boolean);

      if (hostname.includes("imdb.com")) {
        const imdbIndex = pathSegments.indexOf("title");
        const imdbId = pathSegments[imdbIndex + 1];
        if (/^tt\d+$/.test(imdbId)) {
          return { id: imdbId, type: "imdb" };
        }
      }

      if (hostname.includes("themoviedb.org")) {
        const [typeSegment, idSegment] = pathSegments;
        if ((typeSegment === "movie" || typeSegment === "tv") && idSegment) {
          const numericId = idSegment.split("-")[0];
          if (/^\d+$/.test(numericId)) {
            return { id: numericId, type: "tmdb" };
          }
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
      setTimeout(() => setShowToast(false), 2000);
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
    if (embedUrl) {
      saveToHistory({
        url,
        mediaType,
        season: mediaType === "series" ? season || 1 : undefined,
        episode: mediaType === "series" ? episode || 1 : undefined,
      });
    }
  }, [embedUrl, url, mediaType, season, episode]);

  useEffect(() => {
    if (!showToast && copySuccess) {
      const timeout = setTimeout(() => setCopySuccess(""), 500);
      return () => clearTimeout(timeout);
    }
  }, [showToast, copySuccess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "t" || e.key === "T") && embedUrl != null) {
        setTheatreMode((prev) => !prev);
      }
      if (e.key === "Escape") {
        setTheatreMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [embedUrl]);

  return (
    <>
      <div className="flex flex-col-reverse xl:flex-row items-start justify-center gap-10 p-6 min-h-screen text-white w-full relative xl:mt-20 -mt-20">
        <div className="w-full max-w-[300px] xl:mx-0 mx-auto xl:my-4 space-y-4">
          <div className="flex gap-4 justify-center xl:justify-end">
            {(["movie", "series"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-4 py-2 rounded border transition-all duration-300 cursor-pointer ${
                  mediaType === type
                    ? "bg-white hover:bg-[#f1f1f1] text-black font-black border-white"
                    : "bg-transparent text-white border-[#111] hover:bg-[#222e]"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-lg">
            <input
              type="url"
              placeholder="Enter IMDb or TMDB URL"
              value={url}
              onChange={handleUrlChange}
              className="w-full bg-[#111] text-white border border-[#181818] rounded px-4 py-2 pr-10 outline-none"
            />
            {url ? (
              <button
                onClick={() => setUrl("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <MdClose className="text-lg" />
              </button>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) setUrl(text);
                  } catch (err) {
                    console.error("Clipboard read failed:", err);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
              >
                <IoMdClipboard className="text-lg" />
              </button>
            )}
          </div>

          {mediaType === "series" && (
            <div className="space-y-2 w-full max-w-lg">
              {[
                {
                  label: "Season",
                  value: season,
                  onChange: handleSeasonChange,
                },
                {
                  label: "Episode",
                  value: episode,
                  onChange: handleEpisodeChange,
                },
              ].map(({ label, value, onChange }) => (
                <div className="flex w-full" key={label}>
                  <span className="w-24 text-center px-4 py-2 bg-[#111] border border-r-0 border-[#111] rounded-l text-sm">
                    {label}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={value}
                    onChange={onChange}
                    placeholder="1"
                    className="flex-1 w-full bg-[#0d0d0d] text-white border border-l-0 border-[#111] rounded-r px-4 py-2 outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto xl:mx-0">
          {!theatreMode && (
            <div className="relative w-full aspect-video border border-[#111] p-4 rounded transition-all duration-300">
              {embedUrl ? (
                <iframe
                  key={`embed-${embedUrl}`}
                  src={embedUrl}
                  allowFullScreen
                  className="w-full h-full aspect-video shadow-lg shadow-[#0008]"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-[#888] text-md relative overflow-hidden shadow-lg shadow-[#0008]">
                  <div className="relative text-center">
                    No {mediaType} loaded. Tune in with a link.
                    <Link
                      href="/how-to"
                      className="align-super text-xs ml-1 text-[#666] hover:text-white transition-colors"
                      title="Help or Info"
                    >
                      [?]
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {embedUrl && (
            <div className="flex gap-0 justify-center">
              <button
                onClick={handleCopy}
                className="cursor-pointer px-4 py-2 bg-[#111] border border-[#181818] rounded-l-lg hover:bg-[#222]"
              >
                <MdLink className="text-xl" />
              </button>
              <button
                onClick={() => setTheatreMode(true)}
                className="cursor-pointer px-4 py-2 bg-[#111] border border-[#181818] rounded-r-lg hover:bg-[#222]"
              >
                <MdMonitor className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {copySuccess && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg flex items-center gap-2 z-[100] transition-all duration-500
              ${
                showToast
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }
              bg-green-600 text-white`}
          >
            <MdCheckCircle className="text-xl" />
            <span>{copySuccess}</span>
          </div>
        )}
      </div>

      {theatreMode && embedUrl && (
        <>
          <div
            className="fixed inset-0 bg-black z-[1000] items-center justify-center flex"
            onClick={() => setTheatreMode(false)}
          >
            <iframe
              src={embedUrl}
              allowFullScreen
              className="w-full aspect-video object-cover"
            />
          </div>
        </>
      )}
    </>
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
