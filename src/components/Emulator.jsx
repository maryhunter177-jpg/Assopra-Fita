import React, { useEffect, useRef } from 'react';

const Emulator = ({ gameUrl, core }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.EJS_player) {
      window.EJS_player = null;
    }
    const existingScript = document.getElementById('emulator-script');
    if (existingScript) existingScript.remove();

    // 2. Configurações Globais do EmulatorJS
    window.EJS_player = '#game';
    window.EJS_core = core;
    window.EJS_gameUrl = gameUrl;
    window.EJS_pathtodata =
      'https://cdn.jsdelivr.net/gh/ethanaobrien/emulatorjs@main/data/';
    window.EJS_startOnLoaded = true;
    window.EJS_DEBUG_XX = true;

    // 3. Injeta o script do emulador dinamicamente
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/gh/ethanaobrien/emulatorjs@main/data/loader.js';
    script.id = 'emulator-script';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('emulator-script');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [gameUrl, core]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div id="game"></div>
    </div>
  );
};

export default Emulator;
