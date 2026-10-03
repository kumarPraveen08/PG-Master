import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  BookText,
  CheckCircle,
  ChevronRight,
  Layout,
  TerminalSquare,
} from "lucide-react";
import { DOCS_DATA } from "../_data/DocModule";

type DocModule = (typeof DOCS_DATA)[number];
type DocChapter = DocModule["chapters"][number];

type DocsViewProps = {
  module: DocModule;
  chapter: DocChapter;
  onPractice: () => void;
};

export function DocsView({ module, chapter, onPractice }: DocsViewProps) {
  const paragraphs = chapter.content
    ?.trim()
    .split(/\n\s*\n/)
    .filter(Boolean);

  return (
    <div className="h-full min-w-0 flex-1 bg-[#0d1117] overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-blue-400 text-sm font-medium">
          <BookText size={18} />
          <span>PostgreSQL Documentation</span>
          <ChevronRight size={14} className="text-gray-600" />
          <span className="text-gray-500">{module.title}</span>
          <ChevronRight size={14} className="text-gray-600" />
          <span className="text-gray-400">{chapter.title}</span>
        </div>

        <div className="mb-8 pb-6 border-b border-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
            {chapter.title}
          </h1>
          {module.description && (
            <p className="mt-3 max-w-3xl text-sm md:text-base leading-relaxed text-gray-400">
              {module.description}
            </p>
          )}
        </div>

        <div className="space-y-8">
          {paragraphs && paragraphs.length > 0 && (
            <section>
              <div className="space-y-5 text-gray-300 text-sm md:text-base leading-7">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </section>
          )}

          {chapter.keyPoints && chapter.keyPoints.length > 0 && (
            <section className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-emerald-900/30 bg-emerald-900/10">
                <CheckCircle size={17} className="text-emerald-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Key Points
                </h2>
              </div>
              <ul className="p-5 space-y-3">
                {chapter.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm md:text-base text-gray-300 leading-relaxed"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {chapter.diagram && (
            <section className="rounded-xl border border-gray-800 bg-[#010409] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-[#161b22]">
                <Layout size={17} className="text-blue-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Diagram
                </h2>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <pre className="p-5 min-w-max font-mono text-sm leading-6 text-blue-200 whitespace-pre">
                  {chapter.diagram.trim()}
                </pre>
              </div>
            </section>
          )}

          {chapter.importantTerms && chapter.importantTerms.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={17} className="text-violet-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Important Terms
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {chapter.importantTerms.map((term) => (
                  <span
                    key={term}
                    className="px-3 py-1.5 rounded-md border border-violet-900/50 bg-violet-950/20 text-violet-300 font-mono text-sm"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </section>
          )}

          {chapter.commands && chapter.commands.length > 0 && (
            <section className="rounded-xl border border-gray-800 overflow-hidden bg-[#010409]">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-[#161b22]">
                <TerminalSquare size={17} className="text-amber-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Commands to Know
                </h2>
              </div>
              <div className="divide-y divide-gray-800">
                {chapter.commands.map((command, index) => (
                  <div key={index} className="px-5 py-3 overflow-x-auto custom-scrollbar">
                    <code className="font-mono text-sm text-amber-200 whitespace-pre">
                      {command}
                    </code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {chapter.warning && (
            <section className="flex items-start gap-3 rounded-xl border border-yellow-900/50 bg-yellow-950/20 p-5">
              <AlertCircle size={20} className="mt-0.5 text-yellow-500 flex-shrink-0" />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-yellow-500 mb-1">
                  Important
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-yellow-100/80">
                  {chapter.warning}
                </p>
              </div>
            </section>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between items-center">
          <button
            onClick={onPractice}
            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium bg-emerald-900/20 px-4 py-2 rounded-lg"
          >
            <span>Switch to Interactive Exercises</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
