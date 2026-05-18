import { useState } from "react";
import dinoavatar from '../assets/dinoavatar.png';

export function MenuPerfil() {
    const [menuAberto, setMenuAberto] = useState(false);

return(
    <button onClick={() => setMenuAberto(!menuAberto)}>
        <img src={dinoavatar} alt="dino" className="w-10 h-10 rounded-sm bg-gray-500" />
        {menuAberto && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <p>Gerenciar usuários</p>
                <p>Adcionar usuário</p>
            </div>
        )}
    </button>
);
}