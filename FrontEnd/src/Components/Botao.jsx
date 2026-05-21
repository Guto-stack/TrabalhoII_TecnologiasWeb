export function Botao({ children, onClick, className, type = "button" }) {
    return (
        <button type={type} onClick={onClick} className={className}>
            {children}
        </button>
    );
}