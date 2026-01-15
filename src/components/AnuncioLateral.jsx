import React, { useEffect, useRef } from 'react';

const AnuncioLateral = ({ adKey, width, height }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !adKey) return;

    const doc = iframe.contentWindow.document;

    const adContent = `
      <!DOCTYPE html>
      <html style="margin:0;padding:0;overflow:hidden;">
        <body style="margin:0;padding:0;background-color:#252525;display:flex;justify-content:center;align-items:center;">
          <script type="text/javascript">
            atOptions = {
              'key' : '${adKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
          <script>
              window.open = function() { return null; };
              // Mata loops infinitos de scripts de terceiros que travam o celular
              setInterval(() => { if(window.length > 5) window.stop(); }, 5000);
          </script>
        </body>
      </html>
    `;

    try {
      doc.open();
      doc.write(adContent);
      doc.close();
    } catch (err) {
      console.error('Erro ao carregar anúncio:', err);
    }
  }, [adKey, width, height]);

  return (
    <div
      style={{
        margin: '10px 0',
        display: 'flex',
        justifyContent: 'center',
        minHeight: height, // Reserva o espaço para evitar pulos na tela
      }}
    >
      <iframe
        ref={iframeRef}
        title="Publicidade"
        width={width}
        height={height}
        loading="lazy" // SÓ CARREGA QUANDO O USER CHEGA PERTO (GANHA MUITO FPS)
        sandbox="allow-scripts allow-same-origin allow-forms"
        referrerPolicy="no-referrer"
        scrolling="no"
        style={{
          border: 'none',
          overflow: 'hidden',
          borderRadius: '8px',
          background: '#252525',
          maxWidth: '100%',
          aspectRatio: `${width}/${height}`,
        }}
      />
    </div>
  );
};

export default AnuncioLateral;
