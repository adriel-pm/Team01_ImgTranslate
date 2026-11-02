import type { UserPreferences } from "@/lib/types";

interface ModeToggleProps {
  mode: UserPreferences["mode"];
  onChange: (mode: UserPreferences["mode"]) => void;
}
function ModeToggle(_props: ModeToggleProps) {
  return null;
}
export default ModeToggle;