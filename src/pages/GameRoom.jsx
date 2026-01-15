import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Emulator from '../components/Emulator';
import { supabase } from '../supabaseClient';
import {
  Calendar,
  Gamepad,
  ArrowRight,
  Download,
  Upload,
  RotateCcw,
  Maximize,
  Trophy,
  X,
  Loader2,
  Home,
  LogOut,
} from 'lucide-react';
import AnuncioLateral from '../components/AnuncioLateral';
import { gamesDb } from '../constants/games';

const GameRoom = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [modalAberto, setModalAberto] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [session, setSession] = useState(null);

  const [jogoAtual, setJogoAtual] = useState(null);
  const [outrosJogos, setOutrosJogos] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    return () => window.removeEventListener('resize', handleResize);
  }, [gameId]);

  const salvarJogo = () => {
    if (window.EJS_player) window.EJS_player.saveState();
  };
  const carregarJogo = () => {
    if (window.EJS_player) window.EJS_player.loadState();
  };
  const reiniciarJogo = () => {
    if (window.EJS_player) window.EJS_player.restart();
  };

  const telaCheia = () => {
    if (window.EJS_player) {
      try {
        window.EJS_player.maximize();
      } catch (e) {}
    }
    const elem = document.getElementById('tela-do-jogo');
    if (elem) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    }
  };

  const sairDoJogo = () => {
    // Se quiser adicionar lógica de salvar antes de sair, coloque aqui
    navigate('/'); // Volta para a Home
  };

  const relacionados = useMemo(
    () => outrosJogos.sort(() => 0.5 - Math.random()).slice(0, 2),
    [outrosJogos]
  );

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!arquivo) return alert('Selecione um print primeiro!');
    if (!session) return alert('Você precisa estar logado!');

    setUploading(true);
    try {
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('prints')
        .upload(fileName, arquivo);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('prints').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('missoes').insert({
        user_id: session.user.id,
        game_id: gameId,
        game_nome: jogoAtual.nome,
        print_url: publicUrl,
        status: 'pendente',
      });

      if (dbError) throw dbError;

      alert('Missão enviada! 🚀 O GM analisará seu print.');
      setModalAberto(false);
      setArquivo(null);
    } catch (error) {
      alert('Erro ao enviar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentGame = async () => {
      const currentGameDb = gamesDb[gameId];

      if (currentGameDb) {
        setJogoAtual(currentGameDb);
        return;
      }

      const { data: currentGame, error: currentGameError } = await supabase
        .from('jogos')
        .select('*')
        .eq('id', gameId)
        .single();

      if (currentGameError) {
        alert('Houve um erro ao obter a ROM');
        return;
      }

      setJogoAtual(currentGame);
    };

    const fetchOtherGames = async () => {
      const { data: otherGames, error: otherGamesError } = await supabase
        .from('jogos')
        .select('*')
        .neq('id', gameId)
        .limit(2);

      const gamesDbToArray = Object.values(gamesDb).filter(
        (jogo) => jogo.id !== gameId
      );

      setOutrosJogos(() => {
        if (otherGames.length > 0 && !otherGamesError) {
          return [...otherGames, ...gamesDbToArray];
        }

        return gamesDbToArray;
      });
    };

    fetchCurrentGame();
    fetchOtherGames();
  }, [gameId]);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: '100vh',
        background: '#121212',
        color: 'white',
        fontFamily: '"Inter", sans-serif',
        justifyContent: 'center',
      }}
    >
      <aside
        style={{
          width: isMobile ? '100%' : '300px',
          background: '#1e1e1e',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRight: isMobile ? 'none' : '1px solid #333',
          borderBottom: isMobile ? '1px solid #333' : 'none',
          order: isMobile ? 3 : 1,
        }}
      >
        <h4 style={{ color: '#555', marginBottom: '10px' }}>Publicidade</h4>
        <AnuncioLateral
          adKey="658f27ccb9910421c7c8e05c3a696689"
          width={300}
          height={250}
        />
      </aside>

      <main
        style={{
          flex: 1,
          minWidth: '320px',
          maxWidth: '1000px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          position: 'relative',
          order: 2,
        }}
      >
        {jogoAtual ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              id="tela-do-jogo"
              style={{
                width: '100%',
                aspectRatio: '4/3',
                background: 'black',
                boxShadow: '0 0 50px rgba(0,0,0,0.8)',
                borderRadius: '10px 10px 0 0',
                overflow: 'hidden',
                border: '2px solid #333',
                borderBottom: 'none',
              }}
            >
              <Emulator gameUrl={jogoAtual.rom_url} core={jogoAtual.core} />
            </div>

            <div
              style={{
                width: '100%',
                background: '#252525',
                padding: '10px',
                borderRadius: '0 0 10px 10px',
                border: '2px solid #333',
                borderTop: '1px solid #444',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              {/* BOTÃO DE SAIR ADICIONADO AQUI */}
              <button
                onClick={sairDoJogo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#7f1d1d',
                  color: 'white',
                  border: '1px solid #991b1b',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                <Home size={16} /> Sair
              </button>
              <div
                style={{ width: '1px', background: '#444', margin: '0 5px' }}
              ></div>{' '}
              {/* Separador Visual */}
              <button
                onClick={salvarJogo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#333',
                  color: 'white',
                  border: '1px solid #555',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                <Download size={16} /> Salvar
              </button>
              <button
                onClick={carregarJogo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#333',
                  color: 'white',
                  border: '1px solid #555',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                <Upload size={16} /> Carregar
              </button>
              <button
                onClick={reiniciarJogo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#333',
                  color: 'white',
                  border: '1px solid #555',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={16} /> Reiniciar
              </button>
              <button
                onClick={telaCheia}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#fbbf24',
                  color: '#000',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                <Maximize size={16} /> Tela Cheia
              </button>
            </div>

            <div
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '20px',
                background: '#1e1e1e',
                borderRadius: '10px',
                border: '1px solid #333',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
                    {jogoAtual.nome}
                  </h1>
                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
                      color: '#888',
                      marginBottom: '15px',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Calendar size={14} /> {jogoAtual.ano}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Gamepad size={14} /> {jogoAtual.fabricante}
                    </span>
                  </div>
                  <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                    {jogoAtual.descricao}
                  </p>
                </div>

                <div
                  style={{
                    background: '#252525',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #333',
                    width: isMobile ? '100%' : '300px',
                  }}
                >
                  <h3
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px',
                      color: '#fbbf24',
                    }}
                  >
                    <Trophy size={20} /> Missão de Jogo
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#aaa',
                      marginBottom: '15px',
                    }}
                  >
                    Tire um print da sua maior pontuação ou do final do jogo e
                    nos envie!
                  </p>
                  <button
                    onClick={() => setModalAberto(true)}
                    style={{
                      width: '100%',
                      background: '#fbbf24',
                      color: '#000',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Enviar Print
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{ width: '100%', marginTop: '30px', textAlign: 'left' }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  color: '#888',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <ArrowRight size={20} /> Jogos Relacionados
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '20px',
                }}
              >
                {relacionados.map((jogo) => (
                  <Link
                    key={jogo.id}
                    to={`/jogar/${jogo.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'white',
                      background: '#1e1e1e',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      transition: '0.3s',
                    }}
                  >
                    {/* Imagem da capa_url agora com extensão correta */}
                    <img
                      src={jogo.capa_url}
                      alt={jogo.nome}
                      style={{
                        width: '100%',
                        borderRadius: '5px',
                        marginBottom: '10px',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        display: 'block',
                      }}
                    >
                      {jogo.nome}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: '#fbbf24', marginBottom: '10px' }}
            />
            <p>Carregando jogo...</p>
          </div>
        )}
      </main>

      <aside
        style={{
          width: isMobile ? '100%' : '300px',
          background: '#1e1e1e',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderLeft: isMobile ? 'none' : '1px solid #333',
          borderTop: isMobile ? '1px solid #333' : 'none',
          order: 4,
        }}
      >
        <h4 style={{ color: '#555', marginBottom: '10px' }}>Publicidade</h4>
        <AnuncioLateral
          adKey="658f27ccb9910421c7c8e05c3a696689"
          width={300}
          height={250}
        />
      </aside>

      {modalAberto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#1e1e1e',
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '400px',
              width: '100%',
              border: '1px solid #333',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setModalAberto(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#555',
                cursor: 'pointer',
              }}
            >
              <X size={24} />
            </button>
            <h2
              style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Trophy style={{ color: '#fbbf24' }} /> Enviar Missão
            </h2>
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    color: '#888',
                    fontSize: '0.9rem',
                  }}
                >
                  Selecione o print da tela:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setArquivo(e.target.files[0])}
                  style={{ width: '100%', color: '#888' }}
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: '100%',
                  background: uploading ? '#444' : '#fbbf24',
                  color: '#000',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                }}
              >
                {uploading ? (
                  <Loader2
                    className="animate-spin"
                    style={{ margin: '0 auto' }}
                  />
                ) : (
                  'Confirmar Envio'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
