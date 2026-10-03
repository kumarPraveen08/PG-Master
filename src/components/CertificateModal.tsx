import { Award, Database, Download, X } from "lucide-react";

type Html2PdfWorker = {
  set: (options: object) => Html2PdfWorker;
  from: (element: HTMLElement) => Html2PdfWorker;
  save: () => void;
};

type CertificateModalProps = {
  onClose: () => void;
};

export function CertificateModal({ onClose }: CertificateModalProps) {
  const download = () => {
    const element = document.getElementById("certificate-content");
    const html2pdf = (window as Window & { html2pdf?: () => Html2PdfWorker }).html2pdf;

    if (html2pdf && element) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: "PostgreSQL_Mastery_Certificate.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
        })
        .from(element)
        .save();
      return;
    }

    console.error("PDF generator is still loading. Please try again in a moment.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#161b22] border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 flex flex-col items-center">
          <div
            id="certificate-content"
            className="bg-white text-gray-900 p-12 rounded-sm relative w-full aspect-[1.414/1] max-w-3xl flex flex-col items-center justify-center text-center shadow-lg border-[12px] border-emerald-900/10"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #ffffff 0%, #f0fdf4 100%)",
            }}
          >
            <div className="absolute inset-2 border-2 border-emerald-800/20 rounded-sm pointer-events-none" />
            <div className="absolute inset-4 border border-emerald-800/10 rounded-sm pointer-events-none" />
            <Database size={64} className="text-emerald-600 mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 tracking-wide uppercase">
              Certificate of Completion
            </h1>
            <p className="text-emerald-700 font-semibold tracking-widest uppercase text-sm mb-12">
              PostgreSQL Interactive Learner
            </p>
            <p className="text-lg text-gray-600 mb-2 italic">This is to certify that</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-2 min-w-[300px] inline-block">
              PostgreSQL Developer
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto italic">
              has successfully completed all modules and interactive exercises,
              demonstrating proficiency in Data Definition, Data Manipulation, and
              Database Querying fundamentals.
            </p>
            <div className="flex justify-between w-full max-w-lg mt-8 px-8">
              <div className="flex flex-col items-center">
                <div className="w-40 border-b border-gray-800 mb-2" />
                <span className="text-sm font-semibold text-gray-600 uppercase">Date</span>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-40 border-b border-gray-800 mb-2 text-2xl text-emerald-800 italic"
                  style={{ fontFamily: "cursive" }}
                >
                  PG Master
                </div>
                <span className="text-sm font-semibold text-gray-600 uppercase">
                  Instructor
                </span>
              </div>
            </div>
            <div className="absolute bottom-12 right-12 opacity-10">
              <Award size={120} />
            </div>
          </div>

          <div className="mt-8 flex justify-center w-full">
            <button
              onClick={download}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              <Download size={20} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
