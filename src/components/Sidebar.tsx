import { CheckCircle, ChevronDown } from "lucide-react";
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
  onCloseMobile: () => void;
};

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
  onCloseMobile,
}: SidebarProps) {
  return (
    <div
      className={`absolute md:relative z-40 inset-y-0 left-0 w-72 bg-[#0d1117] border-r border-gray-800 transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-2xl md:shadow-none ${!open && "md:hidden"}`}
    >
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
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
          : EXERCISE_MODULES.map((module) => {
              const isExpanded = expandedModules.includes(module.id);
              const completedInModule = module.levels.filter((level) =>
                completedLevels.includes(level.id),
              ).length;

              return (
                <div key={module.id} className="mb-2">
                  <button
                    onClick={() => onToggleModule(module.id)}
                    className="w-full flex items-start justify-between gap-2 px-4 py-2 text-left text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="min-w-0 flex flex-col text-left">
                      <span>{module.title}</span>
                      <span className="text-xs font-normal text-gray-500 mt-0.5">
                        {completedInModule}/{module.levels.length} Completed
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`mt-0.5 shrink-0 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
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
                              className="text-emerald-500 flex-shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${currentLevelId === level.id ? "border-emerald-500" : "border-gray-600"}`}
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
    </div>
  );
}
