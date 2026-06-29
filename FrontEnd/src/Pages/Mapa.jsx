import { useState, useEffect, useCallback } from "react";
import { cn } from "../lib/utils";
import { Loader2, Map as MapIcon, Search, X } from "lucide-react";
import { InfoModal } from "../Components/InfoModal";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color: var(--paleo-accent); width: 16px; height: 16px; border-radius: 50%; border: 3px solid var(--paleo-border); cursor: pointer;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

function FossilZoomer({ fossil }){
    const map = useMap();
    useEffect(() => {
        if (fossil && fossil.latitude != null && fossil.longitude != null) {
            map.flyTo([fossil.latitude, fossil.longitude], 6, { duration: 1.5 });
        }
    }, [fossil, map]);
    return null;
}

export function Mapa({ isDarkMode }) {
  const location = useLocation();
  const [periodos, setPeriodos] = useState([]);
  const [activePeriodId, setActivePeriodId] = useState(null);
  const [fosseis, setFosseis] = useState([]);
  const [todosFosseis, setTodosFosseis] = useState([]);
  const [fossilSelecionado, setFossilSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [dadosModal, setDadosModal] = useState(null);

  const tileUrl = isDarkMode
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
    : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";

  const abrirDetalhes = useCallback((fossil) => {
    const especie = fossil.especie_dinossauro;

    const dadosFormatados = {
      nomeCientifico: especie.nome_cientifico,
      nomePopular: especie.nome_popular,
      dieta: especie.dieta,
      altura: especie.altura_m,
      comprimento: especie.comprimento_m,
      peso: especie.peso_estimado_kg,
      descricao: especie.descricao,
      descoberta: especie.ano_descoberta,
      url_imagem: especie.url_imagem,
      localidade_exata: fossil.localidade_exata
    };

    setDadosModal(dadosFormatados);
    setModalAberto(true);
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      try{
        const resPeriodos = await fetch("http://localhost:3333/periodos");
        const dataPeriodos = await resPeriodos.json();
        
        if(Array.isArray(dataPeriodos)){
          setPeriodos(dataPeriodos);
          
          // Busca todos os fósseis para popular a barra de pesquisa
          const allPromises = dataPeriodos.map(p => 
            fetch(`http://localhost:3333/fosseis/${p.id_periodo}`).then(r => r.json())
          );
          const allResults = await Promise.all(allPromises);
          
          // Unifica os arrays e limpa dados sem coordenadas
          const combinedFossils = allResults.flat().filter(f => f && f.latitude != null);
          setTodosFosseis(combinedFossils);

          // Verifica se vem do Modal da Árvore com a instrução de zoom
          const targetSpecies = location.state?.searchEspecie;
          let initialPeriodId = null;

          if(targetSpecies){
            const found = combinedFossils.find(f => f.especie_dinossauro?.nome_cientifico === targetSpecies);
            
            if(found){
              setFossilSelecionado(found);
              initialPeriodId = found.especie_dinossauro.id_periodo;
              // Limpa o estado da rota para não disparar de novo num refresh
              window.history.replaceState({}, document.title);
            }
          }

          if(!initialPeriodId && dataPeriodos.length > 0){
            const periodoSalvo = localStorage.getItem("paleotree_periodo_ativo");

            if(periodoSalvo && dataPeriodos.some(p => p.id_periodo.toString() === periodoSalvo)){
              initialPeriodId = Number(periodoSalvo);
            } else {
              initialPeriodId = dataPeriodos[0].id_periodo;
            }
          }

          if(initialPeriodId){
            alterarPeriodo(initialPeriodId);
          }
        }
      } catch(err){
        console.error("Erro ao carregar dados iniciais:", err);
      }
    };
    loadAllData();
  }, [location.state]);

  const alterarPeriodo = useCallback(async (idPeriodo) => {
    setIsLoading(true);
    setActivePeriodId(idPeriodo);
    localStorage.setItem("paleotree_periodo_ativo", idPeriodo.toString());

    try {
      const res = await fetch(`http://localhost:3333/fosseis/${idPeriodo}`);
      const data = await res.json();
      
      // Garante que fossils seja sempre um array, nunca um objeto de erro
      setFosseis(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar fósseis:", err);
      setFosseis([]); // Em caso de falha de rede, limpa o mapa em vez de quebrar a tela
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Quando o usuário clica no menu da esquerda, limpa a pesquisa e exibe o período todo
  const clickMenuLateral = (idPeriodo) => {
    setFossilSelecionado(null);
    setSearchTerm("");
    alterarPeriodo(idPeriodo);
  };

  // Quando o usuário seleciona uma espécie na busca
  const handleSelectFossil = (fossil) => {
    setFossilSelecionado(fossil);
    setActivePeriodId(fossil.especie_dinossauro.id_periodo);
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter' && searchTerm.length > 0){
      const allFiltered = todosFosseis.filter(f =>
        f.especie_dinossauro.nome_cientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.especie_dinossauro.nome_popular?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if(allFiltered.length > 0){
        handleSelectFossil(allFiltered[0]);
        e.target.blur(); 
      }
    }
  };

  // Se pesquisou algo, mostra só o marcador. Se não, mostra todos os marcadores.
  const marcadoresVisiveis = fossilSelecionado ? [fossilSelecionado] : (Array.isArray(fosseis) ? fosseis : []);

  return (
    <>
      <div className="absolute top-6 left-6 z-40 flex flex-col gap-3 max-w-64 bg-transparent pointer-events-auto">
        <h2 className={cn("font-bold text-xs tracking-wider uppercase mb-1 drop-shadow-sm opacity-80 pl-1", isDarkMode ? "text-text-main" : "text-wine")}> 
          Períodos Geológico
        </h2>
        {periodos.map((periodo) => (
          <button
            key={periodo.id_periodo}
            onClick={() => clickMenuLateral(periodo.id_periodo)}
            className={cn(
              "px-5 py-3 rounded-xl font-bold text-sm text-left transition-all duration-300 shadow-md border cursor-pointer",
              activePeriodId === periodo.id_periodo
                ? "bg-header text-text-main border-accent scale-102 ring-2 ring-accent/30"
                : "bg-node text-text-main/80 border-accent/20 hover:bg-node/90 hover:text-text-main hover:scale-102"
            )}
          >
            {periodo.nome_periodo}
            <span className="block text-xxs font-normal opacity-60 mt-0.5">
              {periodo.inicio_ma} Ma a {periodo.fim_ma} Ma
            </span>
          </button>
        ))}
      </div>

      <div className="absolute top-6 right-6 z-40 w-80 pointer-events-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar espécie..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)} // Delay para dar tempo de clicar no dropdown
            className="w-full bg-node border-2 border-accent/50 text-text-main rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-accent shadow-xl transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-accent/70" />
        </div>

        {/* Dropdown de Resultados Agrupados */}
        {isSearchOpen && searchTerm.length > 0 && (
          <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto custom-scrollbar bg-node border-2 border-accent/20 rounded-xl shadow-2xl flex flex-col p-2 gap-2 animate-in fade-in slide-in-from-top-2">
            {periodos.map(p => {
              // Filtra as espécies baseadas no termo digitado
              const fosseisDoPeriodo = todosFosseis.filter(f =>
                f.especie_dinossauro.id_periodo === p.id_periodo &&
                (f.especie_dinossauro.nome_cientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  f.especie_dinossauro.nome_popular?.toLowerCase().includes(searchTerm.toLowerCase()))
              );

              if(fosseisDoPeriodo.length === 0) return null;

              return (
                <div key={p.id_periodo} className="flex flex-col">
                  <span className="text-xxs font-black uppercase tracking-widest text-accent px-3 py-1.5 opacity-90 border-b border-accent/10 mb-1">
                    {p.nome_periodo}
                  </span>
                  {fosseisDoPeriodo.map(f => (
                    <button
                      key={f.id_fossil}
                      onMouseDown={() => handleSelectFossil(f)}
                      className="text-left px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors text-sm text-text-main cursor-pointer"
                    >
                      <span className="font-bold italic text-accent">{f.especie_dinossauro.nome_cientifico}</span>
                      {f.especie_dinossauro.nome_popular && <span className="text-xs opacity-70 ml-2">({f.especie_dinossauro.nome_popular})</span>}
                    </button>
                  ))}
                </div>
              );
            })}

            {/* Se não achou nada */}
            {todosFosseis.filter(f => 
              f.especie_dinossauro.nome_cientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
              f.especie_dinossauro.nome_popular?.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <div className="p-4 text-center text-sm text-text-main/50 font-medium">Nenhuma espécie encontrada.</div>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-500 flex items-center justify-center bg-canvas/40 backdrop-blur-xs">
          <div className="flex flex-col items-center gap-2 text-header bg-node/90 p-4 rounded-xl border border-accent/20 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-main/70">Mapeando Terreno...</span>
          </div>
        </div>
      )}

      <div className="w-full h-[calc(100vh-88px)] z-0 relative bg-canvas">
        <MapContainer 
          center={[20, 0]} 
          zoom={3}
          minZoom={3}
          maxBounds={worldBounds}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          style={{ width: "100%", height: "100%", background: "transparent" }}
          zoomControl={false}
        >
          <TileLayer
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            noWrap={true}
          />

          {fossilSelecionado && <FossilZoomer fossil={fossilSelecionado} />}

          {marcadoresVisiveis.map((fossil) => (
            <Marker 
              key={fossil.id_fossil} 
              position={[fossil.latitude, fossil.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => abrirDetalhes(fossil)
              }}
            >
               <Tooltip direction="top" offset={[0, -10]} opacity={1} className="bg-header! text-text-main! border-accent! rounded-lg! font-bold!">
                <span className="italic text-accent block">{fossil.especie_dinossauro?.nome_cientifico}</span>
                <span className="text-xs font-normal opacity-80">{fossil.localidade_exata}</span>
              </Tooltip> 
            </Marker>
          ))}
        </MapContainer>
      </div>

      <InfoModal 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        data={dadosModal} 
      />
    </>
  );
}