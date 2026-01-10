import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { supabase } from '../supabaseClient'; 
import { Search, Gamepad2, Heart, Dices, Layers, User, LogOut, Coins, Trophy, Crown, Medal } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [pontos, setPontos] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [ranking, setRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
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
    const fetchDados = async (userId) => {
      const { data: perfil } = await supabase.from('profiles').select('pontos, nome').eq('id', userId).single();
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    alert("Você saiu da conta! Até mais 👋");
  };

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id)); 
    } else {
      setFavoritos([...favoritos, id]); 
    }
  };

  // --- LISTA COMPLETA DE JOGOS (CAPAS CORRIGIDAS) ---
  const jogos = [
    // MASTER SYSTEM
    { id: 'sms-sonic', nome: 'Sonic The Hedgehog', console: 'MASTER SYSTEM', core: 'smsplus', gameUrl: '/sonicthehedgehog.sms', capa: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Sonic_the_Hedgehog_1_Genesis_box_art.jpg' },
    { id: 'sms-alex-kidd', nome: 'Alex Kidd in Miracle World', console: 'MASTER SYSTEM', core: 'smsplus', gameUrl: '/alexkidd.sms', capa: '/alexkidd.jpg' },

    // SNES
    { id: 'snes-aladdin', nome: "Disney's Aladdin", console: 'SNES', core: 'snes9x', gameUrl: '/aladdin.sfc', capa: '/aladdin.jpg' },
    { id: 'snes-batman-forever', nome: 'Batman Forever', console: 'SNES', core: 'snes9x', gameUrl: '/batman-forever.sfc', capa: '/batman-forever.jpg' },
    { id: 'snes-battletoads', nome: 'Battletoads', console: 'SNES', core: 'snes9x', gameUrl: '/battletoads.sfc', capa: '/battletoads.jpg' },
    { id: 'snes-battletoads-dd', nome: 'Battletoads & Double Dragon', console: 'SNES', core: 'snes9x', gameUrl: '/battletoads-double-dragon.sfc', capa: '/battletoads-double-dragon.jpg' },
    { id: 'snes-chrono-trigger', nome: 'Chrono Trigger', console: 'SNES', core: 'snes9x', gameUrl: '/chrono-trigger.sfc', capa: '/chrono-trigger.jpg' },
    { id: 'snes-contra3', nome: 'Contra III', console: 'SNES', core: 'snes9x', gameUrl: '/contra-3.sfc', capa: '/contra-3.jpg' },
    { id: 'snes-dkc', nome: 'Donkey Kong Country', console: 'SNES', core: 'snes9x', gameUrl: '/dkc.sfc', capa: '/dkc.png' },
    { id: 'snes-earthworm-jim', nome: 'Earthworm Jim', console: 'SNES', core: 'snes9x', gameUrl: '/earthworm-jim.sfc', capa: '/earthworm-jim.jpg' },
    { id: 'snes-earthworm-jim2', nome: 'Earthworm Jim 2', console: 'SNES', core: 'snes9x', gameUrl: '/earthworm-jim-2.sfc', capa: '/earthworm-jim-2.jpg' },
    { id: 'snes-fatal-fury2', nome: 'Fatal Fury 2', console: 'SNES', core: 'snes9x', gameUrl: '/fatal-fury-2.sfc', capa: '/fatal-fury-2.jpg' },
    { id: 'snes-goof-troop', nome: 'Goof Troop', console: 'SNES', core: 'snes9x', gameUrl: '/goof-troop.sfc', capa: '/goof-troop.jpg' },
    { id: 'snes-harvest-moon', nome: 'Harvest Moon', console: 'SNES', core: 'snes9x', gameUrl: '/harvest-moon.sfc', capa: '/harvest-moon.jpg' },
    { id: 'snes-kirbys-avalanche', nome: "Kirby's Avalanche", console: 'SNES', core: 'snes9x', gameUrl: '/kirbys-avalanche.sfc', capa: '/kirbys-avalanche.jpg' },
    { id: 'snes-kirby-super-star', nome: 'Kirby Super Star', console: 'SNES', core: 'snes9x', gameUrl: '/kirby-super-star.sfc', capa: '/kirby-super-star.jpg' },
    { id: 'snes-megaman-x', nome: 'Mega Man X', console: 'SNES', core: 'snes9x', gameUrl: '/megaman-x.sfc', capa: '/megaman-x.jpg' },
    { id: 'snes-megaman-x2', nome: 'Mega Man X2', console: 'SNES', core: 'snes9x', gameUrl: '/megaman-x2.sfc', capa: '/megaman-x2.jpg' },
    { id: 'snes-megaman-x3', nome: 'Mega Man X3', console: 'SNES', core: 'snes9x', gameUrl: '/megaman-x3.sfc', capa: '/megaman-x3.jpg' },
    { id: 'snes-mk2', nome: 'Mortal Kombat 2', console: 'SNES', core: 'snes9x', gameUrl: '/mortal-kombat-2.sfc', capa: '/mortal-kombat-2.jpg' },
    { id: 'snes-rrr', nome: 'Rock n\' Roll Racing', console: 'SNES', core: 'snes9x', gameUrl: '/rrr.sfc', capa: '/rrr.jpg' },
    { id: 'snes-sf2-turbo', nome: 'Street Fighter II Turbo', console: 'SNES', core: 'snes9x', gameUrl: '/sf2-turbo.sfc', capa: '/sf2-turbo.jpg' },
    { id: 'snes-supermarioworld', nome: 'Super Mario World', console: 'SNES', core: 'snes9x', gameUrl: '/supermarioworld.sfc', capa: 'https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png' },
    { id: 'snes-topgear', nome: 'Top Gear', console: 'SNES', core: 'snes9x', gameUrl: '/topgear.smc', capa: '/Capa_de_Top_Gear.jpg' },
    { id: 'snes-zelda-lttp', nome: 'The Legend of Zelda: A Link to the Past', console: 'SNES', core: 'snes9x', gameUrl: '/zelda-link-to-the-past.sfc', capa: '/zelda-link-to-the-past.jpg' },

    // MEGA DRIVE
    { id: 'md-goldenaxe', nome: 'Golden Axe', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/goldenaxe.smd', capa: '/goldenaxe.jpg' },
    { id: 'md-goldenaxe2', nome: 'Golden Axe 2', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/goldenaxe2.smd', capa: '/goldenaxe2.jpg' },
    { id: 'md-mk3', nome: 'Mortal Kombat 3', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/MortalKombat3.smd', capa: '/ultimate-mortal-kombat-3-capa.webp' },
    { id: 'md-show-do-milhao', nome: 'Show do Milhão', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/show-do-milhao.smd', capa: '/show-do-milhao.jpg' },
    { id: 'md-sonic2', nome: 'Sonic The Hedgehog 2', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/sonicthehedgehog2.smd', capa: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Sonic_2_US_Cover.jpg' },
    { id: 'md-streets-of-rage', nome: 'Streets of Rage', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/Streets_of_Rage.smd', capa: '/Streets_of_Rage.jpg' },
    { id: 'md-streets-of-rage2', nome: 'Streets of Rage 2', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/streetofrage2.smd', capa: '/streetofrage2.jpg' },
    { id: 'md-xmen2-clonewars', nome: 'X-Men 2: Clone Wars', console: 'MEGA DRIVE', core: 'genesis_plus_gx', gameUrl: '/xmen2clonewars.smd', capa: '/xmen2clonewars.jpg' },

    // NES
    { id: 'nes-contra', nome: 'Contra', console: 'NES', core: 'nestopia', gameUrl: '/contra.nes', capa: '/contra.jpg' },
    { id: 'nes-duck-hunt', nome: 'Duck Hunt', console: 'NES', core: 'nestopia', gameUrl: '/duck-hunt.nes', capa: '/duck-hunt.jpg' },

    // GBA
    { id: 'gba-zelda-minish-cap', nome: 'The Legend of Zelda: The Minish Cap', console: 'GBA', core: 'mgba', gameUrl: '/LegendOfZeldaTheMinishCap.gba', capa: '/zelda.jpg' },
    { id: 'gba-pokemon-fire-red', nome: 'Pokémon Fire Red', console: 'GBA', core: 'mgba', gameUrl: '/pokemon-fire-red.gba', capa: '/pokemon-fire-red.jpg' },

    // GAME BOY
    { id: 'gb-pokemon-silver', nome: 'Pokémon Silver', console: 'GAME BOY', core: 'gambatte', gameUrl: '/PokémonSilver.gbc', capa: '/pokemon-silver.jpg' },

    // N64
    { id: 'n64-super-mario-64', nome: 'Super Mario 64', console: 'NINTENDO 64', core: 'mupen64plus_next', gameUrl: '/Super_Mario_64.z64', capa: '/Super_Mario_64.jpg' },

    // ATARI
    { id: 'atari-asteroids', nome: 'Asteroids', console: 'ATARI', core: 'stella', gameUrl: '/asteroids.a26', capa: '/asteroids.jpg' }
  ];

  const jogarAleatorio = () => {
    if (jogos.length === 0) return;
    const indiceAleatorio = Math.floor(Math.random() * jogos.length);
    const jogoSorteado = jogos[indiceAleatorio];
    navigate(`/jogar/${jogoSorteado.id}`); 
  };

  const categorias = ['Todos', '❤️ Favoritos', 'SNES', 'MASTER SYSTEM', 'MEGA DRIVE', 'NES', 'GBA', 'GAME BOY', 'NINTENDO 64', 'ATARI'];

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

  const getIconeRank = (index) => {
    if (index === 0) return <Crown size={14} color="#fca311" fill="#fca311" />; 
    if (index === 1) return <Medal size={14} color="#C0C0C0" />;
    if (index === 2) return <Medal size={14} color="#CD7F32" />;
    return <span style={{ color: '#666', fontSize: '0.7rem', fontWeight: 'bold' }}>#{index + 1}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(to bottom, #121212, #1a1a2e)', fontFamily: '"Inter", sans-serif' }}>
      
      {/* HEADER FIXO */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '15px 30px', background: 'rgba(18, 18, 18, 0.95)', borderBottom: '1px solid #333', zIndex: 100, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
        {session ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000', padding: '6px 15px', borderRadius: '20px', border: '1px solid #fca311' }}>
                <Coins size={16} color="#fca311" />
                <span style={{ color: '#fca311', fontWeight: 'bold', fontSize: '0.9rem' }}>{pontos}</span>
            </div>
            <Link to="/perfil">
                <button style={{ background: '#252525', color: '#fff', border: '1px solid #666', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} /> {nomeUsuario || "Meu Perfil"}
                </button>
            </Link>
            <button onClick={handleLogout} style={{ background: '#333', color: '#ff4d4d', border: '1px solid #444', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                <LogOut size={16} />
            </button>
          </>
        ) : (
        <Link to="/login">
            <button style={{ background: 'linear-gradient(45deg, #fca311, #ffc300)', color: '#1a1a2e', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                <User size={16} /> ENTRAR
            </button>
        </Link>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px 40px 20px', width: '100%', flex: 1 }}>
        <header style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src="/logo.jpg" alt="Logo" style={{ maxWidth: '350px', width: '100%' }} />
              {/* RANKING LATERAL */}
              <div style={{ position: 'absolute', right: '-300px', top: '10px', width: '240px', background: 'rgba(30, 30, 30, 0.9)', border: '1px solid #444', borderRadius: '12px', padding: '15px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '5px', marginBottom: '8px' }}>
                      <span style={{ color: '#fca311', fontWeight: 'bold', fontSize: '0.85rem' }}>TOP 5</span>
                      <Link to="/ranking" style={{ fontSize: '0.7rem', color: '#888' }}>Ver tudo</Link>
                  </div>
                  {loadingRanking ? <span style={{color: '#666'}}>Carregando...</span> : ranking.map((user, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>{getIconeRank(idx)} <span>{user.nome || '---'}</span></div>
                        <span style={{ color: '#fca311' }}>{user.pontos}</span>
                    </div>
                  ))}
              </div>
          </div>

          {/* BUSCA E SORTEIO */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '600px', margin: '30px auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <Search color="#666" style={{ position: 'absolute', left: '15px', top: '12px' }} />
                <input type="text" placeholder="Busque por jogo..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '30px', border: '1px solid #333', background: '#1e1e1e', color: 'white' }} />
            </div>
            <button onClick={jogarAleatorio} style={{ background: 'linear-gradient(45deg, #ff00cc, #333399)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dices color="white" size={24} />
            </button>
          </div>

          {/* CATEGORIAS */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {categorias.map((cat) => (
              <button key={cat} onClick={() => setFiltroConsole(cat)} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: filtroConsole === cat ? '#fca311' : '#242424', color: filtroConsole === cat ? '#1a1a2e' : '#aaa', fontWeight: 'bold' }}>
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* GRID DE JOGOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
          {jogosFiltrados.map((jogo) => (
            <div key={jogo.id} style={{ background: '#242038', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #333', position: 'relative' }}>
              <button onClick={() => toggleFavorito(jogo.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', cursor: 'pointer', zIndex: 10, padding: '5px' }}>
                <Heart size={18} color={favoritos.includes(jogo.id) ? "#ff4d4d" : "white"} fill={favoritos.includes(jogo.id) ? "#ff4d4d" : "none"} />
              </button>
              <div style={{ height: '160px', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                  <img src={jogo.capa} alt={jogo.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '5px', height: '35px', overflow: 'hidden' }}>{jogo.nome}</h3>
              <span style={{ fontSize: '0.7rem', color: '#aaa', display: 'block', marginBottom: '10px' }}>{jogo.console}</span>
              <Link to={`/jogar/${jogo.id}`}>
                <button style={{ background: '#fca311', color: '#1a1a2e', border: 'none', padding: '8px 0', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>JOGAR</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #333', color: '#666' }}>
        <p>&copy; 2025 Sopra Fitas - {jogos.length} jogos disponíveis.</p>
      </footer>
    </div>
  );
};

export default Home;