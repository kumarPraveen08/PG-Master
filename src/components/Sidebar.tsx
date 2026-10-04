import { useMemo, useState } from "react";
import { CheckCircle, ChevronDown, RotateCcw, Search, X } from "lucide-react";
import { DOCS_DATA } from "../_data/DocModule";
import { EXERCISE_MODULES } from "../_data/ExcerciseModule";
import type { AppMode } from "./AppHeader";

type SidebarProps = {
  mode: AppMode;
  open: boolean;
  currentDocId: string;
  expandedDocModules: string[];
  currentLevelId: string;
  expandedModules: string[];
  completedLevels: string[];
  onToggleDocModule: (moduleId: string) => void;
  onSelectDoc: (docId: string) => void;
  onToggleModule: (moduleId: string) => void;
  onSelectLevel: (levelId: string) => void;
  onResetProgress: () => void;
  onCloseMobile: () => void;
};

function matchesSearch(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query);
}

export function Sidebar({
  mode,
  open,
  currentDocId,
  expandedDocModules,
  currentLevelId,
  expandedModules,
  completedLevels,
  onToggleDocModule,
  onSelectDoc,
  onToggleModule,
  onSelectLevel,
  onResetProgress,
  onCloseMobile,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredExerciseModules = useMemo(() => {
    if (!query) return EXERCISE_MODULES;

    return EXERCISE_MODULES.map((module) => {
      const moduleMatches = matchesSearch(module.title, query);
      const levels = module.levels.filter(
        (level) =>
          moduleMatches ||
          matchesSearch(level.title, query) ||
          matchesSearch(level.difficulty, query) ||
          matchesSearch(level.task, query) ||
          matchesSearch(level.id, query),
      );
      return levels.length > 0 ? { ...module, levels } : null;
    }).filter((module): module is (typeof EXERCISE_MODULES)[number] => module !== null);
  }, [query]);

  const handleReset = () => {
    if (
      !window.confirm(
        "Reset all exercise progress? Completed levels and your current place will be cleared.",
      )
    ) {
      return;
    }
    setSearch("");
    onResetProgress();
  };

  return (
    <div
      className={`absolute md:relative z-40 inset-y-0 left-0 w-72 bg-[#0d1117] border-r border-gray-800 transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-2xl md:shadow-none ${!open && "md:hidden"}`}
    >
      {mode === "exercise" && (
        <div className="border-b border-gray-800 px-3 py-3">
          <label className="relative block">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search exercises..."
              className="w-full rounded-md border border-gray-700 bg-[#010409] py-2 pl-8 pr-8 text-sm text-gray-200 placeholder:text-gray-500 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>
      )}

      <div className="custom-scrollbar flex-1 overflow-y-auto py-4">
        {mode === "docs"
          ? DOCS_DATA.map((module) => {
              const isExpanded = expandedDocModules.includes(module.id);
              return (
                <div key={module.id} className="mb-2">
                  <button
                    onClick={() => onToggleDocModule(module.id)}
                    className="w-full flex items-start justify-between gap-2 px-4 py-2 text-left text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <span className="min-w-0">{module.title}</span>
                    <ChevronDown
                      size={16}
                      className={`mt-0.5 shrink-0 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="mt-1 flex flex-col space-y-1">
                      {module.chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => {
                            onSelectDoc(chapter.id);
                            if (window.innerWidth < 768) onCloseMobile();
                          }}
                          className={`w-full text-left pl-8 pr-4 py-2 text-sm transition-all border-l-2 ${
                            currentDocId === chapter.id
                              ? "bg-blue-900/10 border-blue-500 text-blue-400 font-medium"
                              : "border-transparent text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"
                          }`}
                        >
                          {chapter.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          : filteredExerciseModules.length === 0
            ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No exercises match “{search.trim()}”.
              </div>
            )
            : filteredExerciseModules.map((module) => {
              const isExpanded = query ? true : expandedModules.includes(module.id);
              const completedInModule = module.levels.filter((level) =>
                completedLevels.includes(level.id),
              ).length;
              const totalInModule =
                EXERCISE_MODULES.find((item) => item.id === module.id)?.levels.length ??
                module.levels.length;

              return (
                <div key={module.id} className="mb-2">
                  <button
                    onClick={() => {
                      if (query) return;
                      onToggleModule(module.id);
                    }}
                    className="w-full flex items-start justify-between gap-2 px-4 py-2 text-left text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="min-w-0 flex flex-col text-left">
                      <span>{module.title}</span>
                      <span className="text-xs font-normal text-gray-500 mt-0.5">
                        {query
                          ? `${module.levels.length} match${module.levels.length === 1 ? "" : "es"}`
                          : `${completedInModule}/${totalInModule} Completed`}
                      </span>
                    </div>
                    {!query && (
                      <ChevronDown
                        size={16}
                        className={`mt-0.5 shrink-0 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="mt-1 flex flex-col space-y-1">
                      {module.levels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => {
                            onSelectLevel(level.id);
                            if (window.innerWidth < 768) onCloseMobile();
                          }}
                          className={`w-full text-left pl-8 pr-4 py-2 flex items-center space-x-3 text-sm transition-all border-l-2 ${
                            currentLevelId === level.id
                              ? "bg-emerald-900/10 border-emerald-500 text-emerald-400 font-medium"
                              : "border-transparent text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"
                          }`}
                        >
                          {completedLevels.includes(level.id) ? (
                            <CheckCircle
                              size={14}
                              className="text-emerald-500 shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-3.5 h-3.5 rounded-full border shrink-0 ${currentLevelId === level.id ? "border-emerald-500" : "border-gray-600"}`}
                            />
                          )}
                          <span className="truncate">{level.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {mode === "exercise" && (
        <div className="border-t border-gray-800 p-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-700 bg-[#161b22] px-3 py-2 text-sm text-gray-300 transition-colors hover:border-red-900/60 hover:bg-red-950/20 hover:text-red-300"
          >
            <RotateCcw size={14} />
            <span>Reset progress</span>
          </button>
        </div>
      )}
    </div>
  );
}
