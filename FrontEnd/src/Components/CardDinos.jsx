function CardDinos({dino}){
    return(
        <div className="w-64 h-64 bg-gray-300 rounded-lg flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-2">{dino.name}</h2>
            <p className="text-gray-600 mb-4">{dino.description}</p>
            <img src={dino.image} alt={dino.name} className="w-32 h-32 object-cover rounded-full" />
        </div>
    );
}

export default CardDinos;