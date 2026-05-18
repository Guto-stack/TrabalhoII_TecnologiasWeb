import { Botao } from "./Botao";
import { Logo } from "./Logo";
import { MenuPerfil } from "./MenuPerfil";

export function Header() {
    return (
        <div 
        className="flex items-center gap-4 p-4 animate-gradient" 
        style={{
            background: 'linear-gradient(-45deg, #0a0f0a, #141f14, #1a2e1a, #2d4a2d, #4a6e3c, #7aaa68, #D4621A, #2d4a2d, #0a0f0a)',
            backgroundSize: '400% 400%',
        }}>
            <Logo className="w-20 h-20" />
            <span className="text-2xl font-bold text-text">Árvore Dinossáurica</span>
            <div className="flex-1" />
            <Botao className="bg-yellow-500 opacity-90 text- font-bold py-2 px-4 rounded-full border-text hover:bg-blue-700">Parque Jurássico</Botao>
            <MenuPerfil/>
        </div>
    );
}
