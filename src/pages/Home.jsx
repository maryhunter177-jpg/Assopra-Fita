import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Search, Gamepad2, Heart, Dices, Layers } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtroConsole, setFiltroConsole] = useState('Todos');
  
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem('sopra-fitas-favs');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    localStorage.setItem('sopra-fitas-favs', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id)); 
    } else {
      setFavoritos([...favoritos, id]); 
    }
  };

  const jogos = [
    { 
      id: 'snes-mario', 
      nome: 'Super Mario World', 
      console: 'SNES', 
      capa: 'https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png' 
    },
    { 
      id: 'gen-sonic', 
      nome: 'Sonic The Hedgehog', 
      console: 'MASTER SYSTEM', 
      capa: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Sonic_the_Hedgehog_1_Genesis_box_art.jpg' 
    },
    { 
      id: 'md-sonic2', 
      nome: 'Sonic The Hedgehog 2', 
      console: 'MEGA DRIVE', 
      capa: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Sonic_2_US_Cover.jpg' 
    },
    { 
      id: 'sega-mk3', 
      nome: 'Ultimate Mortal Kombat 3', 
      console: 'MEGA DRIVE', 
      capa: '/ultimate-mortal-kombat-3-capa.webp' 
    },
    { 
      id: 'md-goldenaxe', 
      nome: 'Golden Axe', 
      console: 'MEGA DRIVE', 
      capa: '/goldenaxe.jpg' 
    },
    { 
      id: 'md-streetofrage', 
      nome: 'Streets of Rage', 
      console: 'MEGA DRIVE', 
      capa: '/Streets_of_Rage.jpeg' 
    },
    { 
      id: 'n64-mario', 
      nome: 'Super Mario 64', 
      console: 'NINTENDO 64', 
      capa: '/Super_Mario_64.jpg' 
    },
    { 
      id: 'gba-zelda', 
      nome: 'The Legend of Zelda: The Minish Cap', 
      console: 'GBA', 
      capa: '/zelda.jpg' 
    },
    { 
      id: 'snes-topgear', 
      nome: 'Top Gear', 
      console: 'SNES', 
      capa: '/Capa_de_Top_Gear.jpg' 
    },
    { 
      id: 'gb-pokemon', 
      nome: 'Pokémon Silver', 
      console: 'GAME BOY', 
      capa: '/pokemon-silver.jpg' 
    },
    { 
      id: 'snes-dkc', 
      nome: 'Donkey Kong Country', 
      console: 'SNES', 
      capa: '/dkc.png' 
    },
    // --- NOVOS JOGOS (Agora como SNES) ---
    { 
      id: 'snes-aladdin', 
      nome: 'Disney\'s Aladdin', 
      console: 'SNES',   
      capa: '/aladdin.jpg' 
    },
    { 
      id: 'snes-rrr', 
      nome: 'Rock n\' Roll Racing', 
      console: 'SNES', 
      capa: '/rrr.jpg' 
    }
  ];

  const jogarAleatorio = () => {
    if (jogos.length === 0) return;
    const indiceAleatorio = Math.floor(Math.random() * jogos.length);
    const jogoSorteado = jogos[indiceAleatorio];
    navigate(`/jogar/${jogoSorteado.id}`); 
  };

  const categorias = [
    'Todos', '❤️ Favoritos', 'SNES', 'NES', 'MASTER SYSTEM', 'MEGA DRIVE', 'GBA', 'PLAYSTATION 1', 'NINTENDO 64', 'GAME BOY', 'ATARI'
  ];

  const jogosFiltrados = jogos.filter(jogo => {
    const bateBusca = jogo.nome.toLowerCase().includes(busca.toLowerCase());
    let bateCategoria = true;
    if (filtroConsole === '❤️ Favoritos') {
      bateCategoria = favoritos.includes(jogo.id);
    } else if (filtroConsole !== 'Todos') {
      bateCategoria = jogo.console === filtroConsole;
    }
    return bateBusca && bateCategoria;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(to bottom, #121212, #1a1a2e)', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', width: '100%', flex: 1 }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/logo.jpg" alt="Sopra Fitas Logo" style={{ maxWidth: '350px', width: '100%', height: 'auto', filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.2))' }} />

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <Search color="#666" style={{ position: 'absolute', left: '15px', top: '12px' }} />
                <input type="text" placeholder="Busque por jogo..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '30px', border: '1px solid #333', background: '#1e1e1e', color: 'white', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
            </div>
            <button onClick={jogarAleatorio} title="Estou com sorte!" style={{ background: 'linear-gradient(45deg, #ff00cc, #333399)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}>
                <Dices color="white" size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            {categorias.map((cat) => (
              <button key={cat} onClick={() => setFiltroConsole(cat)} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.3s', marginBottom: '10px', background: filtroConsole === cat ? 'linear-gradient(45deg, #fca311, #ffc300)' : '#242424', color: filtroConsole === cat ? '#1a1a2e' : '#aaa', transform: filtroConsole === cat ? 'scale(1.05)' : 'scale(1)', boxShadow: filtroConsole === cat ? '0 0 15px rgba(255, 195, 0, 0.4)' : 'none' }}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', justifyContent: 'center' }}>
          {jogosFiltrados.length > 0 ? (
            jogosFiltrados.map((jogo) => (
              <div key={jogo.id} style={{ background: '#242038', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #333', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', transition: 'transform 0.2s', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#ffc300'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#333'; }}>
                <button onClick={(e) => { e.stopPropagation(); toggleFavorito(jogo.id); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                  <Heart size={18} color={favoritos.includes(jogo.id) ? "#ff4d4d" : "white"} fill={favoritos.includes(jogo.id) ? "#ff4d4d" : "none"} />
                </button>
                <div style={{ height: '160px', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={jogo.capa} alt={jogo.nome} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{jogo.nome}</h3>
                <span style={{ display: 'inline-block', background: '#121212', color: '#aaa', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px', border: '1px solid #333' }}>
                  {jogo.console}
                </span>
                <div>
                  <Link to={`/jogar/${jogo.id}`}>
                    <button style={{ background: 'linear-gradient(45deg, #fca311, #ffc300)', color: '#1a1a2e', border: 'none', padding: '8px 0', borderRadius: '6px', cursor: 'pointer', fontWeight: '800', fontSize: '0.8rem', width: '100%', textTransform: 'uppercase' }}>
                      Jogar
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', color: '#666' }}>
              <Gamepad2 size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
              <p>{filtroConsole === '❤️ Favoritos' ? "Você ainda não favoritou nenhum jogo!" : `Ainda não temos jogos de ${filtroConsole}...`}</p>
              {filtroConsole !== 'Todos' && (
                  <button onClick={() => setFiltroConsole('Todos')} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #666', color: '#aaa', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}>Ver todos os jogos</button>
              )}
            </div>
          )}
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #333', background: '#121212', color: '#666', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#1e1e1e', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem' }}>
            <Layers size={14} />
            <span>Biblioteca: <strong>{jogos.length} jogos</strong> prontos para jogar</span>
        </div>
        <p>&copy; 2025 Sopra Fitas. Desenvolvido por <strong>Mariana Xavier</strong>.</p>
      </footer>
    </div>
  );
};

export default Home;