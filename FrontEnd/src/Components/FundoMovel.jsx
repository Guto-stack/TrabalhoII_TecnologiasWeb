import {useRef, useState} from 'react';
import sauro from '../assets/sauro.png';

function FundoMovel() {
        const isDragging = useRef(false);
        const startPan = useRef({ x: 0, y: 0 });
        const [offset, setOffset] = useState({ x: 0, y: 0 });

        const handleMouseDown = (e) => {
            isDragging.current= true;
            startPan.current ={
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            };
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current) return;
            setOffset({
                x: e.clientX - startPan.current.x,
                y: e.clientY - startPan.current.y   
            });
            }

        const handleMouseUpOrLeave = () => {
            isDragging.current=false;
        };

        return (
            <div className="w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing animate-gradient" 
                 style={{ background: 'linear-gradient(-45deg, #0a0f0a, #141f14, #1a2e1a, #2d4a2d, #4a6e3c, #7aaa68, #D4621A, #2d4a2d, #0a0f0a)',
                        backgroundSize: '400% 400%',}}
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove} 
            onMouseUp={handleMouseUpOrLeave} 
            onMouseLeave={handleMouseUpOrLeave}>
                <div 
                     style={{transform: `translate(${offset.x}px, ${offset.y}px)`}}>
                            <img src={sauro} alt="Dinosaur" className="w-64 h-64 object-cover mx-auto mt-20" />
                        </div>
            </div>  


)};

export default FundoMovel;