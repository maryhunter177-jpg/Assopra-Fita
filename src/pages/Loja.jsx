import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ShoppingBag, ExternalLink, ArrowLeft, AlertCircle } from 'lucide-react';

const Loja = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('loja_shopee')
          .select('id, nome, descricao, preco, imagem_url, link_afiliado, categoria, created_at')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setProdutos(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  return (
    <div style={{ 
      padding: '40px 20px', 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #121212, #1a1a2e)', 
      color: 'white', 
      fontFamily: 'sans-serif' 
    }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto 30px auto' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            color: '#fca311', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            fontSize: '0.95rem',
            padding: '10px 20px',
            borderRadius: '12px',
            border: '2px solid #fca311',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fca311';
            e.currentTarget.style.color = '#1a1a2e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#fca311';
          }}
        >
          <ArrowLeft size={20} /> VOLTAR PARA A HOME
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          color: '#fca311', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '15px', 
          fontSize: '2.8rem',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          <ShoppingBag size={48} /> LOJA GAMER AFILIADA
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '10px' }}>
          Produtos selecionados a dedo pela Mary para o seu setup!
        </p>

        <div style={{ 
          maxWidth: '700px',
          margin: '25px auto 0 auto',
          background: 'rgba(252, 163, 17, 0.1)', 
          border: '1px solid rgba(252, 163, 17, 0.4)', 
          padding: '15px 25px', 
          borderRadius: '15px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          color: '#fca311',
          lineHeight: '1.4'
        }}>
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '0.95rem', textAlign: 'left' }}>
            <strong>Transparência:</strong> Ao clicar nos botões abaixo, você será redirecionado para o site oficial da <strong>Shopee</strong> para finalizar sua compra com total segurança.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#fca311' }}>Carregando ofertas...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '30px', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          {produtos.map((p) => (
            <div 
              key={p.id} 
              style={{ 
                background: '#242038', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                border: '1px solid #3d346d', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '100%', height: '250px', overflow: 'hidden', background: '#fff' }}>
                <img 
                  src={p.imagem_url} 
                  alt={p.nome} 
                  referrerPolicy="no-referrer" // ESSENCIAL PARA LINKS DA SHOPEE
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Imagem+indisponível'; }}
                />
              </div>

              <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#fff', fontWeight: 'bold' }}>
                  {p.nome}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#bbb', marginBottom: '20px', flex: 1, lineHeight: '1.5' }}>
                  {p.descricao}
                </p>
                
                <div style={{ 
                  fontSize: '1.6rem', 
                  fontWeight: '800', 
                  color: '#fca311', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '5px'
                }}>
                  <span style={{ fontSize: '1rem' }}>R$</span> {p.preco}
                </div>

                <a 
                  href={p.link_afiliado} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    background: '#fca311', 
                    color: '#1a1a2e', 
                    textDecoration: 'none', 
                    padding: '15px', 
                    borderRadius: '10px', 
                    textAlign: 'center', 
                    fontWeight: '900', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 0 #b37400'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  COMPRAR NA SHOPEE <ExternalLink size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer style={{ textAlign: 'center', marginTop: '80px', paddingBottom: '40px', color: '#555' }}>
        <p>© 2025 Sopra Fitas - Link de Afiliado Shopee</p>
      </footer>
    </div>
  );
};

export default Loja;