import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { cn } from "./lib/utils";
import { Header } from "./Components/Header";
import { Arvore } from "./Pages/Arvore";
import { Estatisticas } from "./Pages/Estatisticas";
import { Mapa } from "./Pages/Mapa";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const temaSalvo = localStorage.getItem("paleotree_tema");
    if(temaSalvo){
      return temaSalvo === "dark";
    }
    if(typeof window !== 'undefined' && window.matchMedia){
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const alternarTema = () => {
    setIsDarkMode((prev) => {
      const novoTema = !prev;
      localStorage.setItem("paleotree_tema", novoTema ? "dark" : "light");
      return novoTema;
    });
  };

  return (
    <Router>
      <div className={cn("flex flex-col w-screen h-screen overflow-hidden bg-canvas transition-colors duration-300", isDarkMode ? "dark-theme" : "")}>
        <Header />
        
        <div className="flex-1 w-full max-h-[calc(100vh-88px)] relative">
          <Routes>
            <Route path="/" element={<Arvore isDarkMode={isDarkMode} alternarTema={alternarTema} />} />
            <Route path="/estatisticas" element={<Estatisticas isDarkMode={isDarkMode} />} />
            <Route path="/mapa" element={<Mapa isDarkMode={isDarkMode}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;