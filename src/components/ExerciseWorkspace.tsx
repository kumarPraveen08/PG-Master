import { useEffect, useRef, useState, type RefObject } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Info,
  Layout,
  Lightbulb,
  Maximize2,
  Minimize2,
  Play,
  TerminalSquare,
} from "lucide-react";
import { EXERCISE_MODULES } from "../_data/ExcerciseModule";
import { SplitPane } from "./SplitPane";

type ExerciseLevel = (typeof EXERCISE_MODULES)[number]["levels"][number];
type LeftTab = "learn" | "schema";
type EditorMode = "query" | "terminal";

const EDITOR_MODE_KEY = "pg-learner-editor-mode";

type QueryResult =
  | { type: "error"; message: string }
  | {
      type: "success";
      message: string;
      resultType: string;
      data: Record<string, unknown>[];
    };

function loadEditorMode(): EditorMode {
  try {
    return localStorage.getItem(EDITOR_MODE_KEY) === "terminal" ? "terminal" : "query";
  } catch {
    return "query";
  }
}

function hasFollowingLevel(levelId: string) {
  const levels = EXERCISE_MODULES.flatMap((module) => module.levels);
  const index = levels.findIndex((level) => level.id === levelId);
  return index !== -1 && index < levels.length - 1;
}

type ExerciseWorkspaceProps = {
  level: ExerciseLevel;
  completed: boolean;
  onComplete: () => void;
  onNext: () => void;
};

export function ExerciseWorkspace({
  level,
  completed,
  onComplete,
  onNext,
}: ExerciseWorkspaceProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<LeftTab>("learn");
  const [showHint, setShowHint] = useState(false);
  const [taskMinimized, setTaskMinimized] = useState(false);
  const [consoleMinimized, setConsoleMinimized] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>(loadEditorMode);
  const [seenLevelId, setSeenLevelId] = useState(level.id);
  const commandHistory = useRef<string[]>([]);

  if (seenLevelId !== level.id) {
    setSeenLevelId(level.id);
    setQuery("");
    setResult(null);
    setShowHint(false);
    setActiveTab("learn");
    commandHistory.current = [];
  }

  useEffect(() => {
    try {
      localStorage.setItem(EDITOR_MODE_KEY, editorMode);
    } catch {
      // Preference is optional if storage is unavailable.
    }
  }, [editorMode]);

  const execute = (sql: string): QueryResult => {
    setConsoleMinimized(false);

    if (!sql.trim()) {
      const nextResult: QueryResult = { type: "error", message: "Please enter a SQL query." };
      setResult(nextResult);
      return nextResult;
    }

    const normalizedQuery = sql.replace(/\s+/g, " ").trim().toLowerCase();

    if (level.regex.test(normalizedQuery)) {
      const nextResult: QueryResult = {
        type: "success",
        message: level.successMessage,
        resultType: level.resultType,
        data: level.mockData,
      };
      setResult(nextResult);
      if (!completed) onComplete();
      return nextResult;
    }

    const nextResult: QueryResult = {
      type: "error",
      message: "Syntax error or incorrect logic. Check your query against the requirements.",
    };
    setResult(nextResult);
    return nextResult;
  };

  const runQuery = () => {
    execute(query);
  };

  const canAdvance = completed && result?.type === "success" && hasFollowingLevel(level.id);

  return (
    <div className="h-full min-h-0 min-w-0 flex-1 overflow-hidden">
      <SplitPane
        axis="x"
        initialPercent={40}
        minPercent={20}
        maxPercent={80}
        collapsed={taskMinimized ? "first" : null}
        first={
          <TaskPanel
            level={level}
            activeTab={activeTab}
            minimized={taskMinimized}
            onTabChange={setActiveTab}
            onToggleMinimized={() => setTaskMinimized((open) => !open)}
          />
        }
        second={
          <SplitPane
            axis="y"
            initialPercent={60}
            minPercent={20}
            maxPercent={80}
            collapsed={consoleMinimized ? "second" : null}
            first={
              editorMode === "query" ? (
                <QueryEditor
                  query={query}
                  hint={level.hint}
                  showHint={showHint}
                  onQueryChange={setQuery}
                  onToggleHint={() => setShowHint((open) => !open)}
                  onRun={runQuery}
                  onModeChange={setEditorMode}
                />
              ) : (
                <SqlTerminal
                  key={level.id}
                  query={query}
                  hint={level.hint}
                  showHint={showHint}
                  canAdvance={canAdvance}
                  finished={completed && result?.type === "success" && !hasFollowingLevel(level.id)}
                  onQueryChange={setQuery}
                  onToggleHint={() => setShowHint((open) => !open)}
                  onExecute={execute}
                  onNext={onNext}
                  onModeChange={setEditorMode}
                  commandHistory={commandHistory}
                />
              )
            }
            second={
              <ConsoleOutput
                result={result}
                minimized={consoleMinimized}
                showNext={editorMode === "query" && completed && result?.type === "success"}
                onToggleMinimized={() => setConsoleMinimized((open) => !open)}
                onNext={onNext}
              />
            }
          />
        }
      />
    </div>
  );
}

