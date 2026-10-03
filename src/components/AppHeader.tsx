import { Award, BookText, Code, Database, Menu } from "lucide-react";

type AppMode = "docs" | "exercise";

type AppHeaderProps = {
  mode: AppMode;
  progress: number;
  showCertificate: boolean;
  onToggleSidebar: () => void;
  onModeChange: (mode: AppMode) => void;
  onOpenCertificate: () => void;
};

export function AppHeader({
  mode,
  progress,
  showCertificate,
  onToggleSidebar,
  onModeChange,
  onOpenCertificate,
}: AppHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-[#161b22] border-b border-gray-800 flex-shrink-0 z-20 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <Database size={20} className="text-emerald-500" />
          <h1 className="text-lg font-bold text-gray-100 tracking-wide hidden sm:block">
            PG Master
          </h1>
        </div>
      </div>

      <div className="flex items-center bg-[#0d1117] p-1 rounded-lg border border-gray-800">
        <button
          onClick={() => onModeChange("docs")}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            mode === "docs"
              ? "bg-gray-800 text-white shadow"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <BookText size={14} className="mr-2" />
          Learn
        </button>
        <button
          onClick={() => onModeChange("exercise")}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            mode === "exercise"
              ? "bg-gray-800 text-white shadow"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Code size={14} className="mr-2" />
          Practice
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-3 w-auto">
        {showCertificate && (
          <button
            onClick={onOpenCertificate}
            className="flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 px-3 py-1.5 rounded-md text-sm font-bold transition-all shadow-sm mr-2 animate-pulse"
          >
            <Award size={16} />
            <span>Certificate</span>
          </button>
        )}
        <div className="flex-1 w-32 bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
          <div
            className="bg-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-400 w-8 text-right">
          {progress}%
        </span>
      </div>
    </header>
  );
}

export type { AppMode };
