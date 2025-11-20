export const BlogEyebrow = () => {
  return (
    <div className="relative">
      {/* Glass effect container */}
      <div className="bg-slate-950/40 backdrop-blur-md backdrop-saturate-150 flex items-center  justify-center rounded-full dark:border-slate-200/50 border-primary/50 border p-1 shadow-sm w-fit max-w-[500px] mx-auto relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-emerald-500/50 dark:bg-emerald-500/10 blur-xl rounded-full"></div>

        {/* Reflective highlight */}
        <div className="absolute inset-x-0 top-0 h-[30%] w-full bg-gradient-to-b from-white/10 to-transparent rounded-t-full"></div>
        <div className="flex -space-x-1.5 relative z-10"></div>
        <p className="text-white px-2 text-xs relative z-10 font-medium flex items-center">
          Expert insights from cloud professionals
          <strong className="text-emerald-400 font-semibold px-2">
            .
          </strong>{" "}
          <p className="dark:text-primary text-gray-950"> Updated weekly</p>
        </p>
      </div>
    </div>
  );
};
