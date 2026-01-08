import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Shield, Coins, Crown, Trophy } from 'lucide-react'; // <--- ADICIONEI OS ÍCONES NOVOS AQUI

const Perfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Dados do usuário
  const [session, setSession] = useState(null);
  const [nome, setNome] = useState('');
  const [pontos, setPontos] = useState(0);
  const [role, setRole] = useState('user');

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    // 1. Pega quem está logado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/login'); // Se não tiver logado, chuta pro login
      return;
    }

    setSession(session);

    // 2. Busca os dados na tabela profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setNome(data.nome || ''); // Se não tiver nome, deixa vazio
      setPontos(data.pontos);
      setRole(data.role);
    }
    setLoading(false);
  };

  const atualizarPerfil = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ nome: nome }) // Atualiza só o nome
      .eq('id', session.user.id);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Perfil atualizado com sucesso! ✨');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Carregando ficha técnica...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #121212, #1a1a2e)', fontFamily: '"Inter", sans-serif', color: 'white', padding: '20px' }}>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', textDecoration: 'none', marginBottom: '30px' }}>
          <ArrowLeft size={20} /> Voltar para a Home
        </Link>

        <div style={{ background: '#1e1e1e', padding: '40px', borderRadius: '20px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', background: '#fca311', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '2rem', color: '#1a1a2e', fontWeight: 'bold' }}>
              {nome ? nome[0].toUpperCase() : session.user.email[0].toUpperCase()}
            </div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{nome || 'Player Sem Nome'}</h1>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{role === 'admin' ? '👑 Administrador' : '🎮 Jogador'}</p>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{ background: '#252525', padding: '15px 25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #333' }}>
              <Coins color="#fca311" size={24} style={{ marginBottom: '5px' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fca311' }}>{pontos}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Pontos</div>
            </div>
            <div style={{ background: '#252525', padding: '15px 25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #333' }}>
              <Shield color="#00d4ff" size={24} style={{ marginBottom: '5px' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4ff' }}>{role === 'admin' ? 'GM' : '1'}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Nível</div>
            </div>
          </div>

          <form onSubmit={atualizarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Email (Não alterável)</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#121212', padding: '12px', borderRadius: '8px', border: '1px solid #333', color: '#666' }}>
                <Mail size={18} style={{ marginRight: '10px' }} />
                {session.user.email}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontSize: '0.9rem' }}>Nome de Exibição / Nickname</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: '#888' }} />
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como você quer ser chamado?"
                  style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#252525', border: '1px solid #444', borderRadius: '8px', color: 'white', outline: 'none' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              style={{ background: 'linear-gradient(45deg, #fca311, #ffc300)', border: 'none', padding: '15px', borderRadius: '10px', color: '#1a1a2e', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}
            >
              {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
            </button>
          </form>

          {/* --- AQUI ESTAVA FALTANDO! O PAINEL DE ADMIN --- */}
          {role === 'admin' && (
            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #333' }}>
              <h3 style={{ color: '#fca311', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Crown size={20} /> Painel do Game Master
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <Link to="/ranking" style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', padding: '15px', background: '#252525', border: '1px solid #444', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: '0.2s' }}>
                        <Trophy size={24} color="#fca311" />
                        <span>Ver Ranking Global</span>
                    </button>
                </Link>

                <button onClick={() => alert('Em breve: Aprovar Prints dos Jogadores!')} style={{ width: '100%', padding: '15px', background: '#252525', border: '1px solid #444', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', opacity: 0.7 }}>
                    <Shield size={24} color="#00d4ff" />
                    <span>Aprovar Missões (Em Breve)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Perfil;