import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface LightboxProps {
  images: { src: string; caption?: string }[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = "hidden";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, images.length]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const showPrev = currentIndex > 0;
  const showNext = currentIndex < images.length - 1;

  const overlay = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          fontSize: 20,
          color: "#555",
          padding: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      {/* Image Counter */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 48,
          fontSize: 13,
          color: "#555",
          fontFamily: "monospace",
          pointerEvents: "none",
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev Arrow */}
      {showPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prev) => prev - 1);
          }}
          style={{
            position: "absolute",
            left: 24,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 40,
            color: "#aaa",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 16,
          }}
        >
          ‹
        </button>
      )}

      {/* Next Arrow */}
      {showNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prev) => prev + 1);
          }}
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 40,
            color: "#aaa",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 16,
          }}
        >
          ›
        </button>
      )}

      {/* Image Container */}
      <img
        src={currentImage.src}
        alt={currentImage.caption || "Lightbox image"}
        style={{
          maxHeight: "85vh",
          maxWidth: "90vw",
          objectFit: "contain",
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Caption */}
      {currentImage.caption && (
        <div
          style={{
            fontSize: 14,
            color: "#777",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          {currentImage.caption}
        </div>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
