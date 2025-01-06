import { cn } from "@/utils/cn";
import { LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "./AuthProvider";
import { useOutsideClick } from "@/hooks/useClickOutside";
import useLogout from "@/hooks/useLogout";

const Navbar = () => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setShowDropdown(false));
  const { mutate } = useLogout();
  return (
    <header>
      <nav className="container flex justify-between items-center py-2">
        <Link to="/" className="text-3xl md:text-5xl font-bold">
          LOGO
        </Link>

        <div className="relative" ref={ref}>
          <button
            className="size-10 md:size-12 rounded-full overflow-clip flex justify-center items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src="https://images.pexels.com/photos/29376610/pexels-photo-29376610/free-photo-of-introspective-portrait-of-a-young-woman.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="user"
            />
          </button>
          <span className="text-sm">{user && user.username}</span>
          {showDropdown && (
            <ul
              className={cn(
                "absolute top-[110%] right-0 w-max bg-background-muted transition-opacity duration-700 opacity-0",
                showDropdown ? "opacity-100" : ""
              )}
            >
              <li className="bg-background-muted hover:bg-primary px-2">
                <button
                  className="px-2 py-1"
                  onClick={() => {
                    mutate();
                  }}
                >
                  Logout <LogOut className="inline size-4" />
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
