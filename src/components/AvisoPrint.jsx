import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AvisoPrint = () => {
  return (
    <div
      style={{
        background: '#ffa600c0',
        color: '#1a1a2e',
        padding: '8px',
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        position: 'fixed', // Fixar no topo
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999, // Ficar na frente de tudo
      }}
    >
      <AlertTriangle size={16} />
      <span>
        Dica de Pro: Para validar missões, use o print nativo do seu aparelho
        (Win+Shift+S ou Celular). Prints do emulador podem sair pretos!
      </span>
    </div>
  );
};

export default AvisoPrint;
