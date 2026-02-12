import { Button } from "@/components/ui/button";

type Props = {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
};

export function ProfileActions({ onSave, onCancel, isSaving }: Props) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        onClick={onSave}
        variant="save"
        className="flex-1"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
      <Button
        onClick={onCancel}
        variant="cancel"
        className="flex-1"
        disabled={isSaving}
      >
        Cancel
      </Button>
    </div>
  );
}
