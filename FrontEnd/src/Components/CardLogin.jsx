export function CardLogin() {
    return (
        <div className="bg-background px-16 py-10 w-full h-full flex flex-col items-center justify-center gap-8">
          <span className="text-4xl font-bold text-text">Bem-vindo!</span>
          <div className="flex flex-col gap-4 bg-lightprimary p-8 rounded-lg shadow-md w-80 h-90">
            <nav className="text-2xl font-bold text-text text-center">Login</nav>
            <input className="text-text placeholder:text-secondary font-bold border border-primary focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Usuário" />
            <input className="text-text placeholder:text-secondary font-bold border border-primary focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Senha" />
            <button className="bg-primary text-text font-bold py-2 px-4 rounded hover:bg-blue-700">Entrar</button>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-secondary"></div>
              <span className="flex-shrink mx-4 text-secondary">ou</span>
              <div className="flex-grow border-t border-secondary"></div>
            </div>
            <button className="bg-primary text-text font-bold py-2 px-4 rounded hover:bg-blue-700">
              Explorar como Visitante
            </button>
          <div className="flex gap-3 mt-4 relative whitespace-nowrap  items-center justify-center ">
            <a href="/esqueci_minhasenha" className="text-text hover:underline mr-4">
              Esqueci minha senha
            </a>
            <a href="/cadastro" className="text-text hover:underline">
              Criar nova conta
            </a>
          </div>
          </div>
        </div>
    );
}