import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, PlusCircle, Trash2, Edit, Save, XCircle, Upload, Image as ImageIcon } from 'lucide-react';

const AdminLoja = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [linkAfiliado, setLinkAfiliado] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const { data, error } = await supabase
      .from('loja_shopee')
      .select('id, nome, descricao, preco, imagem_url, link_afiliado, categoria, created_at')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Erro ao buscar:", error);
    if (data) setProdutos(data);
  };

  const handleUploadImagem = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('imagens_loja')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('imagens_loja')
        .getPublicUrl(fileName);

      if (urlData) {
        setImagemUrl(urlData.publicUrl);
      }
    } catch (error) {
      alert('Erro crítico no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    const dados = { 
      nome, 
      descricao, 
      preco, 
      imagem_url: imagemUrl, 
      link_afiliado: linkAfiliado 
    };

    if (editandoId) {
      const { error } = await supabase.from('loja_shopee').update(dados).eq('id', editandoId);
      if (!error) {
        alert('Produto atualizado!');
        cancelarEdicao();
      }
    } else {
      const { error } = await supabase.from('loja_shopee').insert([dados]);
      if (!error) {
        alert('Produto adicionado!');
        limparCampos();
      }
    }
    fetchProdutos();
  };

  const prepararEdicao = (p) => {
    setEditandoId(p.id);
    setNome(p.nome);
    setDescricao(p.descricao);
    setPreco(p.preco);
    setImagemUrl(p.imagem_url);
    setLinkAfiliado(p.link_afiliado);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    limparCampos();
  };

  const limparCampos = () => {
    setNome(''); setDescricao(''); setPreco(''); setImagemUrl(''); setLinkAfiliado('');
  };

  const deletarProduto = async (id) => {
    if (window.confirm('Tem certeza?')) {
      await supabase.from('loja_shopee').delete().eq('id', id);
      fetchProdutos();
    }
  };

  return (
    <div style={{ padding: '40px', background: '#121212', minHeight: '100vh', color: 'white' }}>
      <Link to="/admin-dashboard" style={{ color: '#fca311', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '20px' }}>
        <ArrowLeft size={20} /> Voltar ao Painel do GM
      </Link>
      
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#fca311' }}>
        <ShoppingBag size={32} /> Gerenciar Loja Shopee
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', marginTop: '30px' }}>
        
        <form onSubmit={handleSalvar} style={{ background: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '20px', color: '#fca311' }}>{editandoId ? '🔧 Editar Produto' : '✨ Novo Produto'}</h3>
          
          <input type="text" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{...inputStyle, height: '100px'}} />
          <input type="text" placeholder="Preço (Ex: 49,90)" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} />
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#fca311', fontWeight: 'bold' }}>Imagem do Produto</label>
            
            <input 
              type="text" 
              placeholder="Cole o link da imagem da Shopee aqui..." 
              value={imagemUrl} 
              onChange={(e) => setImagemUrl(e.target.value)} 
              style={{...inputStyle, marginBottom: '10px'}} 
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <label style={uploadButtonStyle}>
                <Upload size={20} /> {uploading ? 'Enviando...' : 'Ou faça Upload'}
                <input type="file" accept="image/*" onChange={handleUploadImagem} style={{ display: 'none' }} disabled={uploading} />
              </label>
              
              {imagemUrl && (
                <div style={{ position: 'relative' }}>
                  <img src={imagemUrl} alt="Preview" referrerPolicy="no-referrer" style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px solid #fca311', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <input type="text" placeholder="Link de Afiliado Shopee" value={linkAfiliado} onChange={(e) => setLinkAfiliado(e.target.value)} required style={inputStyle} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={saveButtonStyle}>
              {editandoId ? <Save size={20} /> : <PlusCircle size={20} />} {editandoId ? 'ATUALIZAR' : 'CADASTRAR PRODUTO'}
            </button>
            {editandoId && (
              <button type="button" onClick={cancelarEdicao} style={{ padding: '12px', background: '#444', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}><XCircle size={20} /></button>
            )}
          </div>
        </form>

        <div style={{ background: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #333', maxHeight: '80vh', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '15px' }}>Produtos Ativos ({produtos.length})</h3>
          {produtos.map(p => (
            <div key={p.id} style={cardStyle}>
              <img src={p.imagem_url} referrerPolicy="no-referrer" style={miniImageStyle} alt="" onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=X'; }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{p.nome}</div>
                <div style={{ color: '#fca311', fontWeight: 'bold' }}>R$ {p.preco}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => prepararEdicao(p)} style={actionButtonStyle} title="Editar"><Edit size={18} color="#fca311" /></button>
                <button onClick={() => deletarProduto(p.id)} style={actionButtonStyle} title="Excluir"><Trash2 size={18} color="#ff4d4d" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ESTILOS (IGUAIS AOS SEUS)
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', background: '#000', color: 'white', boxSizing: 'border-box' };
const uploadButtonStyle = { flex: 1, background: '#000', border: '1px dashed #fca311', padding: '15px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#fca311' };
const saveButtonStyle = { flex: 1, padding: '15px', background: '#fca311', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', color: '#000' };
const cardStyle = { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#121212', borderRadius: '10px', marginBottom: '10px', border: '1px solid #333' };
const miniImageStyle = { width: '55px', height: '55px', objectFit: 'cover', borderRadius: '6px', background: '#000' };
const actionButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };

export default AdminLoja;