import { Eye, EyeOff } from "lucide-react";

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      title="Change selected"
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 outline-none items-center rounded-full transition-colors focus:outline-none  shrink-0 ${
        checked ? "bg-accent" : "bg-secondary"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function TogglePasswordButton({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-tertiary hover:text-primary transition-colors"
    >
      {show ? (
        <EyeOff className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <Eye className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
