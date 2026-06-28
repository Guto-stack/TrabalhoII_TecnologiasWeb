import { Handle, Position } from 'reactflow';
import { Info, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function TreeCard({ data }) {
  const isEspecie = !!data.nomeCientifico;
  const isNomeComposto = data.label.includes(' ');

  return (
    <div 
      className={cn(
        "relative rounded-xl px-4 py-3 flex items-center gap-3 bg-node text-text-main border border-accent",
        "w-70 min-h-15 transition-all duration-300",
        "cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_14px_#E3B03B60]"
      )}
    >
      <Handle type="target" position={Position.Top} className="opacity-0 w-full h-2" />
      
      <div className="shrink-0 text-accent">
        {!isEspecie && (
          <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", data.isExpanded ? "rotate-90" : "rotate-0")} />
        )}
      </div>

      <div className="flex-1 flex flex-col text-left min-w-0">
        <span className={cn("text-lg font-bold leading-tight w-full block text-balance", isNomeComposto ? "line-clamp-2 wrap-break-words" : "truncate")} title={data.label}>{data.label}</span>
      </div>

      <button onClick={(e) => {
            e.stopPropagation(); 
            if (data.onAbrirModal) {
              data.onAbrirModal(data); }
          }}
          className="shrink-0 p-1.5 rounded-full hover:bg-accent/20 text-accent transition-colors"
          title="Ver detalhes">
          <Info className="w-5 h-5" />
      </button>

      <Handle type="source" position={Position.Bottom} className="opacity-0 w-full h-2" />
    </div>
  );
}