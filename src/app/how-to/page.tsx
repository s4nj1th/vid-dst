export default function HowToPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">How to Get a Link</h1>

      <p className="mb-4">
        You can use either an <strong>IMDb</strong> or <strong>TMDb</strong>{" "}
        link to load a movie or series. Here’s how to get one:
      </p>

      <section className="mb-8">
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Go to{" "}
            <a
              href="https://www.imdb.com"
              target="_blank"
              className="underline text-blue-400"
            >
              IMDb
            </a>{" "}
            or{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              className="underline text-blue-400"
            >
              TMDb
            </a>
            .
          </li>
          <li>Search for the movie you want to watch.</li>
          <li>
            Copy the URL from the address bar. It will look like:
            <ul className="list-disc list-inside ml-6 text-sm mt-1">
              <li>
                IMDb: <code>https://www.imdb.com/title/tt1132124/</code>
              </li>
              <li>
                TMDb:{" "}
                <code>
                  https://www.themoviedb.org/movie/111-scarface/
                </code>
              </li>
            </ul>
          </li>
          <li>Paste the URL into the input box on the homepage.</li>
        </ol>
      </section>
    </main>
  );
}
