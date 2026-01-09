import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Gamepad2, User, Lock, ArrowLeft, Info, Loader2, Mail, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // false = Tela de Login (Padrão) | true = Tela de Cadastro
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- LÓGICA DE CADASTRO ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("🎉 Conta criada! O link de confirmação foi enviado para o seu e-mail (verifique o Spam).");
        setIsSignUp(false); // Volta para login após cadastrar
      } else {
        // --- LÓGICA DE LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #121212, #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif', padding: '20px' }}>
      
      <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '20px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative' }}>
        
        {/* Botão Voltar */}
        <Link to="/" style={{ position: 'absolute', top: '20px', left: '20px', color: '#aaa', cursor: 'pointer' }}>
            <ArrowLeft size={24} />
        </Link>

        {/* Ícone Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <div style={{ background: 'linear-gradient(45deg, #fca311, #ffc300)', padding: '12px', borderRadius: '50%', boxShadow: '0 0 15px rgba(255, 165, 0, 0.4)' }}>
                <Gamepad2 size={32} color="#1a1a2e" />
            </div>
        </div>

        <h2 style={{ color: '#fff', marginBottom: '5px', fontSize: '1.5rem' }}>Sopra Fitas</h2>
        <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>
            {isSignUp ? 'Crie sua conta e salve o progresso!' : 'Faça login para continuar jogando.'}
        </p>

        {/* --- CAIXA DE INSTRUÇÕES (SEMPRE VISÍVEL) --- */}
        <div style={{
            background: 'rgba(252, 163, 17, 0.1)',
            border: '1px solid #fca311',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            textAlign: 'left'
        }}>
            <h4 style={{ color: '#fca311', margin: '0 0 8px 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isSignUp ? <Info size={16} /> : <CheckCircle2 size={16} />}
                {isSignUp ? 'Passo a Passo:' : 'Dica Importante:'}
            </h4>
            
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', fontSize: '0.75rem', lineHeight: '1.4' }}>
                {isSignUp ? (
                    // Texto do Modo Cadastro (ATUALIZADO)
                    <>
                        <li>Use um <strong>e-mail válido</strong> (você receberá um link do <strong>Supabase</strong>).</li>
                        <li>Senha deve ter no mínimo <strong>6 dígitos</strong>.</li>
                        <li>Depois de cadastrar, <strong>confirme no seu e-mail</strong>.</li>
                        <li style={{color: '#fff', marginTop: '4px'}}>⚠️ Sem confirmar o e-mail, o login não funciona!</li>
                    </>
                ) : (
                    // Texto do Modo Login
                    <>
                        <li>Para salvar seus jogos na nuvem, você precisa logar.</li>
                        <li>Ainda não tem conta? Clique em "Criar Conta Agora".</li>
                        <li>Não recebeu o e-mail do Supabase? Olhe sua caixa de Spam.</li>
                    </>
                )}
            </ul>
        </div>

        {/* --- FORMULÁRIO --- */}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#666" style={{ position: 'absolute', left: '15px', top: '13px' }} />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #333', background: '#252525', color: 'white', outline: 'none', fontSize: '0.95rem' }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#666" style={{ position: 'absolute', left: '15px', top: '13px' }} />
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #333', background: '#252525', color: 'white', outline: 'none', fontSize: '0.95rem' }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
                padding: '12px', 
                borderRadius: '10px', 
                border: 'none', 
                background: 'linear-gradient(45deg, #fca311, #ffc300)', 
                color: '#1a1a2e', 
                fontWeight: 'bold', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                marginTop: '8px', 
                fontSize: '0.95rem', 
                transition: 'transform 0.2s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isSignUp ? 'CADASTRAR GRÁTIS' : 'ENTRAR')}
          </button>
        </form>

        <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '10px' }}>
            {isSignUp ? 'Já criou sua conta?' : 'Primeira vez no Sopra Fitas?'}
          </p>
          <button 
            onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
            }}
            disabled={loading}
            style={{ 
                background: 'transparent', 
                border: '1px solid #555', 
                color: '#ddd', 
                padding: '8px 20px', 
                borderRadius: '20px', 
                cursor: 'pointer', 
                fontSize: '0.85rem',
                transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.borderColor = '#fca311'}
            onMouseOut={(e) => e.target.style.borderColor = '#555'}
          >
            {isSignUp ? 'Fazer Login' : 'Criar Conta Agora'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;