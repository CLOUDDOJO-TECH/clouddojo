export default function TrustBadge() {
  return (
    <div className="relative">
      {/* Glass effect container */}
      <div className="bg-slate-950/40 backdrop-blur-md backdrop-saturate-150 flex items-center  justify-center rounded-full border-slate-200/50 border p-1 shadow-sm w-fit max-w-[500px] mx-auto relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full"></div>
        
        {/* Reflective highlight */}
        <div className="absolute inset-x-0 top-0 h-[30%] w-full bg-gradient-to-b from-white/10 to-transparent rounded-t-full"></div>
        
        <div className="flex -space-x-1.5 relative z-10">
          <img
            className="ring-background rounded-full ring-1 h-6 w-6 object-cover"
            src="/images/avatars/avatar1.png"
            width={20}
            height={20}
            alt="Avatar 01"
          />
          <img
            className="ring-background rounded-full ring-1 h-6 w-6 object-cover"
            src="/images/avatars/avatar2.png"
            width={20}
            height={20}
            alt="Avatar 02"
          />
          <img
            className="ring-background rounded-full ring-1 h-6 w-6 object-cover"
            src="/images/avatars/avatar3.png"
            width={20}
            height={20}
            alt="Avatar 03"
          />
          <img
            className="ring-background rounded-full ring-1 h-6 w-6 object-cover"
            src="/images/avatars/avatar4.jpg"
            width={20}
            height={20}
            alt="Avatar 04"
          />
        </div>
        <p className="text-white px-2 text-xs relative z-10 font-medium">
          Trusted by <strong className="text-emerald-400 font-semibold">12K+</strong>{" "}
          developers.
        </p>
      </div>
    </div>
  )
}
