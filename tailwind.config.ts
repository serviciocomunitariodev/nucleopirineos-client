import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tu antiguo azul-celeste pasa a ser el Turquesa PNIS para transicionar suavemente
        brand: {
          50: "#e6f7fa",   // Un tono sutil basado en el nuevo turquesa para fondos ligeros
          100: "#b3ebf2",  // Tono claro de turquesa para bordes o decoraciones sutiles
          500: "#00addc",  // Turquesa PNIS Original (Para mantener un azul/turquesa de marca vivo)
          700: "#00c4b3",  // Turqueza PFA Original (El otro enfoque solicitado)
        },
        
        // El color principal de ellos ahora es el Azul PAP (#022169)
        primary: "#022169", 
        
        // El color secundario pasa a ser el Turqueza PFA para contrastar como acento
        secondary: "#00c4b3", 
        
        // Mantenemos el fondo limpio y claro que ya tenían configurado
        background: "#FDFDF9", 
        
        // Variantes interactivas del nuevo primary (Azul PAP):
        primaryActive: "#011749", // Un tono más oscuro del Azul PAP para el estado activo
        primaryHover: "#011c59",  // Un tono intermedio del Azul PAP para el estado hover
        
        // Superficies se mantiene con un tono neutro/grisáceo para no saturar la interfaz
        superficies: "#F1F1E6", 
      },
      borderRadius: {
        xl: "0.9rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;