
import type { SceneDescription } from "@/lib/types";

interface ObjectDescriptionProps {
  result: SceneDescription | null;
}

function ObjectDescription({ result }: ObjectDescriptionProps) {
  if (!result) return null;

  return (
    <div className="mt-6">
      <h2 className="text-sm font-medium text-ink">
        What's in this image
      </h2>
      <p className="mt-2 rounded-control border border-line bg-wash px-4 py-3 text-[15px] text-ink">
        {result.description}
      </p>
    </div>
  );
}

export default ObjectDescription;
