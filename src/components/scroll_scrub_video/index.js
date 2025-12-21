import React, { useRef, useEffect, useState } from "react";

export const ScrollScrubVideo = ({ src, caption, scrollContainerRef }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  useEffect(() => {
    const scrollTarget = scrollContainerRef.current;
    if (!scrollTarget || !containerRef.current) return;

    const handleScroll = () => {
        if (!containerRef.current || !videoRef.current || duration === 0) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate progress:
        // When container top is at 0 (viewport top), progress is 0.
        // When container bottom is at viewportHeight (viewport bottom), progress is 1.
        // The container height is 300vh, sticky item is 100vh.
        // Scrollable area = 300vh - 100vh = 200vh.
        
        const totalDistance = containerRect.height - viewportHeight;
        const scrolledDistance = -containerRect.top;
        
        let progress = scrolledDistance / totalDistance;
        
        // Clamp 0 to 1
        progress = Math.max(0, Math.min(1, progress));
        
        const time = progress * duration;
        
        if (Number.isFinite(time)) {
             // Prefer fastSeek for performance if available
             if (videoRef.current.fastSeek) {
                 videoRef.current.fastSeek(time);
             } else {
                 videoRef.current.currentTime = time;
             }
        }
    };

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
        scrollTarget.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef, duration]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: "300vh", // The scroll distance (3x viewport height)
        position: "relative",
        marginBottom: "4rem"
      }}
    >
      <div 
        style={{ 
          position: "sticky", 
          top: 0, 
          height: "100vh", 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        <video
          ref={videoRef}
          src={require(`../../assets/${src}`)}
          onLoadedMetadata={handleLoadedMetadata}
          muted
          playsInline
          style={{ 
            width: "100%", 
            maxHeight: "80vh", 
            objectFit: "cover", 
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        />
        {caption && (
            <p className="text-center text-muted mt-3" style={{ 
                position: "absolute", 
                bottom: "5%", 
                zIndex: 10,
                background: "rgba(0,0,0,0.5)",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                color: "white"
            }}>
                {caption}
            </p>
        )}
      </div>
    </div>
  );
};
