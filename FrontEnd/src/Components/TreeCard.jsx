import { Handle, Position } from 'reactflow';
import { Info, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function TreeCard({ data }) {
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
        <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", data.isExpanded ? "rotate-90" : "rotate-0")} />
      </div>

      <div className="flex-1 flex flex-col text-left">
        <span className="text-lg font-bold leading-tight">{data.label}</span>
      </div>

      <button className="shrink-0 flex items-center justify-center w-7 h-7 bg-accent/20 hover:bg-accent/40 text-accent rounded-md transition-colors cursor-pointer">
        <Info className="w-4 h-4" />
      </button>

      <Handle type="source" position={Position.Bottom} className="opacity-0 w-full h-2" />
    </div>
  );
}