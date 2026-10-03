import { useEffect, useState } from "react";
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

type QueryResult =
  | { type: "error"; message: string }
  | {
      type: "success";
      message: string;
      resultType: string;
      data: Record<string, unknown>[];
    };

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

  useEffect(() => {
    setQuery("");
    setResult(null);
    setShowHint(false);
    setActiveTab("learn");
  }, [level.id]);

  const runQuery = () => {
    setConsoleMinimized(false);

    if (!query.trim()) {
      setResult({ type: "error", message: "Please enter a SQL query." });
      return;
    }

    const normalizedQuery = query.replace(/\s+/g, " ").trim().toLowerCase();

    if (level.regex.test(normalizedQuery)) {
      setResult({
        type: "success",
        message: level.successMessage,
        resultType: level.resultType,
        data: level.mockData,
      });
      if (!completed) onComplete();
      return;
    }

    setResult({
      type: "error",
      message: "Syntax error or incorrect logic. Check your query against the requirements.",
    });
  };

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
              <QueryEditor
                query={query}
                hint={level.hint}
                showHint={showHint}
                onQueryChange={setQuery}
                onToggleHint={() => setShowHint((open) => !open)}
                onRun={runQuery}
              />
            }
            second={
              <ConsoleOutput
                result={result}
                minimized={consoleMinimized}
                showNext={completed && result?.type === "success"}
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
                Database Schema
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

function QueryEditor({
  query,
  hint,
  showHint,
  onQueryChange,
  onToggleHint,
  onRun,
}: {
  query: string;
  hint: string;
  showHint: boolean;
  onQueryChange: (value: string) => void;
  onToggleHint: () => void;
  onRun: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#010409]">
      <div className="flex min-h-12 items-center justify-between border-b border-gray-800 bg-[#161b22] px-4 py-2">
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-400">
          <Code2 size={16} />
          <span>query.sql</span>
        </div>
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

              {result.resultType === "data" && result.data.length > 0 && (
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
                              {value == null ? "" : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {result.resultType === "command" && (
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
