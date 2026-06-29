import { cn } from "../lib/utils";
import { NavLink } from "react-router-dom";

export function Header(){
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

            <div className="flex-1" />

            <div className="flex gap-3 pr-6">
                <NavLink
                    to="/"
                    className={({ isActive }) => cn(
                        "px-4 py-2 rounded-xl font-bold text-base transition-all cursor-pointer border border-accent",
                        isActive 
                            ? "bg-accent text-text-main shadow-sm scale-102" 
                            : "text-text-main/70 hover:bg-node/50 hover:text-text-main"
                    )}
                >
                    Árvore Evolutiva
                </NavLink>
                
                <NavLink
                    to="/mapa"
                    className={({ isActive }) => cn(
                        "px-4 py-2 rounded-xl font-bold text-base transition-all cursor-pointer border border-accent",
                        isActive 
                            ? "bg-accent text-text-main shadow-sm scale-102" 
                            : "text-text-main/70 hover:bg-node/50 hover:text-text-main"
                    )}
                >
                    Mapa de Fósseis
                </NavLink>

                <NavLink
                    to="/estatisticas"
                    className={({ isActive }) => cn(
                        "px-4 py-2 rounded-xl font-bold text-base transition-all cursor-pointer border border-accent",
                        isActive 
                            ? "bg-accent text-text-main shadow-sm scale-102" 
                            : "text-text-main/70 hover:bg-node/50 hover:text-text-main"
                    )}
                >
                    Estatísticas
                </NavLink>

            </div>
        </div>
    );
}