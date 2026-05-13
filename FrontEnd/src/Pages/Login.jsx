import Dino from '../assets/Dino.png';
import { TiposDino } from '../Components/TiposDino';
import { CardLogin } from '../Components/CardLogin';
import {Logo} from '../Components/Logo';

function Login() {


  return (
    

    <div className="h-screen flex items-center justify-center bg-background">
      <div className="relative w-full max-w-6x1 grid grid-cols-2 gap-8 px-12">    
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-[80%] w-px bg-gradient-to-b from-transparent via-secondary/50 to-transparent"></div>
          <div className="relative bg-background pb-20 flex flex-col items-center justify-center">
              <Logo className="w-40 h-40 mb-20"/>
            
              <img src={Dino} alt="Dinossauro" className="absolute left-10 bottom-0 w-[500px] opacity-20 pointer-events-none select-none" />
            <div className=" z-10 flex flex-col gap-4 items-center justify-center pb-50 ">
              <h1 className="items-center justify-center text-6xl font-bold text-text ">Arvore Dinossáurica</h1>
              <h2 className="text-2xl text-lightprimary items-center justify-center">Árvore genealógica de dinossauros</h2>
            </div>
            <div className="mt-6 pb-20">
              <h3 className="text-4xl  text-text text-left">Explore milhões de registros de dinossauros</h3>
            </div>
            <TiposDino />
          </div>

        <CardLogin />
      </div>
    </div>
  );

}

export default Login