import { useOutsideClick } from "@/hooks/useClickOutside";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  value: string;
  placeholder: string;
  onChange: (value: any) => void;
  options: { label: string; value: string }[];
}
const Select: React.FC<Props> = ({ value, placeholder, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const optionsRef = useRef<HTMLUListElement>(null);

  useOutsideClick(optionsRef, () => setIsOpen(false));

  return (
    <div
      role="combobox"
      aria-controls="select-options"
      className="relative w-full p-1 border-2"
    >
      <button
        type="button"
        className="w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || placeholder}
        <ChevronDown
          className={cn(
            "absolute top-1/2 right-0 -translate-y-1/2 transition-transform duration-150",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <ul
          id="select-options"
          role="listbox"
          ref={optionsRef}
          className={cn(
            "absolute right-0 top-[105%] bg-background w-full text-center space-y-2 transition-all duration-300 @starting",
            isOpen ? "opacity-100 block" : "opacity-0 hidden"
          )}
        >
          {options.map((option, index) => (
            <li
              tabIndex={1}
              role="option"
              className="w-full hover:bg-background-muted py-1"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              key={index}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Select;
