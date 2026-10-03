import { useEffect, useState } from "react";
import { DOCS_DATA } from "./_data/DocModule";
import { EXERCISE_MODULES } from "./_data/ExcerciseModule";
import { AppHeader, type AppMode } from "./components/AppHeader";
import { CertificateModal } from "./components/CertificateModal";
import { DocsView } from "./components/DocsView";
import { ExerciseWorkspace } from "./components/ExerciseWorkspace";
import { Sidebar } from "./components/Sidebar";
import { PROGRESS_KEY, loadProgress, type StoredProgress } from "./lib/progress";

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("exercise");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDocId, setCurrentDocId] = useState("1-1");
  const [expandedDocModules, setExpandedDocModules] = useState(["doc-1", "doc-2"]);
  const [savedProgress] = useState(loadProgress);
  const [currentLevelId, setCurrentLevelId] = useState(savedProgress.currentLevelId);
  const [expandedModules, setExpandedModules] = useState(savedProgress.expandedModules);
  const [completedLevels, setCompletedLevels] = useState<string[]>(
    savedProgress.completedLevels,
  );
  const [showCertificate, setShowCertificate] = useState(false);

  const currentLevel =
    EXERCISE_MODULES.flatMap((module) => module.levels).find(
      (level) => level.id === currentLevelId,
    ) || EXERCISE_MODULES[0].levels[0];

  const currentDoc =
    DOCS_DATA.flatMap((module) => module.chapters).find(
      (chapter) => chapter.id === currentDocId,
    ) || DOCS_DATA[0].chapters[0];

  const currentDocModule =
    DOCS_DATA.find((module) => module.chapters.some((chapter) => chapter.id === currentDoc.id)) ||
    DOCS_DATA[0];

  const totalExercises = EXERCISE_MODULES.reduce(
    (count, module) => count + module.levels.length,
    0,
  );
  const progressPercentage = Math.round((completedLevels.length / totalExercises) * 100);
  const isAllCompleted = completedLevels.length === totalExercises && totalExercises > 0;

  useEffect(() => {
    if (document.getElementById("html2pdf-script")) return;
    const script = document.createElement("script");
    script.id = "html2pdf-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const payload: StoredProgress = {
      completedLevels,
      currentLevelId,
      expandedModules,
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
  }, [completedLevels, currentLevelId, expandedModules]);

  const toggleId = (ids: string[], id: string) =>
    ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];

  const completeCurrentLevel = () => {
    setCompletedLevels((prev) => {
      if (prev.includes(currentLevelId)) return prev;
      const next = [...prev, currentLevelId];
      if (next.length === totalExercises) {
        window.setTimeout(() => setShowCertificate(true), 1000);
      }
      return next;
    });
  };

  const goToNextLevel = () => {
    let foundCurrent = false;
    let finishedModuleId: string | null = null;

    for (const module of EXERCISE_MODULES) {
      for (const level of module.levels) {
        if (foundCurrent) {
          setCurrentLevelId(level.id);
          setExpandedModules((prev) => {
            const withoutFinished =
              finishedModuleId && finishedModuleId !== module.id
                ? prev.filter((id) => id !== finishedModuleId)
                : prev;
            return withoutFinished.includes(module.id)
              ? withoutFinished
              : [...withoutFinished, module.id];
          });
          return;
        }

        if (level.id === currentLevelId) {
          foundCurrent = true;
          finishedModuleId = module.id;
        }
      }
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#010409] font-sans text-gray-300 selection:bg-emerald-500/30">
      <AppHeader
        mode={appMode}
        progress={progressPercentage}
        showCertificate={isAllCompleted}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        onModeChange={setAppMode}
        onOpenCertificate={() => setShowCertificate(true)}
      />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          mode={appMode}
          open={isSidebarOpen}
          currentDocId={currentDocId}
          expandedDocModules={expandedDocModules}
          currentLevelId={currentLevelId}
          expandedModules={expandedModules}
          completedLevels={completedLevels}
          onToggleDocModule={(moduleId) =>
            setExpandedDocModules((prev) => toggleId(prev, moduleId))
          }
          onSelectDoc={setCurrentDocId}
          onToggleModule={(moduleId) =>
            setExpandedModules((prev) => toggleId(prev, moduleId))
          }
          onSelectLevel={setCurrentLevelId}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {appMode === "docs" ? (
          <DocsView
            module={currentDocModule}
            chapter={currentDoc}
            onPractice={() => setAppMode("exercise")}
          />
        ) : (
          <ExerciseWorkspace
            level={currentLevel}
            completed={completedLevels.includes(currentLevelId)}
            onComplete={completeCurrentLevel}
            onNext={goToNextLevel}
          />
        )}
      </div>

      {showCertificate && <CertificateModal onClose={() => setShowCertificate(false)} />}
    </div>
  );
}
