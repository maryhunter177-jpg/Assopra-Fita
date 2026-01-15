import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Emulator from '../components/Emulator';
import { supabase } from '../supabaseClient';
import { Calendar, Gamepad, ArrowRight, Download, Upload, RotateCcw, Maximize, Trophy, X, Loader2, Home, LogOut } from 'lucide-react';
import AnuncioLateral from '../components/AnuncioLateral'; 

const GameRoom = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [modalAberto, setModalAberto] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => window.removeEventListener('resize', handleResize);
  }, [gameId]);

  const salvarJogo = () => { if (window.EJS_player) window.EJS_player.saveState(); };
  const carregarJogo = () => { if (window.EJS_player) window.EJS_player.loadState(); }; 
  const reiniciarJogo = () => { if (window.EJS_player) window.EJS_player.restart(); };
  
  const telaCheia = () => {
    if (window.EJS_player) { try { window.EJS_player.maximize(); } catch (e) { } }
    const elem = document.getElementById('tela-do-jogo');
    if (elem) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    }
  };

  const sairDoJogo = () => {
    
    navigate('/'); // Volta para a Home
  };

  // --- BANCO DE DADOS COMPLETO COM CAPAS CORRIGIDAS (.jpg/png) ---
  const gamesDb = {
    // MASTER SYSTEM
    'sms-sonic': {
      id: 'sms-sonic',
      url: '/sonicthehedgehog.sms', 
      core: 'smsplus',
      nome: 'Sonic The Hedgehog',
      ano: '1991',
      fabricante: 'SEGA',
      capa: '/sonicthehedgehog.jpg', // Corrigido
      descricao: 'A estreia do ouriço mais rápido do mundo no Master System!'
    },
    'sms-alex-kidd': {
      id: 'sms-alex-kidd',
      url: '/alexkidd.sms',
      core: 'smsplus',
      nome: 'Alex Kidd in Miracle World',
      ano: '1986',
      fabricante: 'SEGA',
      capa: '/alexkidd.jpg',
      descricao: 'O maior clássico do Master System! Use o Jokenpô para vencer!'
    },

    // SNES
    'snes-aladdin': {
      id: 'snes-aladdin',
      url: '/aladdin.sfc',
      core: 'snes9x',
      nome: "Disney's Aladdin",
      ano: '1993',
      fabricante: 'Capcom',
      capa: '/aladdin.jpg',
      descricao: 'A versão clássica da Capcom baseada no filme da Disney.'
    },
    'snes-batman-forever': {
      id: 'snes-batman-forever',
      url: '/batman-forever.sfc',
      core: 'snes9x',
      nome: 'Batman Forever',
      ano: '1995',
      fabricante: 'Acclaim',
      capa: '/batman-forever.jpg',
      descricao: 'Batman enfrenta Two-Face e Arlequina no filme de 1995.'
    },
    'snes-battletoads': {
      id: 'snes-battletoads',
      url: '/battletoads.sfc',
      core: 'snes9x',
      nome: 'Battletoads',
      ano: '1994',
      fabricante: 'Rare',
      capa: '/battletoads.jpg',
      descricao: 'Rash, Zitz e Pimple enfrentam a Dark Queen!'
    },
    'snes-battletoads-dd': {
      id: 'snes-battletoads-dd',
      url: '/battletoads-double-dragon.sfc',
      core: 'snes9x',
      nome: 'Battletoads & Double Dragon',
      ano: '1993',
      fabricante: 'Rare/Technos',
      capa: '/battletoads-double-dragon.jpg',
      descricao: 'Toads e Double Dragon unem forças contra Shadow Boss!'
    },
    'snes-chrono-trigger': {
      id: 'snes-chrono-trigger',
      url: '/chrono-trigger.sfc',
      core: 'snes9x',
      nome: 'Chrono Trigger',
      ano: '1995',
      fabricante: 'Square',
      capa: '/chrono-trigger.jpg',
      descricao: 'Uma das maiores aventuras RPG de todos os tempos!'
    },
    'snes-contra3': {
      id: 'snes-contra3',
      url: '/contra-3.sfc',
      core: 'snes9x',
      nome: 'Contra III: The Alien Wars',
      ano: '1992',
      fabricante: 'Konami',
      capa: '/contra-3.jpg', // Corrigido
      descricao: 'A maior aventura dos Contra Brothers no futuro!'
    },
    'snes-dkc': {
      id: 'snes-dkc',
      url: '/dkc.sfc',
      core: 'snes9x',
      nome: 'Donkey Kong Country',
      ano: '1994',
      fabricante: 'Rare/Nintendo',
      capa: '/dkc.jpg', // Corrigido
      descricao: 'Donkey e Diddy em uma aventura revolucionária em 3D!'
    },
    'snes-earthworm-jim': {
      id: 'snes-earthworm-jim',
      url: '/earthworm-jim.sfc',
      core: 'snes9x',
      nome: 'Earthworm Jim',
      ano: '1994',
      fabricante: 'Shiny/Interplay',
      capa: '/earthworm-jim.jpg', // Corrigido
      descricao: 'O verme mais louco dos games com armas insanas!'
    },
    'snes-earthworm-jim2': {
      id: 'snes-earthworm-jim2',
      url: '/earthworm-jim-2.sfc',
      core: 'snes9x',
      nome: 'Earthworm Jim 2',
      ano: '1995',
      fabricante: 'Shiny/Interplay',
      capa: '/earthworm-jim-2.jpg', // Corrigido
      descricao: 'Ainda mais louco! Jim vira sujo e voador!'
    },
    'snes-fatal-fury2': {
      id: 'snes-fatal-fury2',
      url: '/fatal-fury-2.sfc',
      core: 'snes9x',
      nome: 'Fatal Fury 2',
      ano: '1992',
      fabricante: 'SNK',
      capa: '/fatal-fury-2.jpg', // Corrigido
      descricao: 'Terry Bogard e cia no torneio do Rei das Trevas!'
    },
    'snes-goof-troop': {
      id: 'snes-goof-troop',
      url: '/goof-troop.sfc',
      core: 'snes9x',
      nome: 'Goof Troop',
      ano: '1993',
      fabricante: 'Capcom/Disney',
      capa: '/goof-troop.jpg', // Corrigido
      descricao: 'Max e PJ salvam o Prefeito X com truques malucos!'
    },
    'snes-harvest-moon': {
      id: 'snes-harvest-moon',
      url: '/harvest-moon.sfc',
      core: 'snes9x',
      nome: 'Harvest Moon',
      ano: '1996',
      fabricante: 'Natsume',
      capa: '/harvest-moon.jpg', // Corrigido
      descricao: 'Reconstrua a fazenda e encontre o amor verdadeiro!'
    },
    'snes-kirbys-avalanche': {
      id: 'snes-kirbys-avalanche',
      url: '/kirbys-avalanche.sfc',
      core: 'snes9x',
      nome: "Kirby's Avalanche",
      ano: '1995',
      fabricante: 'HAL',
      capa: '/kirbys-avalanche.jpg', // Corrigido
      descricao: 'Kirby no puzzle game estilo Puyo Puyo!'
    },
    'snes-kirby-super-star': {
      id: 'snes-kirby-super-star',
      url: '/kirby-super-star.sfc',
      core: 'snes9x',
      nome: 'Kirby Super Star',
      ano: '1996',
      fabricante: 'HAL/Nintendo',
      capa: '/kirby-super-star.jpg', // Corrigido
      descricao: 'Múltiplas aventuras do Kirby rosa e faminto!'
    },
    'snes-megaman-x': {
      id: 'snes-megaman-x',
      url: '/megaman-x.sfc',
      core: 'snes9x',
      nome: 'Mega Man X',
      ano: '1993',
      fabricante: 'Capcom',
      capa: '/megaman-x.jpg', // Corrigido
      descricao: 'O futuro dos Mavericks começa aqui com X!'
    },
    'snes-megaman-x2': {
      id: 'snes-megaman-x2',
      url: '/megaman-x2.sfc',
      core: 'snes9x',
      nome: 'Mega Man X2',
      ano: '1994',
      fabricante: 'Capcom',
      capa: '/megaman-x2.jpg', // Corrigido
      descricao: 'Wire Sponge, Wheel Gator e mais 6 Mavericks!'
    },
    'snes-megaman-x3': {
      id: 'snes-megaman-x3',
      url: '/megaman-x3.sfc',
      core: 'snes9x',
      nome: 'Mega Man X3',
      ano: '1995',
      fabricante: 'Capcom',
      capa: '/megaman-x3.jpg', // Corrigido
      descricao: 'O último grande X do SNES com escolhas morais!'
    },
    'snes-mk2': {
      id: 'snes-mk2',
      url: '/mortal-kombat-2.sfc',
      core: 'snes9x',
      nome: 'Mortal Kombat 2',
      ano: '1994',
      fabricante: 'Midway',
      capa: '/mortal-kombat-2.jpg', // Corrigido
      descricao: 'O melhor MK2 com fatalities insanos!'
    },
    'snes-rrr': {
      id: 'snes-rrr',
      url: '/rrr.sfc',
      core: 'snes9x',
      nome: "Rock n' Roll Racing",
      ano: '1993',
      fabricante: 'Blizzard',
      capa: '/rrr.jpg', // Corrigido
      descricao: 'Acelere ao som de rock em corridas intergalácticas!'
    },
    'snes-sf2-turbo': {
      id: 'snes-sf2-turbo',
      url: '/sf2-turbo.sfc',
      core: 'snes9x',
      nome: 'Street Fighter II Turbo',
      ano: '1993',
      fabricante: 'Capcom',
      capa: '/sf2-turbo.jpg', // Corrigido
      descricao: 'A versão mais rápida e equilibrada do clássico!'
    },
    'snes-supermarioworld': {
      id: 'snes-supermarioworld',
      url: '/supermarioworld.sfc',
      core: 'snes9x',
      nome: 'Super Mario World',
      ano: '1990',
      fabricante: 'Nintendo',
      capa: '/supermarioworld.jpg', // Corrigido
      descricao: 'O clássico absoluto que definiu o SNES!'
    },
    'snes-topgear': {
      id: 'snes-topgear',
      url: '/topgear.smc',
      core: 'snes9x',
      nome: 'Top Gear',
      ano: '1992',
      fabricante: 'Kemco/Gremlin',
      capa: '/Capa_de_Top_Gear.jpg',
      descricao: 'O jogo de corrida mais amado do Brasil!'
    },
    'snes-zelda-lttp': {
      id: 'snes-zelda-lttp',
      url: '/zelda-link-to-the-past.sfc',
      core: 'snes9x',
      nome: 'The Legend of Zelda: A Link to the Past',
      ano: '1991',
      fabricante: 'Nintendo',
      capa: '/zelda-link-to-the-past.jpg', // Corrigido
      descricao: 'A maior aventura de Link no mundo paralelo!'
    },

    // MEGA DRIVE
    'md-goldenaxe': {
      id: 'md-goldenaxe',
      url: '/goldenaxe.smd',
      core: 'genesis_plus_gx',
      nome: 'Golden Axe',
      ano: '1989',
      fabricante: 'SEGA',
      capa: '/goldenaxe.jpg',
      descricao: 'Ax Battler, Gilius e Tyris Flare contra Death Adder!'
    },
    'md-goldenaxe2': {
      id: 'md-goldenaxe2',
      url: '/goldenaxe2.smd',
      core: 'genesis_plus_gx',
      nome: 'Golden Axe II',
      ano: '1991',
      fabricante: 'SEGA',
      capa: '/goldenaxe2.jpg',
      descricao: 'Dark Guld ameaça o mundo novamente!'
    },
    'md-mk3': {
      id: 'md-mk3',
      url: '/MortalKombat3.smd',
      core: 'genesis_plus_gx',
      nome: 'Mortal Kombat 3',
      ano: '1995',
      fabricante: 'Midway',
      capa: '/ultimate-mortal-kombat-3-capa.webp',
      descricao: 'Shao Kahn invade a Terra! Novos fatalities!'
    },
    'md-show-do-milhao': {
      id: 'md-show-do-milhao',
      url: '/show-do-milhao.smd',
      core: 'genesis_plus_gx',
      nome: 'Show do Milhão',
      ano: '1993',
      fabricante: 'Silmar',
      capa: '/show-do-milhao.jpg', // Corrigido
      descricao: 'Silvio Santos te desafia no quiz brasileiro!'
    },
    'md-sonic2': {
      id: 'md-sonic2',
      url: '/sonicthehedgehog2.smd',
      core: 'genesis_plus_gx',
      nome: 'Sonic The Hedgehog 2',
      ano: '1992',
      fabricante: 'SEGA',
      capa: '/sonicthehedgehog2.jpg', // Corrigido
      descricao: 'Sonic e Tails contra Robotnik em 8 zonas épicas!'
    },
    'md-streets-of-rage': {
      id: 'md-streets-of-rage',
      url: '/Streets_of_Rage.smd',
      core: 'genesis_plus_gx',
      nome: 'Streets of Rage',
      ano: '1991',
      fabricante: 'SEGA',
      capa: '/Streets_of_Rage.jpg',
      descricao: 'Axel, Adam e Blaze limpam as ruas!'
    },
    'md-streets-of-rage2': {
      id: 'md-streets-of-rage2',
      url: '/streetofrage2.smd',
      core: 'genesis_plus_gx',
      nome: 'Streets of Rage 2',
      ano: '1992',
      fabricante: 'SEGA',
      capa: '/streetofrage2.jpg',
      descricao: 'Mr. X clonou a gangue! Skate Hunter se junta!'
    },
    'md-xmen2-clonewars': {
      id: 'md-xmen2-clonewars',
      url: '/xmen2clonewars.smd',
      core: 'genesis_plus_gx',
      nome: 'X-Men 2: Clone Wars',
      ano: '1995',
      fabricante: 'Konami',
      capa: '/xmen2clonewars.jpg', // Corrigido
      descricao: 'Magneto e Apocalypse liberam clones mutantes!'
    },

    // NES
    'nes-contra': {
      id: 'nes-contra',
      url: '/contra.nes',
      core: 'nestopia',
      nome: 'Contra',
      ano: '1987',
      fabricante: 'Konami',
      capa: '/contra.jpg',
      descricao: 'Bill Rizer e Lance Bean contra os aliens!'
    },
    'nes-duck-hunt': {
      id: 'nes-duck-hunt',
      url: '/duck-hunt.nes',
      core: 'nestopia',
      nome: 'Duck Hunt',
      ano: '1984',
      fabricante: 'Nintendo',
      capa: '/duck-hunt.jpg', // Corrigido
      descricao: 'O cão zoeiro e sua Zapper na caça aos patos!'
    },

    // GBA
    'gba-zelda-minish-cap': {
      id: 'gba-zelda-minish-cap',
      url: '/LegendOfZeldaTheMinishCap.gba',
      core: 'mgba',
      nome: 'The Legend of Zelda: The Minish Cap',
      ano: '2004',
      fabricante: 'Capcom/Nintendo',
      capa: '/zelda.jpg',
      descricao: 'Link encolhe com Ezlo para salvar Hyrule!'
    },
    'gba-pokemon-fire-red': {
      id: 'gba-pokemon-fire-red',
      url: '/pokemon-fire-red.gba',
      core: 'mgba',
      nome: 'Pokémon Fire Red',
      ano: '2004',
      fabricante: 'Game Freak',
      capa: '/pokemon-fire-red.jpg', // Corrigido
      descricao: 'Kanto em 3D com Pokémon até a Geração III!'
    },

    // GAME BOY
    'gb-pokemon-silver': {
      id: 'gb-pokemon-silver',
      url: '/PokémonSilver.gbc',
      core: 'gambatte',
      nome: 'Pokémon Silver',
      ano: '1999',
      fabricante: 'Game Freak',
      capa: '/pokemon-silver.jpg',
      descricao: 'Gold e Silver na região de Johto e Kanto!'
    },

    // N64
    'n64-super-mario-64': {
      id: 'n64-super-mario-64',
      url: '/Super_Mario_64.z64',
      core: 'mupen64plus_next',
      nome: 'Super Mario 64',
      ano: '1996',
      fabricante: 'Nintendo',
      capa: '/Super_Mario_64.jpg',
      descricao: 'A revolução 3D que mudou os games para sempre!'
    },

    // ATARI
    'atari-asteroids': {
      id: 'atari-asteroids',
      url: '/asteroids.a26',
      core: 'stella',
      nome: 'Asteroids',
      ano: '1979',
      fabricante: 'Atari',
      capa: '/asteroids.jpg',
      descricao: 'O clássico arcade que definiu os shoot em up!'
    }
  };

  const jogoAtual = gamesDb[gameId];
  const outrosJogos = Object.values(gamesDb).filter(jogo => jogo.id !== gameId);
  const relacionados = outrosJogos.sort(() => 0.5 - Math.random()).slice(0, 2);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!arquivo) return alert("Selecione um print primeiro!");
    if (!session) return alert("Você precisa estar logado!");

    setUploading(true);
    try {
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('prints').upload(fileName, arquivo);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('prints').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('missoes').insert({
          user_id: session.user.id,
          game_id: gameId,
          game_nome: jogoAtual.nome,
          print_url: publicUrl,
          status: 'pendente'
        });

      if (dbError) throw dbError;

      alert("Missão enviada! 🚀 O GM analisará seu print.");
      setModalAberto(false);
      setArquivo(null);

    } catch (error) {
      alert("Erro ao enviar: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh', background: '#121212', color: 'white', fontFamily: '"Inter", sans-serif', justifyContent: 'center' }}>
      
      <aside style={{ width: isMobile ? '100%' : '300px', background: '#1e1e1e', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: isMobile ? 'none' : '1px solid #333', borderBottom: isMobile ? '1px solid #333' : 'none', order: isMobile ? 3 : 1 }}>
        <h4 style={{ color: '#555', marginBottom: '10px' }}>Publicidade</h4>
        <AnuncioLateral adKey="658f27ccb9910421c7c8e05c3a696689" width={300} height={250} />
      </aside>

      <main style={{ flex: 1, minWidth: '320px', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', position: 'relative', order: 2 }}>
        
        {jogoAtual ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
           <div id="tela-do-jogo" style={{ width: '100%', aspectRatio: '4/3', background: 'black', boxShadow: '0 0 50px rgba(0,0,0,0.8)', borderRadius: '10px 10px 0 0', overflow: 'hidden', border: '2px solid #333', borderBottom: 'none' }}>
            <Emulator gameUrl={jogoAtual.url} core={jogoAtual.core} />
           </div>

           <div style={{ width: '100%', background: '#252525', padding: '10px', borderRadius: '0 0 10px 10px', border: '2px solid #333', borderTop: '1px solid #444', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* BOTÃO DE SAIR ADICIONADO AQUI */}
            <button onClick={sairDoJogo} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#7f1d1d', color: 'white', border: '1px solid #991b1b', padding: '8px 12px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}><Home size={16} /> Sair</button>
            <div style={{ width: '1px', background: '#444', margin: '0 5px' }}></div> {/* Separador Visual */}
            
            <button onClick={salvarJogo} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#333', color: 'white', border: '1px solid #555', padding: '8px 12px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' }}><Download size={16} /> Salvar</button>
            <button onClick={carregarJogo} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#333', color: 'white', border: '1px solid #555', padding: '8px 12px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' }}><Upload size={16} /> Carregar</button>
            <button onClick={reiniciarJogo} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#333', color: 'white', border: '1px solid #555', padding: '8px 12px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' }}><RotateCcw size={16} /> Reiniciar</button>
            <button onClick={telaCheia} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fbbf24', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}><Maximize size={16} /> Tela Cheia</button>
           </div>

           <div style={{ width: '100%', textAlign: 'left', padding: '20px', background: '#1e1e1e', borderRadius: '10px', border: '1px solid #333' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{jogoAtual.nome}</h1>
                  <div style={{ display: 'flex', gap: '15px', color: '#888', marginBottom: '15px', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {jogoAtual.ano}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Gamepad size={14} /> {jogoAtual.fabricante}</span>
                  </div>
                  <p style={{ color: '#ccc', lineHeight: '1.6' }}>{jogoAtual.descricao}</p>
                </div>
                
                <div style={{ background: '#252525', padding: '20px', borderRadius: '10px', border: '1px solid #333', width: isMobile ? '100%' : '300px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: '#fbbf24' }}><Trophy size={20} /> Missão de Jogo</h3>
                  <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>Tire um print da sua maior pontuação ou do final do jogo e nos envie!</p>
                  <button onClick={() => setModalAberto(true)} style={{ width: '100%', background: '#fbbf24', color: '#000', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Print</button>
                </div>
             </div>
           </div>

           <div style={{ width: '100%', marginTop: '30px', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '20px', color: '#888', display: 'flex', alignItems: 'center', gap: '10px' }}><ArrowRight size={20} /> Jogos Relacionados</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                {relacionados.map(jogo => (
                  <Link key={jogo.id} to={`/jogar/${jogo.id}`} style={{ textDecoration: 'none', color: 'white', background: '#1e1e1e', padding: '10px', borderRadius: '8px', border: '1px solid #333', transition: '0.3s' }}>
                    {/* Imagem da capa agora com extensão correta */}
                    <img src={jogo.capa} alt={jogo.nome} style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>{jogo.nome}</span>
                  </Link>
                ))}
              </div>
           </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Loader2 size={40} className="animate-spin" style={{ color: '#fbbf24', marginBottom: '10px' }} />
            <p>Carregando jogo...</p>
          </div>
        )}
      </main>

      <aside style={{ width: isMobile ? '100%' : '300px', background: '#1e1e1e', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: isMobile ? 'none' : '1px solid #333', borderTop: isMobile ? '1px solid #333' : 'none', order: 4 }}>
        <h4 style={{ color: '#555', marginBottom: '10px' }}>Publicidade</h4>
        <AnuncioLateral adKey="658f27ccb9910421c7c8e05c3a696689" width={300} height={250} />
      </aside>

      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '15px', maxWidth: '400px', width: '100%', border: '1px solid #333', position: 'relative' }}>
            <button onClick={() => setModalAberto(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Trophy style={{ color: '#fbbf24' }} /> Enviar Missão</h2>
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888', fontSize: '0.9rem' }}>Selecione o print da tela:</label>
                <input type="file" accept="image/*" onChange={(e) => setArquivo(e.target.files[0])} style={{ width: '100%', color: '#888' }} />
              </div>
              <button type="submit" disabled={uploading} style={{ width: '100%', background: uploading ? '#444' : '#fbbf24', color: '#000', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                {uploading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'Confirmar Envio'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;