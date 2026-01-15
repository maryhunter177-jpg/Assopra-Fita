import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Search,
  Gamepad2,
  Heart,
  Dices,
  Layers,
  User,
  LogOut,
  Coins,
  Trophy,
  Crown,
  Medal,
} from 'lucide-react';
import { games } from '../constants/games';

const Home = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [pontos, setPontos] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [ranking, setRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [jogos, setJogos] = useState(games);
  const [busca, setBusca] = useState('');
  const [filtroConsole, setFiltroConsole] = useState('Todos');

  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem('sopra-fitas-favs');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    localStorage.setItem('sopra-fitas-favs', JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const { data, error } = await supabase.from('jogos').select('*');

        if (error) throw error;
        if (data.length > 0) {
          setJogos([...data, ...games]);
        }
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchJogos();
  }, []);

  useEffect(() => {
    const fetchDados = async (userId) => {
      const { data: perfil } = await supabase
        .from('profiles')
        .select('pontos', 'nome')
        .eq('id', userId)
        .single();
      if (perfil) {
        setPontos(perfil.pontos);
        setNomeUsuario(perfil.nome);
      }
    };

    const fetchRanking = async () => {
      setLoadingRanking(true);
      const { data } = await supabase
        .from('profiles')
        .select('nome, pontos')
        .order('pontos', { ascending: false })
        .limit(5);
      if (data) setRanking(data);
      setLoadingRanking(false);
    };

    fetchRanking();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchDados(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchDados(session.user.id);
      } else {
        setPontos(0);
        setNomeUsuario('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('Você saiu da conta! Até mais 👋');
  };

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favId) => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  const jogarAleatorio = () => {
    if (jogos.length === 0) return;
    const indiceAleatorio = Math.floor(Math.random() * jogos.length);
    const jogoSorteado = jogos[indiceAleatorio];
    navigate(`/jogar/${jogoSorteado.id}`);
  };

  const categorias = [
    'Todos',
    '❤️ Favoritos',
    'SNES',
    'MASTER SYSTEM',
    'MEGA DRIVE',
    'NES',
    'GBA',
    'GAME BOY',
    'NINTENDO 64',
    'ATARI',
  ];

  const jogosFiltrados = jogos.filter((jogo) => {
    const bateBusca = jogo.nome?.toLowerCase().includes(busca.toLowerCase());
    let bateCategoria = true;
    if (filtroConsole === '❤️ Favoritos') {
      bateCategoria = favoritos.includes(jogo.id);
    } else if (filtroConsole !== 'Todos') {
      bateCategoria = jogo.console === filtroConsole;
    }
    return bateBusca && bateCategoria;
  });

  const getIconeRank = (index) => {
    if (index === 0) return <Crown size={14} color="#fca311" fill="#fca311" />;
    if (index === 1) return <Medal size={14} color="#C0C0C0" />;
    if (index === 2) return <Medal size={14} color="#CD7F32" />;
    return (
      <span style={{ color: '#666', fontSize: '0.7rem', fontWeight: 'bold' }}>
        #{index + 1}
      </span>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #121212, #1a1a2e)',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* HEADER FIXO */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '15px 30px',
          background: 'rgba(18, 18, 18, 0.95)',
          borderBottom: '1px solid #333',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        {session ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#000',
                padding: '6px 15px',
                borderRadius: '20px',
                border: '1px solid #fca311',
              }}
            >
              <Coins size={16} color="#fca311" />
              <span
                style={{
                  color: '#fca311',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}
              >
                {pontos}
              </span>
            </div>
            <Link to="/perfil">
              <button
                style={{
                  background: '#252525',
                  color: '#fff',
                  border: '1px solid #666',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <User size={16} /> {nomeUsuario || 'Meu Perfil'}
              </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: '#333',
                color: '#ff4d4d',
                border: '1px solid #444',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <Link to="/login">
            <button
              style={{
                background: 'linear-gradient(45deg, #fca311, #ffc300)',
                color: '#1a1a2e',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              <User size={16} /> ENTRAR
            </button>
          </Link>
        )}
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '100px 20px 40px 20px',
          width: '100%',
          flex: 1,
        }}
      >
        <header
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src="/logo.jpg"
              alt="Logo"
              style={{ maxWidth: '350px', width: '100%' }}
            />
            {/* RANKING LATERAL */}
            <div
              style={{
                position: 'absolute',
                right: '-300px',
                top: '10px',
                width: '240px',
                background: 'rgba(30, 30, 30, 0.9)',
                border: '1px solid #444',
                borderRadius: '12px',
                padding: '15px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #333',
                  paddingBottom: '5px',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    color: '#fca311',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                  }}
                >
                  TOP 5
                </span>
                <Link
                  to="/ranking"
                  style={{ fontSize: '0.7rem', color: '#888' }}
                >
                  Ver tudo
                </Link>
              </div>
              {loadingRanking ? (
                <span style={{ color: '#666' }}>Carregando...</span>
              ) : (
                ranking.map((user, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      padding: '4px 0',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {getIconeRank(idx)} <span>{user.nome || '---'}</span>
                    </div>
                    <span style={{ color: '#fca311' }}>{user.pontos}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BUSCA E SORTEIO */}
          <div
            style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              maxWidth: '600px',
              margin: '30px auto',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                color="#666"
                style={{ position: 'absolute', left: '15px', top: '12px' }}
              />
              <input
                type="text"
                placeholder="Busque por jogo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  borderRadius: '30px',
                  border: '1px solid #333',
                  background: '#1e1e1e',
                  color: 'white',
                }}
              />
            </div>
            <button
              onClick={jogarAleatorio}
              style={{
                background: 'linear-gradient(45deg, #ff00cc, #333399)',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Dices color="white" size={24} />
            </button>
          </div>

          {/* CATEGORIAS */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroConsole(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: filtroConsole === cat ? '#fca311' : '#242424',
                  color: filtroConsole === cat ? '#1a1a2e' : '#aaa',
                  fontWeight: 'bold',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* GRID DE JOGOS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '20px',
          }}
        >
          {loadingGames ? (
            <span style={{ color: '#666' }}>Carregando...</span>
          ) : (
            jogosFiltrados.map((jogo) => (
              <div
                key={jogo.id}
                style={{
                  background: '#242038',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  border: '1px solid #333',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => toggleFavorito(jogo.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    zIndex: 10,
                    padding: '5px',
                  }}
                >
                  <Heart
                    size={18}
                    color={favoritos.includes(jogo.id) ? '#ff4d4d' : 'white'}
                    fill={favoritos.includes(jogo.id) ? '#ff4d4d' : 'none'}
                  />
                </button>
                <div
                  style={{
                    height: '160px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#000',
                  }}
                >
                  <img
                    src={jogo.capa_url}
                    alt={jogo.nome}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: '0.85rem',
                    color: '#fff',
                    marginBottom: '5px',
                    height: '35px',
                    overflow: 'hidden',
                  }}
                >
                  {jogo.nome}
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#aaa',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  {jogo.console}
                </span>
                <Link to={`/jogar/${jogo.id}`}>
                  <button
                    style={{
                      background: '#fca311',
                      color: '#1a1a2e',
                      border: 'none',
                      padding: '8px 0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      width: '100%',
                      fontWeight: 'bold',
                    }}
                  >
                    JOGAR
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <footer
        style={{
          textAlign: 'center',
          padding: '20px',
          borderTop: '1px solid #333',
          color: '#666',
        }}
      >
        <p>&copy; 2025 Sopra Fitas - {jogos.length} jogos disponíveis.</p>
      </footer>
    </div>
  );
};

export default Home;
