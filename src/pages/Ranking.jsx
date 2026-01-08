import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Crown, Medal } from 'lucide-react';

const Ranking = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    // Busca id, nome e pontos, ordena por pontos (do maior pro menor) e pega os top 50
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, email, pontos')
      .order('pontos', { ascending: false })
      .limit(50);

    if (error) console.error('Erro ao buscar ranking:', error);
    else setUsuarios(data);
    
    setLoading(false);
  };

  // Função para dar ícone aos top 3
  const getIcone = (index) => {
    if (index === 0) return <Crown size={24} color="#fca311" fill="#fca311" />; // 1º Lugar (Ouro)
    if (index === 1) return <Medal size={24} color="#C0C0C0" />; // 2º Lugar (Prata)
    if (index === 2) return <Medal size={24} color="#CD7F32" />; // 3º Lugar (Bronze)
    return <span style={{ fontWeight: 'bold', color: '#666' }}>#{index + 1}</span>;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #121212, #1a1a2e)', fontFamily: '"Inter", sans-serif', padding: '20px', color: 'white' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', textDecoration: 'none', marginBottom: '30px' }}>
          <ArrowLeft size={20} /> Voltar para a Home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Trophy size={60} color="#fca311" style={{ marginBottom: '15px', filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.5))' }} />
            <h1 style={{ fontSize: '2.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Ranking Global</h1>
            <p style={{ color: '#aaa' }}>Os maiores sopradores de fita da história</p>
        </div>

        <div style={{ background: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            
            {/* Cabeçalho da Tabela */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', padding: '15px 20px', background: '#252525', borderBottom: '1px solid #333', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                <div>Posição</div>
                <div>Jogador</div>
                <div style={{ textAlign: 'right' }}>Pontos</div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Carregando os campeões...</div>
            ) : (
                usuarios.map((user, index) => (
                    <div key={user.id} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 3fr 1fr', 
                        padding: '20px', 
                        borderBottom: '1px solid #2a2a2a', 
                        alignItems: 'center',
                        background: index === 0 ? 'linear-gradient(90deg, rgba(252, 163, 17, 0.1), transparent)' : 'transparent' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getIcone(index)}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: index === 0 ? '#fca311' : '#fff' }}>
                                {user.nome || 'Player Sem Nome'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#555' }}>
                                {user.email.split('@')[0]}
                            </span>
                        </div>

                        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#fca311', fontFamily: 'monospace' }}>
                            {user.pontos} XP
                        </div>
                    </div>
                ))
            )}

            {usuarios.length === 0 && !loading && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    Ninguém pontuou ainda. Seja o primeiro!
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Ranking;