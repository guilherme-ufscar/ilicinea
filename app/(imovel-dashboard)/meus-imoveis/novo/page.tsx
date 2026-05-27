'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { maskPhone, maskCep } from '@/lib/masks'

const TIPOS = ['CASA', 'APARTAMENTO', 'SOBRADO', 'TERRENO', 'CHACARA', 'SITIO', 'FAZENDA', 'GLEBA', 'RANCHO', 'FLAT', 'LOJA', 'SALA', 'SALA_COMERCIAL', 'GALPAO', 'PAVILHAO_GALPAO', 'BARRACAO', 'PREDIO', 'AREA_INDUSTRIAL', 'POUSADA']
const FINALIDADES = ['RESIDENCIAL', 'COMERCIAL', 'RURAL', 'MISTO']
const NEGOCIOS = ['VENDA', 'ALUGUEL', 'TEMPORADA_DIARIA', 'TEMPORADA_MENSAL']
const MOBILIA = ['NAO_MOBILIADO', 'SEMI_MOBILIADO', 'MOBILIADO']

function formatLabel(s: string) { return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) }

export default function NovoImovelPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, any>>({
    titulo: '', descricao: '', tipo: 'CASA', finalidade: 'RESIDENCIAL', negocio: 'VENDA',
    nomeAnunciante: '', telefoneContato: '', whatsappContato: '', emailContato: '', creci: '',
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: 'Ilicínea', estado: 'MG',
    latitude: '', longitude: '', linkGoogleMaps: '',
    preco: '', precoNegociavel: false, condominio: '', iptu: '', caucao: '', precoTemporada: '',
    areaTotal: '', areaConstruida: '', areaTerreno: '', quartos: '', suites: '', banheiros: '', vagas: '', andares: '',
    posicaoSol: '', mobiliado: 'NAO_MOBILIADO', animaisPermitidos: false,
    sala: false, cozinha: false, areaServico: false, varanda: false, quintal: false,
    piscina: false, churrasqueira: false, portaoEletrico: false, cercaEletrica: false,
    cameraSeguranca: false, alarme: false, aquecedorAgua: false, arCondicionado: false,
    hectares: '', aguaEncanada: false, energiaEletrica: false, escritura: false,
    georreferenciado: false, cadastroRural: false, tipoSolo: '', usoAgricola: '', benfeitorias: '',
    wc: '', mezanino: false, peDireito: '', trifasico: false,
    fotoCapa: '', videoUrl: '', tourVirtualUrl: '',
    fotosUpload: [] as string[],
  })

  function update(f: string, v: any) { setForm(prev => ({ ...prev, [f]: v })) }
  function toggle(f: string) { setForm(prev => ({ ...prev, [f]: !prev[f] })) }

  function nextStep() { setError(null); setStep(s => Math.min(s + 1, 5)) }
  function prevStep() { setError(null); setStep(s => Math.max(s - 1, 1)) }

  async function buscarCep(cepValue?: string) {
    const raw = (cepValue || form.cep).replace(/\D/g, '')
    if (raw.length < 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(prev => ({ ...prev, logradouro: data.logradouro || '', bairro: data.bairro || '' }))
      }
    } catch {}
  }

  async function handleSubmit() {
    setError(null)
    if (!form.titulo || !form.descricao || !form.nomeAnunciante) { setError('Título, descrição e nome do anunciante são obrigatórios'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fotos: form.fotosUpload.map((url: string) => ({ url })),
        }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erro'); setLoading(false); return }
      router.push('/meus-imoveis')
    } catch { setError('Erro inesperado') } finally { setLoading(false) }
  }

  const STEPS = 5
  const progressPct = (step / STEPS) * 100

  const boolChecks = [
    ['sala', 'Sala'], ['cozinha', 'Cozinha'], ['areaServico', 'Área de serviço'], ['varanda', 'Varanda'],
    ['quintal', 'Quintal'], ['piscina', 'Piscina'], ['churrasqueira', 'Churrasqueira'], ['portaoEletrico', 'Portão elétrico'],
    ['cercaEletrica', 'Cerca elétrica'], ['cameraSeguranca', 'Câmera'], ['alarme', 'Alarme'], ['aquecedorAgua', 'Aquecedor'],
    ['arCondicionado', 'Ar cond.'], ['animaisPermitidos', 'Animais permitidos'],
  ]

  const ruralChecks = [
    ['aguaEncanada', 'Água encanada'], ['energiaEletrica', 'Energia elétrica'], ['escritura', 'Escritura'],
    ['georreferenciado', 'Georreferenciado'], ['cadastroRural', 'Cadastro Rural (ITR)'],
  ]

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-text mb-1">Novo anúncio</h1>
      <p className="text-text-soft text-sm mb-4">Etapa {step} de {STEPS}</p>

      <div className="w-full bg-border rounded-full h-1.5 mb-8">
        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

      <div className="card p-6 space-y-4">
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold text-text mb-4">Classificação</h2>
            <SelectF label="Tipo de imóvel *" value={form.tipo} onChange={v => update('tipo', v)} options={TIPOS} />
            <SelectF label="Finalidade *" value={form.finalidade} onChange={v => update('finalidade', v)} options={FINALIDADES} />
            <SelectF label="Tipo de negócio *" value={form.negocio} onChange={v => update('negocio', v)} options={NEGOCIOS} />
            <InputF label="Título do anúncio *" value={form.titulo} onChange={v => update('titulo', v)} />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold text-text mb-4">Localização</h2>
            <InputF label="CEP" value={form.cep} onChange={v => { const masked = maskCep(v); update('cep', masked); if (masked.replace(/\D/g, '').length === 8) buscarCep(masked) }} placeholder="37175-000" />
            <InputF label="Logradouro" value={form.logradouro} onChange={v => update('logradouro', v)} />
            <InputF label="Número" value={form.numero} onChange={v => update('numero', v)} />
            <InputF label="Complemento" value={form.complemento} onChange={v => update('complemento', v)} />
            <InputF label="Bairro" value={form.bairro} onChange={v => update('bairro', v)} />
            <InputF label="Cidade" value={form.cidade} onChange={v => update('cidade', v)} />
            <InputF label="Estado" value={form.estado} onChange={v => update('estado', v)} />
            <div className="grid grid-cols-2 gap-4">
              <InputF label="Latitude" value={form.latitude} onChange={v => update('latitude', v)} type="number" />
              <InputF label="Longitude" value={form.longitude} onChange={v => update('longitude', v)} type="number" />
            </div>
            <InputF label="Link Google Maps" value={form.linkGoogleMaps} onChange={v => update('linkGoogleMaps', v)} />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold text-text mb-4">Valores</h2>
            <InputF label="Preço (R$)" value={form.preco} onChange={v => update('preco', v)} type="number" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.precoNegociavel} onChange={() => toggle('precoNegociavel')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <span className="text-sm text-text-soft">Preço a negociar</span>
            </label>
            {form.negocio === 'ALUGUEL' && <InputF label="Condomínio (R$)" value={form.condominio} onChange={v => update('condominio', v)} type="number" />}
            <InputF label="IPTU anual (R$)" value={form.iptu} onChange={v => update('iptu', v)} type="number" />
            {form.negocio === 'ALUGUEL' && <InputF label="Caução (nº meses)" value={form.caucao} onChange={v => update('caucao', v)} type="number" />}
            {(form.negocio === 'TEMPORADA_DIARIA' || form.negocio === 'TEMPORADA_MENSAL') && (
              <InputF label={form.negocio === 'TEMPORADA_DIARIA' ? 'Preço diária (R$)' : 'Preço mês (R$)'} value={form.precoTemporada} onChange={v => update('precoTemporada', v)} type="number" />
            )}
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold text-text mb-4">Características</h2>
            <h3 className="font-medium text-text text-sm mt-2">Medidas gerais</h3>
            <div className="grid grid-cols-3 gap-3">
              <InputF label="Área total (m²)" value={form.areaTotal} onChange={v => update('areaTotal', v)} type="number" />
              <InputF label="Área construída (m²)" value={form.areaConstruida} onChange={v => update('areaConstruida', v)} type="number" />
              <InputF label="Área terreno (m²)" value={form.areaTerreno} onChange={v => update('areaTerreno', v)} type="number" />
            </div>

            {form.finalidade === 'RESIDENCIAL' || form.finalidade === 'MISTO' ? (
              <>
                <h3 className="font-medium text-text text-sm mt-4">Cômodos</h3>
                <div className="grid grid-cols-4 gap-3">
                  <InputF label="Quartos" value={form.quartos} onChange={v => update('quartos', v)} type="number" />
                  <InputF label="Suítes" value={form.suites} onChange={v => update('suites', v)} type="number" />
                  <InputF label="Banheiros" value={form.banheiros} onChange={v => update('banheiros', v)} type="number" />
                  <InputF label="Vagas" value={form.vagas} onChange={v => update('vagas', v)} type="number" />
                </div>
                <InputF label="Andares" value={form.andares} onChange={v => update('andares', v)} type="number" />
                <InputF label="Posição solar" value={form.posicaoSol} onChange={v => update('posicaoSol', v)} placeholder="Nascente, Poente, Misto" />
                <h3 className="font-medium text-text text-sm mt-4">Infraestrutura</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {boolChecks.map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!form[key]} onChange={() => toggle(key)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm text-text-soft">{label}</span>
                    </label>
                  ))}
                </div>
                <h3 className="font-medium text-text text-sm mt-4">Mobília</h3>
                <SelectF label="" value={form.mobiliado} onChange={v => update('mobiliado', v)} options={MOBILIA.map(m => ({ key: m, label: formatLabel(m) }))} />
              </>
            ) : null}

            {form.finalidade === 'RURAL' && (
              <>
                <h3 className="font-medium text-text text-sm mt-4">Características rurais</h3>
                <InputF label="Hectares" value={form.hectares} onChange={v => update('hectares', v)} type="number" />
                <div className="grid grid-cols-2 gap-2">
                  {ruralChecks.map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!form[key]} onChange={() => toggle(key)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm text-text-soft">{label}</span>
                    </label>
                  ))}
                </div>
                <InputF label="Tipo de solo" value={form.tipoSolo} onChange={v => update('tipoSolo', v)} />
                <InputF label="Uso agrícola" value={form.usoAgricola} onChange={v => update('usoAgricola', v)} />
                <InputF label="Benfeitorias" value={form.benfeitorias} onChange={v => update('benfeitorias', v)} />
              </>
            )}

            {form.finalidade === 'COMERCIAL' && (
              <>
                <h3 className="font-medium text-text text-sm mt-4">Características comerciais</h3>
                <InputF label="WC" value={form.wc} onChange={v => update('wc', v)} type="number" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.mezanino} onChange={() => toggle('mezanino')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-text-soft">Mezanino</span>
                </label>
                <InputF label="Pé-direito (m)" value={form.peDireito} onChange={v => update('peDireito', v)} type="number" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.trifasico} onChange={() => toggle('trifasico')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-text-soft">Trifásico</span>
                </label>
              </>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-lg font-semibold text-text mb-4">Fotos, descrição e contato</h2>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Descrição completa *</label>
              <textarea value={form.descricao} onChange={e => update('descricao', e.target.value)} rows={6} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <InputF label="URL da foto de capa" value={form.fotoCapa} onChange={v => update('fotoCapa', v)} />
            <UploadField onUpload={url => update('fotoCapa', url)} label="Upload foto capa" folder="imoveis" />
            <InputF label="URL do vídeo (YouTube)" value={form.videoUrl} onChange={v => update('videoUrl', v)} />
            <InputF label="URL tour virtual" value={form.tourVirtualUrl} onChange={v => update('tourVirtualUrl', v)} />

            <div>
              <label className="block text-sm font-medium text-text mb-1">Fotos adicionais</label>
              <UploadField onUpload={url => update('fotosUpload', [...form.fotosUpload, url])} label="Adicionar foto" folder="imoveis" />
              {form.fotosUpload.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {form.fotosUpload.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-surface-soft border border-border group">
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => update('fotosUpload', form.fotosUpload.filter((_: string, j: number) => j !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className="font-medium text-text text-sm mt-4 pt-4 border-t border-border">Dados de contato</h3>
            <InputF label="Nome para exibição *" value={form.nomeAnunciante} onChange={v => update('nomeAnunciante', v)} />
            <InputF label="Telefone" value={form.telefoneContato} onChange={v => update('telefoneContato', maskPhone(v))} placeholder="(35) 99999-0000" />
            <InputF label="WhatsApp" value={form.whatsappContato} onChange={v => update('whatsappContato', maskPhone(v))} placeholder="(35) 99999-0000" />
            <InputF label="E-mail" value={form.emailContato} onChange={v => update('emailContato', v)} />
            <InputF label="CRECI" value={form.creci} onChange={v => update('creci', v)} />
          </>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        {step > 1 && <button onClick={prevStep} className="btn-outline py-2.5 px-6">Voltar</button>}
        {step < 5 ? (
          <button onClick={nextStep} className="btn-primary py-2.5 px-6 ml-auto">Próximo</button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} className="btn-primary py-2.5 px-6 ml-auto disabled:opacity-60">
            {loading ? 'Criando...' : 'Publicar anúncio'}
          </button>
        )}
      </div>
    </div>
  )
}

function InputF({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-text mb-1">{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
  )
}

function SelectF({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: (string | { key: string; label: string })[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary">
        {options.map(opt => {
          const key = typeof opt === 'string' ? opt : opt.key
          const label = typeof opt === 'string' ? formatLabel(opt) : opt.label
          return <option key={key} value={key}>{label}</option>
        })}
      </select>
    </div>
  )
}

function UploadField({ onUpload, label, folder }: { onUpload: (url: string) => void; label: string; folder: string }) {
  const [uploading, setUploading] = useState(false)
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload falhou')
      const data = await res.json()
      onUpload(data.url)
    } catch { alert('Erro no upload') } finally { setUploading(false) }
  }
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <input type="file" accept="image/*" onChange={handleChange} disabled={uploading} className="w-full text-sm text-text-soft file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-primary" />
      {uploading && <p className="text-xs text-text-muted mt-1">Enviando...</p>}
    </div>
  )
}
