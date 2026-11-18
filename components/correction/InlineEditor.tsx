"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import type { TextBlock } from "@/lib/types";

interface InlineEditorProps {
  block: TextBlock;
  onSave: (blockIndex: number, newText: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function InlineEditor({ block, onSave, onCancel, isSaving }: InlineEditorProps) {
  const [text, setText] = useState(block.text);

  return (
    <div className="mt-3 rounded-control border border-line bg-paper p-4 shadow-lg">
      <Input
        label="Correct this word or phrase"
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoFocus
      />
      <div className="mt-3 flex gap-2">
        <Button
          onClick={() => onSave(block.blockIndex, text)}
          isLoading={isSaving}
          loadingLabel="Re-translating"
          disabled={!text.trim()}
        >
          Save
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default InlineEditor;