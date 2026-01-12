import React, { useEffect, useRef } from 'react';

const AnuncioLateral = ({ adKey, width, height }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !adKey) return;

    const doc = iframe.contentWindow.document;
    
    // Conteúdo do anúncio com script extra de proteção contra popups
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
              // Mata popups na origem caso o sandbox falhe
              window.open = function() { 
                console.log('Popup bloqueado pelo Sopra Fitas!'); 
                return null; 
              };
          </script>
        </body>
      </html>
    `;

    try {
      doc.open();
      doc.write(adContent);
      doc.close();
    } catch (err) {
      console.error("Erro ao carregar anúncio:", err);
    }

  }, [adKey, width, height]);

  return (
    <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
      <iframe
        ref={iframeRef}
        title="Publicidade"
        width={width}
        height={height}
        sandbox="allow-scripts allow-same-origin allow-forms"
        referrerPolicy="no-referrer"
        scrolling="no"
        style={{ 
            border: 'none', 
            overflow: 'hidden', 
            borderRadius: '8px', 
            background: '#252525',
            maxWidth: '100%' 
        }}
      />
    </div>
  );
};

export default AnuncioLateral;