function TaskPanel({
  level,
  activeTab,
  minimized,
  onTabChange,
  onToggleMinimized,
}: {
  level: ExerciseLevel;
  activeTab: LeftTab;
  minimized: boolean;
  onTabChange: (tab: LeftTab) => void;
  onToggleMinimized: () => void;
}) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col bg-[#0d1117] border-b border-gray-800 md:border-b-0 md:border-r">
      <div className="flex min-h-12 items-center justify-between border-b border-gray-800 bg-[#161b22] px-2">
        {!minimized && (
          <div className="flex h-full items-center">
            <button
              onClick={() => onTabChange("learn")}
              className={`flex h-full items-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "learn"
                  ? "border-emerald-500 bg-[#0d1117] text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <BookOpen size={16} />
              <span>Task</span>
            </button>
            <button
              onClick={() => onTabChange("schema")}
              className={`flex h-full items-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "schema"
                  ? "border-emerald-500 bg-[#0d1117] text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <Layout size={16} />
              <span>Schema</span>
            </button>
          </div>
        )}
        <div className={`flex items-center px-2 ${minimized ? "w-full justify-center" : ""}`}>
          <button
            onClick={onToggleMinimized}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
            title={minimized ? "Expand Panel" : "Minimize Panel"}
          >
            {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="custom-scrollbar flex-1 overflow-y-auto p-5 md:p-6">
          {activeTab === "learn" ? (
            <div className="space-y-6">
              <div>
                <span className="mb-4 inline-block rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-300">
                  {level.difficulty}
                </span>
                <h2 className="mb-4 text-xl font-bold text-gray-100 md:text-2xl">
                  {level.title}
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-gray-300 md:text-base">
                  {level.theory.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-emerald-900/30 bg-emerald-900/10 p-4">
                <h3 className="mb-2 flex items-center text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  <Award size={16} className="mr-2" />
                  Objective
                </h3>
                <p className="font-medium text-gray-200">{level.task}</p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Tables, columns, and sample rows
              </h3>
              <pre className="whitespace-pre-wrap rounded-lg border border-gray-700 bg-[#1c2128] p-4 font-mono text-sm leading-relaxed text-blue-300">
                {level.schema}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EditorModeSwitch({
  mode,
  onChange,
}: {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
}) {
  const options: { id: EditorMode; label: string; icon: typeof Code2 }[] = [
    { id: "query", label: "query.sql", icon: Code2 },
    { id: "terminal", label: "terminal", icon: TerminalSquare },
  ];

  return (
    <div className="flex shrink-0 items-center rounded-md border border-gray-700 bg-[#0d1117] p-0.5">
      {options.map((option) => {
        const Icon = option.icon;
        const active = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-gray-800 text-gray-100"
                : "text-gray-500 hover:text-gray-300"
            }`}
            aria-pressed={active}
          >
            <Icon size={14} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function QueryEditor({
  query,
  hint,
  showHint,
  onQueryChange,
  onToggleHint,
  onRun,
  onModeChange,
}: {
  query: string;
  hint: string;
  showHint: boolean;
  onQueryChange: (value: string) => void;
  onToggleHint: () => void;
  onRun: () => void;
  onModeChange: (mode: EditorMode) => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#010409]">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-gray-800 bg-[#161b22] px-3 py-2">
        <EditorModeSwitch mode="query" onChange={onModeChange} />
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleHint}
            className={`flex items-center space-x-1 rounded-md px-3 py-1.5 text-xs transition-colors ${
              showHint
                ? "bg-yellow-900/30 text-yellow-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-yellow-400"
            }`}
          >
            <Lightbulb size={14} />
            <span className="hidden sm:inline">{showHint ? "Hide Hint" : "Show Hint"}</span>
          </button>
          <button
            onClick={onRun}
            className="flex items-center space-x-1.5 rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
          >
            <Play size={14} className="fill-current" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {showHint && (
        <div className="flex items-start space-x-3 border-b border-yellow-900/50 bg-yellow-900/20 px-4 py-3">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-yellow-500" />
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-yellow-500">
              Hint
            </span>
            <code className="font-mono text-sm text-yellow-200/90">{hint}</code>
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 bg-[#0d1117]">
        <div className="flex w-12 select-none flex-col items-end border-r border-gray-800 bg-[#0d1117] py-4 pr-3 font-mono text-sm text-gray-600">
          1
        </div>
        <textarea
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="-- Write your SQL query here..."
          className="custom-scrollbar h-full flex-1 resize-none bg-transparent p-4 font-mono text-[15px] leading-relaxed text-gray-200 focus:outline-none focus:ring-0"
          spellCheck="false"
        />
      </div>
    </div>
  );
}

function SqlTerminal({
  query,
  hint,
  showHint,
  canAdvance,
  finished,
  onQueryChange,
  onToggleHint,
  onExecute,
  onNext,
  onModeChange,
  commandHistory,
}: {
  query: string;
  hint: string;
  showHint: boolean;
  canAdvance: boolean;
  finished: boolean;
  onQueryChange: (value: string) => void;
  onToggleHint: () => void;
  onExecute: (sql: string) => QueryResult;
  onNext: () => void;
  onModeChange: (mode: EditorMode) => void;
  commandHistory: RefObject<string[]>;
}) {
  const [history, setHistory] = useState<{ id: number; command: string; result: QueryResult }[]>(
    [],
  );
  const nextId = useRef(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyIndex = useRef(commandHistory.current.length);
  const draft = useRef(query);
  const moveCaretToEnd = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [canAdvance]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "0px";
    input.style.height = `${input.scrollHeight}px`;
    if (!moveCaretToEnd.current) return;
    moveCaretToEnd.current = false;
    const end = input.value.length;
    input.setSelectionRange(end, end);
  }, [query]);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.scrollTop = scroll.scrollHeight;
  }, [history, canAdvance, finished]);

  const submit = () => {
    if (!query.trim()) {
      if (canAdvance) onNext();
      return;
    }

    const result = onExecute(query);
    commandHistory.current.push(query);
    historyIndex.current = commandHistory.current.length;
    draft.current = "";
    setHistory((entries) => [...entries, { id: nextId.current++, command: query, result }]);
    onQueryChange("");
    inputRef.current?.focus();
  };

  const recallCommand = (direction: -1 | 1) => {
    const commands = commandHistory.current;
    const index = historyIndex.current;

    if (direction === -1) {
      if (commands.length === 0 || index === 0) return false;
      if (index === commands.length) draft.current = query;
      historyIndex.current = index - 1;
    } else {
      if (index >= commands.length) return false;
      historyIndex.current = index + 1;
    }

    moveCaretToEnd.current = true;
    onQueryChange(
      historyIndex.current === commands.length ? draft.current : commands[historyIndex.current],
    );
    return true;
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#010409]">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-gray-800 bg-[#161b22] px-3 py-2">
        <EditorModeSwitch mode="terminal" onChange={onModeChange} />
        <button
          type="button"
          onClick={onToggleHint}
          className={`flex items-center space-x-1 rounded-md px-3 py-1.5 text-xs transition-colors ${
            showHint
              ? "bg-yellow-900/30 text-yellow-400"
              : "text-gray-400 hover:bg-gray-800 hover:text-yellow-400"
          }`}
        >
          <Lightbulb size={14} />
          <span className="hidden sm:inline">{showHint ? "Hide Hint" : "Show Hint"}</span>
        </button>
      </div>

      {showHint && (
        <div className="flex items-start space-x-3 border-b border-yellow-900/50 bg-yellow-900/20 px-4 py-3">
          <Info size={16} className="mt-0.5 shrink-0 text-yellow-500" />
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-yellow-500">
              Hint
            </span>
            <code className="font-mono text-sm text-yellow-200/90">{hint}</code>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed"
        onMouseDown={(event) => {
          if ((event.target as HTMLElement).closest("button, a, textarea")) return;
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        {history.length === 0 && (
          <p className="mb-4 text-gray-500">Type a query, then press Enter to run it.</p>
        )}

        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id}>
              <PromptLines command={entry.command} />
              <TerminalResult result={entry.result} />
            </div>
          ))}
        </div>

        {canAdvance && (
          <p className="mt-4 text-emerald-400">Press Enter to go to the next exercise.</p>
        )}
        {finished && (
          <p className="mt-4 text-emerald-400">You finished the last exercise.</p>
        )}
      </div>

      <div className="border-t border-gray-800 bg-[#0d1117]">
        <div className="flex items-start gap-2 px-4 py-3">
          <span className="select-none pt-0.5 font-mono text-sm text-emerald-400">postgres=#</span>
          <textarea
            ref={inputRef}
            value={query}
            rows={1}
            onChange={(event) => {
              const value = event.target.value;
              if (historyIndex.current === commandHistory.current.length) draft.current = value;
              onQueryChange(value);
            }}
            onKeyDown={(event) => {
              if (
                (event.key === "ArrowUp" || event.key === "ArrowDown") &&
                !event.altKey &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.shiftKey
              ) {
                const area = inputRef.current;
                if (!area || area.selectionStart !== area.selectionEnd) return;
                const before = area.value.slice(0, area.selectionStart);
                const after = area.value.slice(area.selectionEnd);
                const atFirstLine = !before.includes("\n");
                const atLastLine = !after.includes("\n");
                if (event.key === "ArrowUp" && !atFirstLine) return;
                if (event.key === "ArrowDown" && !atLastLine) return;
                const recalled = recallCommand(event.key === "ArrowUp" ? -1 : 1);
                if (recalled || (event.key === "ArrowUp" && commandHistory.current.length > 0)) {
                  event.preventDefault();
                }
                return;
              }

              if (event.key !== "Enter" || event.shiftKey) return;
              event.preventDefault();
              submit();
            }}
            placeholder={canAdvance ? "" : "SELECT ..."}
            className="max-h-40 min-h-6 flex-1 resize-none overflow-y-auto bg-transparent font-mono text-sm leading-relaxed text-gray-200 focus:outline-none"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
        <div className="border-t border-gray-800/80 px-4 py-1.5 text-[11px] text-gray-500">
          {query.trim()
            ? "Enter runs the query · Shift+Enter inserts a new line · ↑↓ recalls commands"
            : canAdvance
              ? "Press Enter to go to the next exercise"
              : "Enter runs the query · Shift+Enter inserts a new line · ↑↓ recalls commands"}
        </div>
      </div>
    </div>
  );
}

function PromptLines({ command }: { command: string }) {
  return (
    <div>
      {command.split("\n").map((line, index) => (
        <div key={index} className="flex">
          <span className="shrink-0 select-none text-emerald-400">
            {index === 0 ? "postgres=# " : "postgres-# "}
          </span>
          <span className="whitespace-pre-wrap text-gray-200">{line || " "}</span>
        </div>
      ))}
    </div>
  );
}

function TerminalResult({ result }: { result: QueryResult }) {
  if (result.type === "error") {
    return <p className="mt-2 text-red-300">{result.message}</p>;
  }

  const columns = result.data.length > 0 ? Object.keys(result.data[0]) : [];

  return (
    <div className="mt-2 space-y-2">
      <p className="text-emerald-400">{result.message}</p>
      {columns.length > 0 && (
        <div className="overflow-x-auto">
          <table className="border-collapse text-left text-xs">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column} className="border-b border-gray-700 px-3 py-1 font-medium text-gray-400">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.data.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column} className="px-3 py-1 text-gray-300">
                      {row[column] == null ? (
                        <span className="text-gray-500">NULL</span>
                      ) : (
                        String(row[column])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {result.resultType === "command" && result.data.length === 0 && (
        <p className="text-gray-500">Command executed successfully. No rows returned.</p>
      )}
    </div>
  );
}

function ConsoleOutput({
  result,
  minimized,
  showNext,
  onToggleMinimized,
  onNext,
}: {
  result: QueryResult | null;
  minimized: boolean;
  showNext: boolean;
  onToggleMinimized: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col border-t border-gray-800 bg-[#0d1117]">
      <div
        className="flex min-h-12 cursor-pointer items-center justify-between border-b border-gray-800 bg-[#161b22] px-4"
        onClick={onToggleMinimized}
      >
        <div className="flex items-center">
          <TerminalSquare size={16} className="mr-2 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Console Output</span>
        </div>
        <button className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300">
          {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
        </button>
      </div>

      {!minimized && (
        <div className="custom-scrollbar flex-1 overflow-auto p-4">
          {!result ? (
            <div className="flex h-full flex-col items-center justify-center space-y-3 text-gray-500">
              <TerminalSquare size={32} className="opacity-20" />
              <p className="text-sm">Run a query to view execution results.</p>
            </div>
          ) : result.type === "error" ? (
            <div className="flex items-start space-x-3 rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-red-400">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-300">Execution Error</h4>
                <p className="mt-1 font-mono text-sm text-red-200/80">{result.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-emerald-900/30 bg-emerald-900/10 p-3.5 text-emerald-400">
                <div className="flex items-center space-x-3">
                  <Check size={20} />
                  <span className="text-sm font-medium">{result.message}</span>
                </div>
                {showNext && (
                  <button
                    onClick={onNext}
                    className="flex items-center space-x-1.5 rounded bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {(result.resultType === "data" || result.resultType === "command") &&
                result.data.length > 0 && (
                <div className="flex-1 overflow-auto rounded-lg border border-gray-800 bg-[#010409]">
                  <table className="w-full whitespace-nowrap border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-[#161b22]">
                      <tr>
                        {Object.keys(result.data[0]).map((key) => (
                          <th
                            key={key}
                            className="border-b border-gray-800 px-5 py-2.5 text-xs font-semibold capitalize tracking-wider text-gray-400"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/40"
                        >
                          {Object.values(row).map((value, column) => (
                            <td
                              key={column}
                              className="px-5 py-2.5 font-mono text-sm text-gray-300"
                            >
                              {value == null ? (
                                <span className="text-gray-500">NULL</span>
                              ) : (
                                String(value)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {result.resultType === "command" && result.data.length === 0 && (
                <div className="flex items-center rounded-lg border border-gray-800 bg-[#010409] p-3 font-mono text-sm text-gray-500">
                  <Info size={16} className="mr-2" />
                  Command executed successfully. No rows returned.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
