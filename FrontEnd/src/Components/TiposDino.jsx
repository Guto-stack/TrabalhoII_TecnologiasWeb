export function TiposDino(){
    return(
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
    );
}