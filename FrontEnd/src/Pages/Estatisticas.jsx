import { useEffect, useState } from "react";
import { Loader2, ShieldAlert, Award, Layers } from "lucide-react";
import { cn } from "../lib/utils";

export function Estatisticas({ isDarkMode }){
  const [periodosDados, setPeriodosDados] = useState([]);
  const [activePeriodId, setActivePeriodId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3333/estatisticas")
      .then((res) => res.json())
      .then((json) => {
        setPeriodosDados(json);
        if (json.length > 0) {
          setActivePeriodId(json[0].id_periodo);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados estatísticos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-text-main/70">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-2" />
        <span className="text-xs font-bold uppercase tracking-widest">Filtrando Registros do Banco...</span>
      </div>
    );
  }

  if (periodosDados.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center text-text-main/60">
        <div className="flex flex-col items-center gap-2">
          <ShieldAlert className="w-10 h-10 text-accent/60" />
          <p>Não foi possível encontrar dados estatísticos mapeados.</p>
        </div>
      </div>
    );
  }

  const periodoSelecionado = periodosDados.find(p => p.id_periodo === activePeriodId) || periodosDados[0];

  return (
    <div className="w-full h-full overflow-y-auto p-8 bg-canvas text-text-main">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
        
        {/* Cabeçalho da Página */}
        <div>
          <p className={cn("text-sm mt-1 font-bold", isDarkMode ? "text-text-main/60" : "text-wine/60")}>
            Relatórios analíticos cruzando os dados de períodos geológicos, clados e fósseis.
          </p>
        </div>

        {/* Layout Principal das Estatísticas */}
        <div className="w-full flex flex-col md:flex-row gap-6 items-start">
          
          {/* Seletor de períodos */}
          <div className="flex flex-col gap-3 w-full md:w-64 shrink-0">
            <h2 className={cn("font-bold text-xs tracking-wider uppercase mb-1 opacity-80 pl-1", isDarkMode ? "text-text-main" : "text-wine")}>
              Períodos Geológicos
            </h2>
            {periodosDados.map((p) => (
              <button
                key={p.id_periodo}
                onClick={() => setActivePeriodId(p.id_periodo)}
                className={cn(
                  "px-5 py-3 rounded-xl font-bold text-sm text-left transition-all duration-300 shadow-md border cursor-pointer",
                  activePeriodId === p.id_periodo
                    ? "bg-header text-text-main border-accent scale-102 ring-2 ring-accent/30"
                    : "bg-node text-text-main/80 border-accent/20 hover:bg-node/90 hover:text-text-main hover:scale-102"
                )}
              >
                {p.nome_periodo}
                <span className="block text-xxs font-normal opacity-60 mt-0.5">
                  {p.inicio_ma} Ma a {p.fim_ma} Ma
                </span>
              </button>
            ))}
          </div>

          {/* Conteúdo das estatísticas */}
          <div className="flex-1 w-full flex flex-col gap-6 animate-fadeIn">
            
            {/* Tabela de Clados */}
            <div className="bg-node border border-accent/10 p-6 rounded-2xl shadow-md w-full">
              <h3 className="font-bold text-sm uppercase tracking-wider text-accent mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Dados: {periodoSelecionado.nome_periodo}
              </h3>
              <div className="w-full overflow-x-auto">
                {periodoSelecionado.tabelaClados.length === 0 ? (
                  <p className="text-xs text-text-main/50 p-4 text-center">Nenhum dado taxonômico catalogado para este período.</p>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-accent/20 text-text-main/50 uppercase tracking-wider font-semibold text-xxs">
                        <th className="py-3 px-2">Clado</th>
                        <th className="py-3 px-2 text-center">Nº Espécies</th>
                        <th className="py-3 px-2 text-right">Comp. Médio</th>
                        <th className="py-3 px-2 text-right">Alt. Média</th>
                        <th className="py-3 px-2 text-right">Peso Médio</th>
                        <th className="py-3 px-2 text-center">Dieta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {periodoSelecionado.tabelaClados.map((c, i) => (
                        <tr key={i} className="border-b border-accent/5 hover:bg-header/30 transition-colors">
                          <td className="py-3 px-2 font-bold text-text-main">{c.cladoName}</td>
                          <td className="py-3 px-2 text-center font-bold text-accent">{c.totalEspecies}</td>
                          <td className="py-3 px-2 text-right font-medium">{c.comprimentoMedio > 0 ? `${c.comprimentoMedio} m` : "—"}</td>
                          <td className="py-3 px-2 text-right font-medium">{c.alturaMedia > 0 ? `${c.alturaMedia} m` : "—"}</td>
                          <td className="py-3 px-2 text-right font-medium text-accent/90">{c.pesoMedio > 0 ? `${c.pesoMedio.toLocaleString()} kg` : "—"}</td>
                          <td className="py-3 px-2 text-center"><span className="px-2 py-0.5 rounded bg-header text-xxs text-text-main/80 font-medium">{c.dietaDominante}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Top 3 Gigantes */}
            <div className="bg-node border border-accent/10 p-6 rounded-2xl shadow-md w-full">
              <h3 className="font-bold text-sm uppercase tracking-wider text-accent mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> Maiores Espécimes do {periodoSelecionado.nome_periodo}
              </h3>
              {periodoSelecionado.topGigantes.length === 0 ? (
                <p className="text-xs text-text-main/50 p-4 text-center">Sem dados morfológicos suficientes neste período.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {periodoSelecionado.topGigantes.map((d, index) => (
                    <div key={d.id} className="relative bg-header/40 border border-accent/10 p-4 rounded-xl flex flex-col justify-between">
                      <span className="absolute top-3 right-3 text-2xl font-black text-accent/10">#{index + 1}</span>
                      <div>
                        <span className="text-xxs uppercase font-bold tracking-widest text-accent bg-accent/5 px-2 py-0.5 rounded-md">
                          {d.clado}
                        </span>
                        <h4 className="font-bold text-base text-text-main mt-2 italic">{d.nomeCientifico}</h4>
                        <p className="text-xs text-text-main/50 font-medium">({d.nomePopular})</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-accent/5 flex flex-col gap-1 text-xxs text-text-main/60">
                        <div className="flex justify-between"><span>Comprimento:</span><span className="font-bold text-text-main">{d.comprimento} m</span></div>
                        <div className="flex justify-between"><span>Altura:</span><span className="font-bold text-text-main">{d.altura ? `${d.altura} m` : "—"}</span></div>
                        <div className="flex justify-between"><span>Peso Estimado:</span><span className="font-bold text-accent">{d.peso ? `${d.peso.toLocaleString()} kg` : "—"}</span></div>
                        <div className="flex justify-between mt-1 pt-1 border-t border-accent/5">
                          <span>Fósseis Catalogados:</span>
                          <span className="font-bold text-accent">{d.totalFosseis}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}