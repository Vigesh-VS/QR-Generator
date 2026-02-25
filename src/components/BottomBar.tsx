import { Link } from "react-router-dom";

const retroBtn =
  "border-2 border-current rounded-[5px] shadow-[4px_4px_0_currentColor] px-3 py-1 text-xs font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_currentColor] transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

interface BottomBarProps {
  visible: boolean;
  onScrollToTop: () => void;
}

const BottomBar = ({ visible, onScrollToTop }: BottomBarProps) => {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-2 bg-card/90 backdrop-blur border-t-2 border-border transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <span className="text-xs text-muted-foreground font-bold hidden sm:inline">
        Made by Vigesh
      </span>

      <span className="text-sm font-bold text-foreground">QR Generator</span>

      <div className="flex items-center gap-2">
        <Link to="/contribute" className={`${retroBtn} text-foreground`}>
          Contribute
        </Link>
        <button onClick={onScrollToTop} className={`${retroBtn} text-foreground`}>
          ↑ Top
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
