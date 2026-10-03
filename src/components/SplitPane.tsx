import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

type SplitPaneProps = {
  axis: "x" | "y";
  initialPercent: number;
  minPercent: number;
  maxPercent: number;
  collapsed?: "first" | "second" | null;
  collapsedSize?: number;
  first: ReactNode;
  second: ReactNode;
};

const DESKTOP_QUERY = "(min-width: 768px)";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SplitPane({
  axis,
  initialPercent,
  minPercent,
  maxPercent,
  collapsed = null,
  collapsedSize = 48,
  first,
  second,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef(initialPercent);
  const draggingRef = useRef(false);
  const layoutRef = useRef<() => void>(() => {});

  layoutRef.current = () => {
    const firstPane = firstRef.current;
    const secondPane = secondRef.current;
    if (!firstPane || !secondPane) return;

    const desktop = window.matchMedia(DESKTOP_QUERY).matches;

    if (collapsed === "first") {
      firstPane.style.flex = `0 0 ${collapsedSize}px`;
      secondPane.style.flex = "1 1 auto";
      return;
    }

    if (collapsed === "second") {
      firstPane.style.flex = "1 1 auto";
      secondPane.style.flex = `0 0 ${collapsedSize}px`;
      return;
    }

    secondPane.style.flex = "";
    if (!desktop) {
      firstPane.style.flex = "";
      return;
    }

    firstPane.style.flex = `0 0 ${percentRef.current}%`;
  };

  useEffect(() => {
    layoutRef.current();
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => layoutRef.current();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [axis, collapsed, collapsedSize, minPercent, maxPercent]);

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (collapsed) return;
    event.preventDefault();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.style.cursor = axis === "x" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const span = axis === "x" ? rect.width : rect.height;
    if (span <= 0) return;
    const offset = axis === "x" ? event.clientX - rect.left : event.clientY - rect.top;
    percentRef.current = clamp((offset / span) * 100, minPercent, maxPercent);
    layoutRef.current();
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full min-h-0 min-w-0 ${axis === "x" ? "flex-col md:flex-row" : "flex-col"}`}
    >
      <div ref={firstRef} className="flex min-h-0 min-w-0 flex-col overflow-hidden max-md:flex-1">
        {first}
      </div>

      <div
        role="separator"
        aria-orientation={axis === "x" ? "vertical" : "horizontal"}
        aria-valuemin={minPercent}
        aria-valuemax={maxPercent}
        aria-valuenow={Math.round(percentRef.current)}
        className={`group relative z-10 hidden shrink-0 touch-none items-center justify-center bg-gray-800 hover:bg-blue-500 md:flex ${
          collapsed ? "md:hidden" : ""
        } ${axis === "x" ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span
          className={`absolute ${axis === "x" ? "inset-y-0 -left-1.5 w-4" : "inset-x-0 -top-1.5 h-4"}`}
        />
        <span
          className={`rounded-full bg-gray-600 group-hover:bg-blue-300 ${
            axis === "x" ? "h-8 w-1" : "h-1 w-8"
          }`}
        />
      </div>

      <div ref={secondRef} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {second}
      </div>
    </div>
  );
}
