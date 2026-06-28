import { cn } from "../lib/utils"; // Garanta que o import do cn esteja correto aqui

export function Header({ currentTab, setCurrentTab }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-header border-b-2 border-accent shadow-md">
            <div className="flex items-center gap-4 pl-15">
                <img src="/favicon.svg" alt="PaleoTree Icon" className="w-15 h-15" />
                
                <div className="grid">
                    <span className="text-2xl font-bold text-text-main tracking-wide">
                        PaleoTree
                    </span>

                    <span className="text-base font-bold text-text-main/50 tracking-wide">
                        Árvore Filogenética Interativa
                    </span>
                </div>
            </div>

            {/* Espaçador joga os botões para a direita */}
            <div className="flex-1" />

            {/* BOTÕES DE NAVEGAÇÃO INTERNOS DO HEADER */}
            <div className="flex gap-3 pr-6">
                <button
                    onClick={() => setCurrentTab("arvore")}
                    className={cn(
                        "px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer border border-transparent",
                        currentTab === "arvore" 
                            ? "bg-accent text-white shadow-sm scale-102" 
                            : "text-text-main/70 hover:bg-node/50 hover:text-text-main"
                    )}
                >
                    🌳 Árvore Evolutiva
                </button>
                <button
                    onClick={() => setCurrentTab("estatisticas")}
                    className={cn(
                        "px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer border border-transparent",
                        currentTab === "estatisticas" 
                            ? "bg-accent text-white shadow-sm scale-102" 
                            : "text-text-main/70 hover:bg-node/50 hover:text-text-main"
                    )}
                >
                    📊 Estatísticas
                </button>
            </div>
        </div>
    );
}