import type { TextBlock } from "@/lib/types";

interface TapToCorrectProps {
  blocks: TextBlock[];
  imageWidth: number;
  imageHeight: number;
  onSelectBlock: (block: TextBlock) => void;
}

/**
 * Invisible tappable regions laid directly over each detected word's
 * bounding box, using the same viewBox-matched-to-image-pixels approach
 * as BoundingBoxOverlay from the OCR sprint, so a tap always lands on the
 * correct word regardless of display size.
 */
function TapToCorrect({ blocks, imageWidth, imageHeight, onSelectBlock }: TapToCorrectProps) {
  if (blocks.length === 0 || imageWidth === 0) return null;

  return (
    <svg viewBox={`0 0 ${imageWidth} ${imageHeight}`} className="absolute inset-0 h-full w-full">
      {blocks.map((block) => (
        <rect
          key={block.blockIndex}
          x={block.position.x}
          y={block.position.y}
          width={block.position.width}
          height={block.position.height}
          fill="transparent"
          className="cursor-pointer hover:fill-blue-500/10"
          role="button"
          tabIndex={0}
          aria-label={`Correct "${block.text}"`}
          onClick={() => onSelectBlock(block)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectBlock(block);
            }
          }}
        />
      ))}
    </svg>
  );
}

export default TapToCorrect;