import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="max-w-2xl w-full p-8 rounded-2xl border border-border bg-card shadow-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
            Gabriel9203
          </h1>
          <p className="text-muted-foreground text-lg">
            Personal website initialization complete.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-4xl font-mono bg-muted px-6 py-3 rounded-xl border border-border">
            <span>Count is</span>
            <span className="text-primary font-bold">{count}</span>
          </div>
          
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <span className="relative z-10">Increment Count</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        <div className="pt-8 border-t border-border grid grid-cols-2 gap-4 text-sm text-center">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="font-semibold mb-1">Stack</h3>
            <p className="text-muted-foreground">React + Vite + TS</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="font-semibold mb-1">UI</h3>
            <p className="text-muted-foreground">Tailwind + Aceternity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
