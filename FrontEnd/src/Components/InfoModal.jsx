import {X, MapPin, Scale, Ruler, Calendar, Utensils } from 'lucide-react';

export function InfoModal({isOpen, onClose, data}){
    if (!isOpen || !data) return null;

    const isEspecie = !!data.nomeCientifico;

    console.log("Dados recebidos no Modal:", data);

    const handleOut = (e) =>  {
        if (e.target === e.currentTarget) onClose();
    };

        return(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm transition-all"onClick={handleOut}>
                <div className="bg-node border-2 border-accent w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-5 border-b border-accent/20 bg-header">
                        <div>
                            <h2 className="text-2xl font-bold text-text-main">
                                {data.nomePopular || data.nome || data.label}
                            </h2>
                            {isEspecie && (<h3>
                                {data.nomeCientifico}
                            </h3>)}
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-accent/20 text-text-main transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 text-text-main">
                        {isEspecie && (
                            <div className="flex flex-col md:flex-row gap-6">
                                {(data.url_imagem || data.imagem) && (
                                    <div className="w-full md:w-1/2 h-48 md:h-auto rounded-xl overflow-hidden border border-accent/30 shrink-0">
                                        <img 
                                            src={data.url_imagem || data.imagem} alt={data.nomePopular || data.nomeCientifico} className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 bg-canvas p-3 rounded-lg border border-accent/10">
                                        <Utensils className="w-4 h-4 text-accent shrink-0" />
                                        <span className="text-sm font-semibold">{data.dieta || 'Desconhecida'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-canvas p-3 rounded-lg border border-accent/10">
                                        <Ruler className="w-4 h-4 text-accent shrink-0" />
                                        <span className="text-sm font-semibold">{data.altura ? `${data.altura}m` : '---'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-canvas p-3 rounded-lg border border-accent/10">
                                        <Scale className="w-4 h-4 text-accent shrink-0" />
                                        <span className="text-sm font-semibold">{data.peso ? `${data.peso}kg` : '---'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-canvas p-3 rounded-lg border border-accent/10">
                                        <Calendar className="w-4 h-4 text-accent shrink-0" />
                                        <span className="text-sm font-semibold">{data.descoberta || '---'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div>
                            <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Descrição</h4>
                            <p className="leading-relaxed opacity-90 text-justify">
                            {data.descricao || "Nenhuma descrição detalhada encontrada para este registro."}
                            </p>
                        </div>
                        {isEspecie && data.localidade_exata && (
                            <div>
                                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-2 mt-2">Local da Descoberta</h4>
                                <div className="flex items-start gap-2 bg-canvas p-4 rounded-xl border border-accent/10">
                                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <span className="text-sm opacity-90">{data.localidade_exata}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
}