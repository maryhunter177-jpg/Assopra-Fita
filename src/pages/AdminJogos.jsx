import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
// Importamos o ArrowLeft para o ícone de voltar
import { Gamepad2, Upload, PlusCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'; 
import { Link } from 'react-router-dom'; 

const AdminJogos = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    
    // Estados do Formulário
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [core, setCore] = useState('snes');
    const [ano, setAno] = useState('');
    const [fabricante, setFabricante] = useState('');
    const [descricao, setDescricao] = useState('');
    
    // Estados dos Arquivos
    const [capaFile, setCapaFile] = useState(null);
    const [romFile, setRomFile] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Enviando arquivos...');

        try {
            // 1. Upload da Capa
            const capaExt = capaFile.name.split('.').pop();
            const capaPath = `${id}-capa.${capaExt}`;
            const { data: capaData, error: capaError } = await supabase.storage
                .from('capas')
                .upload(capaPath, capaFile, { upsert: true });
            
            if (capaError) throw capaError;
            const capaUrl = supabase.storage.from('capas').getPublicUrl(capaPath).data.publicUrl;

            // 2. Upload da ROM
            const romExt = romFile.name.split('.').pop();
            const romPath = `${id}.${romExt}`;
            const { data: romData, error: romError } = await supabase.storage
                .from('roms')
                .upload(romPath, romFile, { upsert: true });

            if (romError) throw romError;
            const romUrl = supabase.storage.from('roms').getPublicUrl(romPath).data.publicUrl;

            // 3. Salvar no Banco de Dados
            const { error: dbError } = await supabase
                .from('jogos')
                .insert([{
                    id, nome, core, ano, fabricante, descricao,
                    capa_url: capaUrl,
                    rom_url: romUrl
                }]);

            if (dbError) throw dbError;

            setStatus('✅ Jogo cadastrado com sucesso!');
            setId(''); setNome(''); setAno(''); setFabricante(''); setDescricao('');
            setCore('snes');
            setCapaFile(null);
            setRomFile(null);
            e.target.reset();

        } catch (error) {
            console.error(error);
            setStatus('❌ Erro: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#121212', color: 'white', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                
                {/* BOTÃO VOLTAR ADICIONADO AQUI */}
                <Link 
                    to="/admin-dashboard" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: '#aaa', 
                        textDecoration: 'none', 
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#fca311'}
                    onMouseLeave={(e) => e.target.style.color = '#aaa'}
                >
                    <ArrowLeft size={18} />
                    Voltar ao Painel do GM
                </Link>

                <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '15px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <PlusCircle color="#fca311" size={30} />
                        <h2 style={{ margin: 0 }}>Adicionar Novo Jogo</h2>
                    </div>

                    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input placeholder="ID Único (ex: atari-pacman)" value={id} onChange={e => setId(e.target.value)} required style={inputStyle} />
                        <input placeholder="Nome do Jogo" value={nome} onChange={e => setNome(e.target.value)} required style={inputStyle} />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select value={core} onChange={e => setCore(e.target.value)} style={inputStyle}>
                                <optgroup label="Nintendo" style={{background: '#1e1e1e'}}>
                                    <option value="snes">Super Nintendo</option>
                                    <option value="nes">Nintendo (NES)</option>
                                    <option value="gba">GameBoy Advance</option>
                                    <option value="gbc">GameBoy Color</option>
                                    <option value="n64">Nintendo 64</option>
                                </optgroup>
                                <optgroup label="Sega" style={{background: '#1e1e1e'}}>
                                    <option value="segaMD">Mega Drive</option>
                                    <option value="sms">Master System</option>
                                    <option value="gg">Game Gear</option>
                                </optgroup>
                                <optgroup label="Outros" style={{background: '#1e1e1e'}}>
                                    <option value="atari">Atari 2600</option>
                                    <option value="psx">PlayStation 1</option>
                                    <option value="neogeo">Neo Geo</option>
                                    <option value="mame">Arcade (MAME)</option>
                                </optgroup>
                            </select>
                            <input placeholder="Ano" value={ano} onChange={e => setAno(e.target.value)} style={inputStyle} />
                        </div>

                        <input placeholder="Fabricante (ex: Atari, Konami, Sega)" value={fabricante} onChange={e => setFabricante(e.target.value)} style={inputStyle} />
                        <textarea placeholder="Descrição curta" value={descricao} onChange={e => setDescricao(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'none' }} />

                        <div style={{ border: '1px dashed #444', padding: '15px', borderRadius: '10px' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#aaa' }}>Capa do Jogo:</p>
                            <input type="file" accept="image/*" onChange={e => setCapaFile(e.target.files[0])} required />
                        </div>

                        <div style={{ border: '1px dashed #444', padding: '15px', borderRadius: '10px' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#aaa' }}>Arquivo da ROM:</p>
                            <input type="file" onChange={e => setRomFile(e.target.files[0])} required />
                        </div>

                        <button type="submit" disabled={loading} style={btnStyle}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'SUBIR JOGO PARA O SITE'}
                        </button>
                    </form>

                    {status && <p style={{ marginTop: '20px', textAlign: 'center', color: status.includes('❌') ? '#ff4444' : '#00ff88' }}>{status}</p>}
                </div>
            </div>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#252525', color: 'white', outline: 'none' };
const btnStyle = { background: '#fca311', color: '#1a1a2e', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' };

export default AdminJogos;