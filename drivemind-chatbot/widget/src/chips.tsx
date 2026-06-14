/**
 * Suggestion chips (T054). Tappable follow-up prompts that continue the
 * car-finding conversation.
 */
export function Chips({ items, onPick }: { items: string[]; onPick: (text: string) => void }) {
  if (items.length === 0) return null;
  return (
    <div class="otto-chips">
      {items.map((chip) => (
        <button class="otto-chip" key={chip} onClick={() => onPick(chip)} type="button">
          {chip}
        </button>
      ))}
    </div>
  );
}
