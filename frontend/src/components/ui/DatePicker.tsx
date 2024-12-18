import { formatDate } from "@/utils/formatDate";
import { Calendar } from "lucide-react";
import { useRef } from "react";

interface DatePickerProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  date: string;
  setDate: (value: string) => void;
}
const DatePicker: React.FC<DatePickerProps> = ({ date, setDate, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <input
        type="date"
        {...props}
        ref={inputRef}
        className="opacity-0 pointer-events-none"
        value={date}
        onChange={(e) => {
          setDate(formatDate(e.target.valueAsDate));
        }}
        aria-hidden
        tabIndex={-1}
      />
      <button
        className="absolute inset-0 border-2 rounded-md text-center flex justify-center items-center"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.showPicker();
        }}
      >
        {date || "Select Date"}
        <Calendar className="absolute right-2 size-5" />
      </button>
    </div>
  );
};

export default DatePicker;
