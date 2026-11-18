import Button from "@/components/ui/Button";

interface UndoButtonProps {
  disabled: boolean;
  onUndo: () => void;
}

function UndoButton({ disabled, onUndo }: UndoButtonProps) {
  if (disabled) return null;

  return (
    <Button variant="ghost" onClick={onUndo}>
      Undo last correction
    </Button>
  );
}

export default UndoButton;