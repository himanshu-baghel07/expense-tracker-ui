import AuthPanel from "./AuthPanel.client";

export default function LandingShell() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100dvh-74px)] lg:min-h-[calc(100vh-74px)] bg-black">
      {/* LEFT SIDE – Static content */}
      <section
        className="p-12 lg:p-16 hidden lg:flex flex-col justify-center text-white relative overflow-hidden bg-contain bg-center bg-no-repeat bg-[#121038]"
        style={{ backgroundImage: "url('/images/bg_left.webp')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </section>

      {/* RIGHT SIDE – Dynamic auth */}
      <section className="flex items-center justify-center p-8 bg-linear-to-bl from-[#09122C] to-[#872341] lg:bg-linear-to-br lg:from-gray-950 lg:to-black ">
        <AuthPanel />
      </section>
    </main>
  );
}
