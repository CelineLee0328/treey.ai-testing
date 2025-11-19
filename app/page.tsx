export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-400 flex flex-col">
    
      <header className="flex justify-between items-center px-8 py-4 bg-green-600 shadow-md">
        <div className="text-xl font-bold">🌳 treey.ai</div>
      </header>

      <section className="flex flex-1 items-center justify-center">
        <h1 className="text-5xl font-bold">Hello there! <br></br>Its about to start...</h1>
      </section>

      <footer className="bg-green-600 text-white shadow-md px-8 py-4 flex flex-col items-center gap-1">
        <p className="font-semibold">Our Team</p>
        <p>João – joao@example.com | Celine – celine@example.com | Sylvia – sylvia@example.com</p>
      </footer>

    </main>
  );
}
