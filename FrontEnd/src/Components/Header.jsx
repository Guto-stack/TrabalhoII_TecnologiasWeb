export function Header() {
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
        </div>
    );
}