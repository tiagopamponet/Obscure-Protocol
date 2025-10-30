export function SecuritySection() {
  return (
    <section className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl font-serif text-slate-800 dark:text-white mb-6">Privacy is Peace.</h2>
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-sakura-pattern opacity-[0.05] rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-wave-pattern opacity-[0.05] rounded-full"></div>

        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 relative z-10">
          In a world of constant surveillance, true privacy becomes a sanctuary. GhostTX was born from the belief that
          financial privacy is a fundamental right, not a privilege.
        </p>

        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 relative z-10">
          We chose Solana for its speed, low fees, and robust smart contract capabilities, allowing us to create a
          system where transactions flow like whispers through the blockchain — present, but untraceable.
        </p>

        <p className="text-lg italic text-slate-500 dark:text-slate-400 relative z-10">
          "Like sakura petals carried by the wind, your transactions leave no trail."
        </p>
      </div>
    </section>
  )
}
