'use client';

interface VideoEmbedProps {
  vimeoId: string;
  title?: string;
  className?: string;
}

export function VideoEmbed({ vimeoId, title = "Educational Video", className = "" }: VideoEmbedProps) {
  if (!vimeoId) {
    return (
      <div className={`aspect-video bg-white/5 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-white/60 text-sm">Video will be added here</p>
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&background=1&autoplay=0&loop=0&muted=1`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
        className="w-full h-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}

// Configuration object for easy editing of video IDs
export const RESULT_VIDEOS = {
  BANKRUPT: '', // Video ID for when user goes to $0.00
  TIMEOUT: '',  // Video ID for when user doesn't reach $150
  WON: '',      // Video ID for when user reaches $150+
} as const;

export type VideoType = keyof typeof RESULT_VIDEOS;
