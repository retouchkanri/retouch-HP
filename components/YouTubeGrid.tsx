// ============================================================================
// YouTube動画グリッド / Thumbnail links
// サムネイル画像をクリックすると、別タブでYouTubeの該当動画を開きます。
// ============================================================================

export type YouTubeVideo = {
  title: string;
  thumb: string;
  url: string;
};

export default function YouTubeGrid({ videos }: { videos: YouTubeVideo[] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <a
          key={v.url}
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="relative aspect-video overflow-hidden rounded-xl bg-ink/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.thumb}
              alt={v.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <p className="mt-2 text-sm leading-snug text-ink/80 group-hover:text-brand-700">
            {v.title}
          </p>
        </a>
      ))}
    </div>
  );
}
