import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "@/components/DarkModeToggle";

const retroBtn =
  "border-2 border-current rounded-[5px] shadow-[4px_4px_0_currentColor] px-3 py-1 text-xs font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_currentColor] transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

interface TopBarProps {
  onLogoClick?: () => void;
}

const TopBar = ({ onLogoClick }: TopBarProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-2 bg-card/90 backdrop-blur border-b-2 border-border"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <div className="md:hidden">
        <DarkModeToggle />
      </div>
      <div className="hidden md:block">
        <Link to="/contribute" className={`${retroBtn} text-foreground`}>
          Contribute
        </Link>
      </div>
      <button
        onClick={handleLogoClick}
        className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-foreground hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
      >
        QR Generator
      </button>
      <div className="md:hidden">
        <Link to="/contribute" className={`${retroBtn} text-foreground`}>
          Contribute
        </Link>
      </div>
      <div className="hidden md:block">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default TopBar;
