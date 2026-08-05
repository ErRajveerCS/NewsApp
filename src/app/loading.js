export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="h-[3px] w-full overflow-hidden"
        style={{ background: "var(--hairline)" }}
      >
        <div
          className="h-full w-1/3 animate-[loadingbar_1s_ease-in-out_infinite]"
          style={{ background: "var(--signal)" }}
        />
      </div>
      <style>{`
        @keyframes loadingbar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
