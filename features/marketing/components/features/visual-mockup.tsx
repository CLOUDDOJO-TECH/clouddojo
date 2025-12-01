import React from "react";
import { Monitor, Type } from "lucide-react";

interface VisualMockupProps {
  type: "documentation" | "mapping" | "friction" | "source";
}

export const VisualMockup: React.FC<VisualMockupProps> = ({ type }) => {
  // Dark mode Notion-esque representation
  // Removed max-width restriction to fill container, added h-full to stretch

  return (
    <div className="relative w-full h-full min-h-[350px] lg:min-h-[450px] bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col items-center justify-center border border-slate-800/50 shadow-2xl">
      {/* Background Grid Pattern inside container */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Radial Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

      {/* The "Browser/App" Window - Extended Height */}
      <div className="absolute inset-4 sm:inset-6 bg-[#18181b] rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 flex flex-col group transform transition-transform duration-700 hover:scale-[1.01]">
        {/* Window Header */}
        <div className="bg-[#27272a] border-b border-slate-700/50 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
          </div>
          <div className="flex-1 px-4 mx-4 hidden sm:block">
            <div className="bg-[#18181b] border border-slate-700/50 rounded-md py-1 px-3 text-xs text-slate-400 flex items-center justify-center gap-1 shadow-sm max-w-[200px] mx-auto">
              <span className="opacity-50">🔒</span>{" "}
              <span className="text-slate-300 truncate">
                notion.so/wander-onboarding
              </span>
            </div>
          </div>
          <div className="w-8 hidden sm:block"></div>
        </div>

        {/* Content Area - Scrollable or Flex Column */}
        <div className="p-6 sm:p-8 bg-[#18181b] flex-1 relative overflow-hidden flex flex-col">
          {/* Header Info */}
          <div className="flex items-start gap-4 mb-6 shrink-0">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-emerald-500/20">
              N
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-tight">
                Wander Onboarding
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                  @Jan 9
                </span>
                <span>•</span>
                <span className="text-emerald-400">@Javier</span>
              </div>
            </div>
          </div>

          {/* Subtext */}
          <div className="mb-6 shrink-0">
            <h4 className="font-semibold text-slate-200 text-sm mb-1 flex items-center gap-2">
              Active Journeys{" "}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </h4>
            <p className="text-xs text-slate-500">Core onboarding flow v2.4</p>
          </div>

          {/* Visual Canvas Area - Fills remaining space */}
          <div className="relative border border-slate-800 bg-[#0f0f11] rounded-lg p-4 flex-1 shadow-inner overflow-hidden min-h-[200px]">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <div className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-medium text-slate-300 flex items-center gap-1 shadow-sm hover:bg-slate-700 transition-colors cursor-pointer hidden sm:flex">
                <Type size={10} className="text-emerald-400" /> English
              </div>
              <div className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-medium text-slate-300 flex items-center gap-1 shadow-sm hover:bg-slate-700 transition-colors cursor-pointer">
                <Monitor size={10} className="text-cyan-400" /> Desktop
              </div>
            </div>

            {/* Flow Nodes - Centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-2 sm:gap-4 items-center scale-90 sm:scale-100 opacity-90">
                {/* Node 1 */}
                <div className="shrink-0 w-24 sm:w-32 bg-slate-900 rounded-lg border border-slate-700/50 shadow-lg p-2 group/node hover:border-slate-600 transition-colors">
                  <div className="w-full h-12 sm:h-16 bg-emerald-900/20 rounded mb-2 overflow-hidden relative border border-emerald-500/20">
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
                    <div className="absolute bottom-1 right-1 bg-emerald-900/80 border border-emerald-500/30 text-[8px] font-bold px-1.5 py-0.5 rounded text-emerald-300">
                      PRIYA
                    </div>
                  </div>
                  <div className="h-1.5 w-16 bg-slate-700 rounded mb-1"></div>
                  <div className="h-1.5 w-10 bg-slate-800 rounded"></div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 flex items-center justify-center w-4 sm:w-8 relative text-slate-600">
                  <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-current opacity-40"></div>
                  <div className="absolute top-1/2 right-0 w-1.5 h-1.5 border-t border-r border-current rotate-45 transform -translate-y-1/2 opacity-60"></div>
                </div>

                {/* Node 2 - Active */}
                <div
                  className="shrink-0 w-24 sm:w-32 bg-slate-900 rounded-lg border border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10 p-2 relative animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  {/* Cursor */}
                  <div className="absolute -top-3 -right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow-lg border border-slate-900 flex items-center gap-1">
                    JAVIER
                  </div>
                  <div className="absolute top-[-4px] right-[-4px] w-3 h-3 bg-emerald-600 transform rotate-45 border-2 border-slate-900"></div>

                  <div className="w-full h-12 sm:h-16 bg-slate-800 rounded mb-2 overflow-hidden border border-slate-700">
                    <div className="h-full w-full flex flex-col items-center justify-center">
                      <div className="text-[8px] text-center px-1">
                        <div className="font-bold text-slate-200 mb-1">
                          Sign up
                        </div>
                        <div className="text-slate-500 hidden sm:block">
                          Enter details
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 w-20 bg-slate-700 rounded mb-1"></div>
                  <div className="h-1.5 w-12 bg-slate-800 rounded"></div>

                  {/* Mini indicators */}
                  <div className="flex gap-1 mt-2">
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded p-1">
                      <div className="h-1 w-4 bg-slate-600 rounded mb-1"></div>
                    </div>
                    <div className="flex-1 bg-emerald-900/30 border border-emerald-500/20 rounded p-1">
                      <div className="h-1 w-4 bg-emerald-500/50 rounded mb-1"></div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 flex items-center justify-center w-4 sm:w-8 relative text-slate-600 hidden sm:flex">
                  <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-current opacity-40"></div>
                  <div className="absolute top-1/2 right-0 w-1.5 h-1.5 border-t border-r border-current rotate-45 transform -translate-y-1/2 opacity-60"></div>
                </div>

                {/* Node 3 */}
                <div className="shrink-0 w-24 sm:w-32 bg-slate-900 rounded-lg border border-slate-800 shadow-sm p-2 opacity-50 blur-[0.5px] hidden sm:block">
                  <div className="w-full h-12 sm:h-16 bg-slate-800 rounded mb-2 border border-slate-700/50"></div>
                  <div className="h-1.5 w-14 bg-slate-700 rounded mb-1"></div>
                  <div className="h-1.5 w-24 bg-slate-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
