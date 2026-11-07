"use client";

import { useState } from "react";

/**
 * The PDF library is a megabyte, and most people walking the demo never tap this.
 * Both the renderer and the document are imported on the click, so the screen
 * costs nothing until someone actually wants the file.
 */
export function DownloadReport() {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");

  async function download() {
    setState("working");
    try {
      const [{ pdf }, { ReportDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/demo/ReportPdf"),
      ]);

      const blob = await pdf(<ReportDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tora-house-baseline-report-sample.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={download}
        disabled={state === "working"}
        className="btn btn-primary w-full"
      >
        {state === "working" ? "Preparing…" : "Download PDF"}
      </button>
      {state === "error" ? (
        <p className="t-meta text-brass-text">
          The file could not be built. Everything on this screen is still here.
        </p>
      ) : (
        <p className="t-meta text-center text-fg-muted">
          Also sent as a PDF and over WhatsApp. Nothing here is app-only.
        </p>
      )}
    </div>
  );
}
