import { cn } from '../lib/utils';

export function InfoPanel({ icon: Icon, title, items, className }) {
  return (
    <div className={cn("absolute z-10 p-5 rounded-xl shadow-lg backdrop-blur-sm min-w-60 bg-node text-text-main border border-accent", className)}>
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-5 h-5 text-accent" />}
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="text-sm opacity-90 flex items-center gap-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}