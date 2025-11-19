import Image from "next/image";

export default function Home() {
  return (
   <main className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-400 flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 bg-green-600 backdrop-blur-sm shadow-md">
        <div className="text-xl font-bold">🌳 treey.ai</div>
        <div className="text-lg font-medium">Coming soon...</div>
      </header>

      <section className="flex flex-1 items-center justify-center">
        <h1 className="text-5xl font">Hello there!</h1>
      </section>


   </main>
  );
}