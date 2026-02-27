import { useMemo } from 'react';

const InteractiveBear = ({ inputLength = 0, isPasswordFocus = false, showPassword = false }) => {
    
    // --- 1. LÓGICA DE SEGUIMIENTO (Ojos) ---
    const { eyeTransform, snoutTransform } = useMemo(() => {
        // Límite horizontal (Eje X)
        const trackingLimit = 12; 
        const moveX = inputLength === 0 ? 0 : Math.min(inputLength * 1.2, trackingLimit); 
        
        // Lógica Vertical (Eje Y) ---
        // Si estamos viendo el password, hay que mirar más ABAJO porque el input está abajo.
        // Si es email, miramos al frente.
        const lookDownY = (isPasswordFocus && showPassword) ? 6 : 0; 

        // Si está enfocado en password y Oculto (Miedo/Tapar)
        if (isPasswordFocus && !showPassword) {
            return {
                eyeTransform: 'translate(0px, -8px)', // Mira arriba (evita ver)
                snoutTransform: 'translate(0px, -4px)'
            };
        }

        // Estado normal (Email o Password Visible)
        return {
            // Aplicamos moveX (seguimiento texto) y lookDownY (altura del input)
            eyeTransform: `translate(${moveX}px, ${lookDownY}px)`, 
            snoutTransform: `translate(${moveX * 0.4}px, ${lookDownY * 0.5}px)`
        };
    }, [inputLength, isPasswordFocus, showPassword]);

    // --- 2. LÓGICA DE BRAZOS ---
    let handState = "translateY(160px)"; 
    let rotateLeft = "rotate(0deg)";
    let rotateRight = "rotate(0deg)";

    if (isPasswordFocus) {
        if (showPassword) {
            // "Peeking": Baja las manos a la barbilla para leer cómodo
            handState = "translateY(125px)";
            rotateLeft = "rotate(-25deg)";
            rotateRight = "rotate(25deg)";
        } else {
            // "Covering": Sube a tapar
            handState = "translateY(0px)";
            rotateLeft = "rotate(0deg)";
            rotateRight = "rotate(0deg)";
        }
    }

    const springTransition = "transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]";

    return (
        <div className="w-[140px] h-[140px] rounded-full overflow-hidden bg-[#Dbeafe] border-4 border-white shadow-2xl mx-auto relative z-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <path d="M40,120 C40,60 160,60 160,120 L160,200 L40,200 Z" fill="#374151" />
                
                {/* Orejas */}
                <circle cx="35" cy="75" r="18" fill="#374151" />
                <circle cx="165" cy="75" r="18" fill="#374151" />
                <circle cx="35" cy="75" r="8" fill="#4B5563" />
                <circle cx="165" cy="75" r="8" fill="#4B5563" />

                {/* Hocico */}
                <g style={{ transform: snoutTransform }} className="transition-transform duration-200">
                    <ellipse cx="100" cy="125" rx="40" ry="25" fill="#E5E7EB" />
                    <ellipse cx="100" cy="115" rx="18" ry="12" fill="#1F2937" />
                </g>

                {/* Ojos */}
                <g style={{ transform: eyeTransform }} className="transition-transform duration-100">
                    <circle cx="70" cy="95" r="14" fill="white" />
                    <circle cx="70" cy="95" r="5" fill="#111827" />
                    <circle cx="130" cy="95" r="14" fill="white" />
                    <circle cx="130" cy="95" r="5" fill="#111827" />
                </g>

                {/* Manos */}
                <g className={springTransition} style={{ transform: handState }}>
                    <g className={`${springTransition} origin-[20px_200px]`} style={{ transform: rotateLeft }}>
                        <path d="M 20 250 L 20 100 C 20 70, 80 70, 80 100 L 80 250 Z" fill="#374151" />
                        <circle cx="50" cy="90" r="12" fill="#E5E7EB" />
                    </g>
                    <g className={`${springTransition} origin-[180px_200px]`} style={{ transform: rotateRight }}>
                        <path d="M 120 250 L 120 100 C 120 70, 180 70, 180 100 L 180 250 Z" fill="#374151" />
                        <circle cx="150" cy="90" r="12" fill="#E5E7EB" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default InteractiveBear;