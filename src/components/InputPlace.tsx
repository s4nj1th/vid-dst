"use client";

import { useState, ChangeEvent } from "react";

type MediaType = "movie" | "series";
type IdType = "imdb" | "tmdb" | null;

export default function InputPlace() {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [season, setSeason] = useState<number | "">("");
  const [episode, setEpisode] = useState<number | "">("");
  const [url, setUrl] = useState<string>("");

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

  return (
    <div className="flex flex-col gap-6 items-center max-w-xl m-auto p-6 min-h-screen text-white">
      <div className="flex gap-4">
        {(["movie", "series"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setMediaType(type)}
            className={`px-4 py-2 rounded border transition-all cursor-pointer ${
              mediaType === type
                ? "bg-white text-black hover:bg-[#f1f1f1] border-white font-black"
                : "bg-transparent text-white hover:bg-[#222e] border-[#cccc]"
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
        className="w-full max-w-sm bg-[#111] text-white border border-[#181818] rounded px-4 py-2 outline-none"
      />

      {embedUrl && (
        <div className="w-full aspect-video mt-4 max-w-3xl">
          <iframe
            src={embedUrl}
            allowFullScreen
            className="w-full h-full rounded border border-white"
          />
        </div>
      )}
    </div>
  );
}
