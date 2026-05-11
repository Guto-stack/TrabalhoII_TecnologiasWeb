function Login() {
  return (
    <div className="m-0 h-screen grid grid-cols-2">
        <div className="bg-primary p-8 flex flex-col items-center justify-center">
            <h1 className="items-center justify-center text-6xl font-bold text-text text-left">Arvore Dinossáurica</h1>
            <h2 className="text-2xl text-lightprimary text-left">Árvore genealógica de dinossauros</h2>
        </div>
        
          <div className="bg-primary p-100">
            <div className="flex flex-col items-center justify-center h-80 w-80 bg-loginbg p-8 rounded-lg ">
              <span className="text-3xl font-bold text-text mb-2">Login</span>
              <input type="text" placeholder="Usuário" className="bg-lightprimary text-text placeholder:text-lighttext p-2 m-2" />
              <input type="password" placeholder="Senha" className="bg-lightprimary text-text placeholder:text-lighttext p-2 m-2" />
              <button className="bg-secondary text-text font-bold py-2 px-4 rounded ml-2">Enviar</button>
            </div>
          </div>
        

    </div>
  );

}

export default Login