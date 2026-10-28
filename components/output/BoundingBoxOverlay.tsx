import type { TextBlock } from "@/lib/types";

interface BoundingBoxOverlayProps {
  blocks: TextBlock[];
  imageWidth: number;
  imageHeight: number;
}

/**
 * Draws one rectangle per detected word, positioned using the image's
 * natural pixel dimensions as the SVG viewBox -- this means the boxes
 * scale correctly however large or small the image is actually displayed,
 * without any manual coordinate math.
 */
function BoundingBoxOverlay({ blocks, imageWidth, imageHeight }: BoundingBoxOverlayProps) {
  if (blocks.length === 0 || imageWidth === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {blocks.map((block) => (
        <rect
          key={block.blockIndex}
          x={block.position.x}
          y={block.position.y}
          width={block.position.width}
          height={block.position.height}
          fill="none"
          // Flag low-confidence words in red so the user knows to double-check
          // them -- the same idea called out in the original CIS 453 activity
          // diagram ("flag low-confidence words below threshold").
          stroke={block.confidence < 0.6 ? "#C02626" : "#1F4FD8"}
          strokeWidth={2}
          rx={2}
        />
      ))}
    </svg>
  );
}

export default BoundingBoxOverlay;