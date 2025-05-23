export default function TrustBadge() {
    return (
      <div className="bg-slate-950 flex items-center rounded-full border-slate-800 border p-1 shadow-sm w-fit max-w-[300px] mx-auto">
        <div className="flex -space-x-1.5">
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
        <p className="text-muted-foreground px-2 text-xs">
          Trusted by <strong className="text-emerald-700 font-medium">12K+</strong>{" "}
          developers.
        </p>
      </div>
    )
  }
  