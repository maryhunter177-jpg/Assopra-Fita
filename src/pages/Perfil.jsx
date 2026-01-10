import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Coins, Trophy, Shield } from 'lucide-react';

const Perfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [pontos, setPontos] = useState(0);
  const [role, setRole] = useState('user'); // Estado para guardar se é admin

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/login'); return; }

    const { data } = await supabase
      .from('profiles')
      .select('nome, pontos, role') // Buscando a role do banco
      .eq('id', session.user.id)
      .single();

    if (data) {
      setNome(data.nome || '');
      setPontos(data.pontos);
      setRole(data.role); // Define se é admin ou user
    }
    setLoading(false);
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <ArrowLeft size={20} /> Voltar para a Home
        </Link>

        <div style={{ background: '#1e1e1e', padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#fca311', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '2rem', color: '#1a1a2e', fontWeight: 'bold' }}>
              {nome ? nome[0].toUpperCase() : 'P'}
            </div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{nome || 'Player'}</h1>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{role === 'admin' ? '👑 Administrador' : '🎮 Jogador do Sopra Fitas'}</p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '30px 0' }}>
                <div style={statBox}><Coins color="#fca311" /><div style={{fontSize: '1.2rem'}}>{pontos}</div><small>Pontos</small></div>
                <Link to="/ranking" style={{textDecoration: 'none'}}><div style={statBox}><Trophy color="#00d4ff" /><div style={{fontSize: '1.2rem'}}>Ver</div><small>Ranking</small></div></Link>
            </div>

            {/* BOTÃO MÁGICO: Só aparece se role for admin */}
            {role === 'admin' && (
                <Link to="/admin-dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', padding: '15px', background: 'linear-gradient(45deg, #fca311, #ffc300)', border: 'none', borderRadius: '10px', color: '#1a1a2e', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Shield size={20} /> ACESSAR PAINEL GM
                    </button>
                </Link>
            )}

            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} placeholder="Nickname" />
            <button style={btnStyle}>Atualizar Nickname</button>
        </div>
      </div>
    </div>
  );
};

const statBox = { background: '#252525', padding: '15px', borderRadius: '12px', flex: 1, border: '1px solid #333' };
const inputStyle = { width: '100%', padding: '12px', background: '#252525', border: '1px solid #444', borderRadius: '8px', color: 'white', marginBottom: '15px' };
const btnStyle = { width: '100%', padding: '12px', background: 'transparent', border: '1px solid #fca311', borderRadius: '10px', color: '#fca311', fontWeight: 'bold', cursor: 'pointer' };

export default Perfil;