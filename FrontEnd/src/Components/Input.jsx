export function Input({ type = "text", placeholder, value, onChange, className }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={'text-text placeholder:text-secondary font-bold border border-primary focus:outline-none focus:ring-2 focus:ring-blue-500 ' + className}
        />
    );
}