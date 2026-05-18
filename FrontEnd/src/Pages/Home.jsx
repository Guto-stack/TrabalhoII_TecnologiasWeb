import { Header } from "../Components/Header";

function Home(){
    return (
        <div className="h-screen w-screen bg-background">
        <Header />
        
        <div 
        className="animate-gradient h-screen"
        style={{
                background: 'linear-gradient(-45deg, #0a0f0a, #141f14, #1a2e1a, #2d4a2d, #4a6e3c, #7aaa68, #D4621A, #2d4a2d, #0a0f0a)',
                backgroundSize: '400% 400%',
            }}
        >
          <nav className='flex gap-4 p-4'>
            <a href="/login" className='text-primary font-bold text-2xl'>Login</a>
            <a href="/register" className='text-primary font-bold text-2xl'>Register</a>
            
                </nav>
        </div>
        </div>
    );
}

export default Home