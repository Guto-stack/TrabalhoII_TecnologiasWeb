function DinoSilhouette() {
  return (
    <svg className="absolute opacity-10 w-[1000px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" viewBox="0 0 680 500">
      <path d="
        M 200 420 L 200 340 L 185 300 L 175 260 L 180 220 L 195 190
        L 220 170 L 255 158 L 285 152 L 310 148 L 330 142 L 355 130
        L 375 112 L 390 90 L 400 68 L 408 52 L 415 48 L 420 52
        L 418 70 L 412 88 L 405 108 L 415 102 L 428 95 L 438 93
        L 442 97 L 438 105 L 425 112 L 412 120 L 418 130 L 435 125
        L 448 122 L 455 126 L 450 135 L 435 142 L 420 148 L 415 162
        L 420 178 L 438 195 L 455 215 L 465 240 L 462 268 L 448 290
        L 440 310 L 445 330 L 455 355 L 458 385 L 455 420 L 435 420
        L 432 385 L 428 358 L 418 335 L 408 318 L 395 318 L 382 335
        L 372 358 L 368 385 L 365 420 L 340 420 L 342 385 L 348 355
        L 355 330 L 352 305 L 338 288 L 318 278 L 295 272 L 270 270
        L 248 272 L 228 280 L 212 295 L 204 318 L 202 360 L 200 420 Z
      " fill="#e8d5a0"/>
      <ellipse cx="408" cy="72" rx="6" ry="5" fill="#1a2e1a"/>
      <path d="
        M 160 420 L 162 380 L 155 345 L 148 320 L 138 310
        L 128 312 L 122 330 L 118 370 L 115 420 Z
      " fill="#e8d5a0"/>
    </svg>
  )
}

function DinoTreeLogo({ className = "w-35 h-35" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="72" fill="#E96B12" stroke="#3F6B3B" strokeWidth="6" />

      <path
        d="M100 72
           C81 72 68 85 68 102
           C68 122 90 134 100 148
           C110 134 132 122 132 102
           C132 85 119 72 100 72Z"
        fill="#102415"
      />

      <path
        d="M100 82
           L106 96
           L121 96
           L109 105
           L114 120
           L100 111
           L86 120
           L91 105
           L79 96
           L94 96Z"
        fill="#F4E5B0"
      />
    </svg>
  );
}

function Login() {


  return (
    

    <div className="h-screen flex items-center justify-center bg-background">
      <div className="relative w-full max-w-6x1 grid grid-cols-2 gap-8 px-12">    
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-[80%] w-px bg-gradient-to-b from-transparent via-secondary/50 to-transparent"></div>
          <div className="relative bg-background pb-20 flex flex-col items-center justify-center">
              <DinoTreeLogo className="w-40 h-40 mb-20"/>
            
              <DinoSilhouette  />
            <div className=" z-10 flex flex-col gap-4 items-center justify-center pb-50 ">
              <h1 className="items-center justify-center text-6xl font-bold text-text ">Arvore Dinossáurica</h1>
              <h2 className="text-2xl text-lightprimary items-center justify-center">Árvore genealógica de dinossauros</h2>
            </div>
            <div className="mt-6 pb-20">
              <h3 className="text-4xl  text-text text-left">Explore milhões de registros de dinossauros</h3>
            </div>
            <div className="flex gap-3 mt-4 relative z-20">
              <span className="inline-block cursor-pointer border border-secondary text-secondary px-4 py-2 text-sm tracking-wide rounded-full transform transition-transform duration-300 hover:scale-125">
                Triássico
              </span>

              <span className="inline-block cursor-pointer border border-text text-text px-4 py-2 text-sm tracking-wide rounded-full transform transition-transform duration-300 hover:scale-125">
                Jurássico
              </span>

              <span className="inline-block cursor-pointer border border-lightprimary text-lightprimary px-4 py-2 text-sm tracking-wide rounded-full transform transition-transform duration-300 hover:scale-125">
                Cretáceo
              </span>
            </div>
          </div>

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
      </div>
    </div>
  );

}

export default Login