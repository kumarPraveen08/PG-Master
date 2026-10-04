import { EXERCISE_MODULES } from "../_data/ExcerciseModule";

export const PROGRESS_KEY = "pg-learner-progress";

export type StoredProgress = {
  completedLevels: string[];
  currentLevelId: string;
  expandedModules: string[];
};

export const DEFAULT_PROGRESS: StoredProgress = {
  completedLevels: [],
  currentLevelId: "1-1",
  expandedModules: ["mod-1"],
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function loadProgress(): StoredProgress {
  const fallback: StoredProgress = { ...DEFAULT_PROGRESS };

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return fallback;

    const data = parsed as Partial<StoredProgress>;
    const levelIds = new Set(
      EXERCISE_MODULES.flatMap((mod) => mod.levels.map((level) => level.id)),
    );
    const moduleIds = new Set(EXERCISE_MODULES.map((mod) => mod.id));
    const completedLevels = isStringArray(data.completedLevels)
      ? data.completedLevels.filter((id) => levelIds.has(id))
      : [];
    const currentLevelId =
      typeof data.currentLevelId === "string" && levelIds.has(data.currentLevelId)
        ? data.currentLevelId
        : fallback.currentLevelId;
    const savedModules = isStringArray(data.expandedModules)
      ? data.expandedModules.filter((id) => moduleIds.has(id))
      : [];
    const currentModuleId =
      EXERCISE_MODULES.find((mod) =>
        mod.levels.some((level) => level.id === currentLevelId),
      )?.id ?? "mod-1";

    return {
      completedLevels,
      currentLevelId,
      expandedModules: savedModules.includes(currentModuleId)
        ? savedModules
        : [...savedModules, currentModuleId],
    };
  } catch {
    return fallback;
  }
}
