import { Input } from "./Input";
import { Botao } from "./Botao";
import { Link, useNavigate } from "react-router-dom";



export function CardLogin() {

  const navigate = useNavigate();
    return (
        <div className="bg-background px-16 py-10 w-full h-full flex flex-col items-center justify-center gap-8">
          <span className="text-4xl font-bold text-text">Bem-vindo!</span>
          <div className="flex flex-col gap-4 bg-lightprimary p-8 rounded-lg shadow-md w-80 h-90">
            <nav className="text-2xl font-bold text-text text-center">Login</nav>
            <Input type="text" placeholder="Usuário" className="w-full" />
            <Input type="password" placeholder="Senha" className="w-full" />
            <Botao className="bg-primary text-text font-bold py-2 px-4 rounded hover:bg-blue-700">Entrar</Botao>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-secondary"></div>
              <span className="flex-shrink mx-4 text-secondary">ou</span>
              <div className="flex-grow border-t border-secondary"></div>
            </div>
            <Botao className="bg-secondary text-text font-bold py-2 px-4 rounded hover:bg-secondary/80"  onClick={() => navigate('/home')}>Entrar como Visitante</Botao>
          <div className="flex gap-3 mt-4 relative whitespace-nowrap  items-center justify-center ">
            <Link to="/esqueci_minhasenha" className="text-text hover:underline mr-4">
              Esqueci minha senha
            </Link>
            <Link to="/cadastro" className="text-text hover:underline">
              Criar nova conta
            </Link>
          </div>
          </div>
        </div>
    );
}