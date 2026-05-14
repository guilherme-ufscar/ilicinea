'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const TIPOS = ['CASA', 'APARTAMENTO', 'SOBRADO', 'TERRENO', 'CHACARA', 'SITIO', 'FAZENDA', 'GLEBA', 'RANCHO', 'FLAT', 'LOJA', 'SALA', 'SALA_COMERCIAL', 'GALPAO', 'PAVILHAO_GALPAO', 'BARRACAO', 'PREDIO', 'AREA_INDUSTRIAL', 'POUSADA']
const FINALIDADES = ['RESIDENCIAL', 'COMERCIAL', 'RURAL', 'MISTO']
const NEGOCIOS = ['VENDA', 'ALUGUEL', 'TEMPORADA_DIARIA', 'TEMPORADA_MENSAL']
const MOBILIA = ['NAO_MOBILIADO', 'SEMI_MOBILIADO', 'MOBILIADO']
const STATUSES = ['PENDENTE', 'ATIVO', 'VENDIDO', 'ALUGADO', 'INATIVO', 'REJEITADO']

function formatLabel(s: string) { return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) }

export default function EditarImovelPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, any>>({
    titulo: '', descricao: '', tipo: 'CASA', finalidade: 'RESIDENCIAL', negocio: 'VENDA', status: 'PENDENTE',
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

  useEffect(() => {
    fetch(`/api/imoveis/${id}`)
      .then(r => r.json())
      .then(im => {
        setForm({
          titulo: im.titulo || '', descricao: im.descricao || '', tipo: im.tipo || 'CASA',
          finalidade: im.finalidade || 'RESIDENCIAL', negocio: im.negocio || 'VENDA',
          status: im.status || 'PENDENTE',
          nomeAnunciante: im.nomeAnunciante || '', telefoneContato: im.telefoneContato || '',
          whatsappContato: im.whatsappContato || '', emailContato: im.emailContato || '', creci: im.creci || '',
          cep: im.cep || '', logradouro: im.logradouro || '', numero: im.numero || '',
          complemento: im.complemento || '', bairro: im.bairro || '', cidade: im.cidade || 'Ilicínea',
          estado: im.estado || 'MG', latitude: im.latitude?.toString() || '', longitude: im.longitude?.toString() || '',
          linkGoogleMaps: im.linkGoogleMaps || '',
          preco: im.preco?.toString() || '', precoNegociavel: im.precoNegociavel || false,
          condominio: im.condominio?.toString() || '', iptu: im.iptu?.toString() || '',
          caucao: im.caucao?.toString() || '', precoTemporada: im.precoTemporada?.toString() || '',
          areaTotal: im.areaTotal?.toString() || '', areaConstruida: im.areaConstruida?.toString() || '',
          areaTerreno: im.areaTerreno?.toString() || '', quartos: im.quartos?.toString() || '',
          suites: im.suites?.toString() || '', banheiros: im.banheiros?.toString() || '',
          vagas: im.vagas?.toString() || '', andares: im.andares?.toString() || '',
          posicaoSol: im.posicaoSol || '', mobiliado: im.mobiliado || 'NAO_MOBILIADO',
          animaisPermitidos: im.animaisPermitidos || false,
          sala: im.sala || false, cozinha: im.cozinha || false, areaServico: im.areaServico || false,
          varanda: im.varanda || false, quintal: im.quintal || false, piscina: im.piscina || false,
          churrasqueira: im.churrasqueira || false, portaoEletrico: im.portaoEletrico || false,
          cercaEletrica: im.cercaEletrica || false, cameraSeguranca: im.cameraSeguranca || false,
          alarme: im.alarme || false, aquecedorAgua: im.aquecedorAgua || false,
          arCondicionado: im.arCondicionado || false,
          hectares: im.hectares?.toString() || '', aguaEncanada: im.aguaEncanada || false,
          energiaEletrica: im.energiaEletrica || false, escritura: im.escritura || false,
          georreferenciado: im.georreferenciado || false, cadastroRural: im.cadastroRural || false,
          tipoSolo: im.tipoSolo || '', usoAgricola: im.usoAgricola || '', benfeitorias: im.benfeitorias || '',
          wc: im.wc?.toString() || '', mezanino: im.mezanino || false,
          peDireito: im.peDireito?.toString() || '', trifasico: im.trifasico || false,
          fotoCapa: im.fotoCapa || '', videoUrl: im.videoUrl || '', tourVirtualUrl: im.tourVirtualUrl || '',
          fotosUpload: im.fotos?.map((f: any) => f.url) || [],
        })
        setPageLoading(false)
      })
      .catch(() => { setError('Erro ao carregar'); setPageLoading(false) })
  }, [id])

  function update(f: string, v: any) { setForm(prev => ({ ...prev, [f]: v })) }
  function toggle(f: string) { setForm(prev => ({ ...prev, [f]: !prev[f] })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/imoveis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fotos: form.fotosUpload.map((url: string) => ({ url })) }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erro'); setLoading(false); return }
      router.push('/meus-imoveis')
    } catch { setError('Erro inesperado') } finally { setLoading(false) }
  }

  if (pageLoading) return <div className="text-text-muted p-8">Carregando...</div>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-text mb-6">Editar imóvel</h1>
      {error && <div className="bg-accent-light text-accent text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Classificação</h2>
          <SelectF label="Tipo" value={form.tipo} onChange={v => update('tipo', v)} options={TIPOS} />
          <SelectF label="Finalidade" value={form.finalidade} onChange={v => update('finalidade', v)} options={FINALIDADES} />
          <SelectF label="Negócio" value={form.negocio} onChange={v => update('negocio', v)} options={NEGOCIOS} />
          <SelectF label="Status" value={form.status} onChange={v => update('status', v)} options={STATUSES.map(s => ({ key: s, label: formatLabel(s) }))} />
          <InputF label="Título *" value={form.titulo} onChange={v => update('titulo', v)} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Valores</h2>
          <InputF label="Preço (R$)" value={form.preco} onChange={v => update('preco', v)} type="number" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.precoNegociavel} onChange={() => toggle('precoNegociavel')} className="w-4 h-4 rounded border-border text-primary" /><span className="text-sm text-text-soft">Preço a negociar</span></label>
          <InputF label="Condomínio" value={form.condominio} onChange={v => update('condominio', v)} type="number" />
          <InputF label="IPTU anual" value={form.iptu} onChange={v => update('iptu', v)} type="number" />
          <InputF label="Caução (meses)" value={form.caucao} onChange={v => update('caucao', v)} type="number" />
          <InputF label="Preço temporada" value={form.precoTemporada} onChange={v => update('precoTemporada', v)} type="number" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Características</h2>
          <div className="grid grid-cols-3 gap-3">
            <InputF label="Área total (m²)" value={form.areaTotal} onChange={v => update('areaTotal', v)} type="number" />
            <InputF label="Área construída" value={form.areaConstruida} onChange={v => update('areaConstruida', v)} type="number" />
            <InputF label="Área terreno" value={form.areaTerreno} onChange={v => update('areaTerreno', v)} type="number" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <InputF label="Quartos" value={form.quartos} onChange={v => update('quartos', v)} type="number" />
            <InputF label="Suítes" value={form.suites} onChange={v => update('suites', v)} type="number" />
            <InputF label="Banheiros" value={form.banheiros} onChange={v => update('banheiros', v)} type="number" />
            <InputF label="Vagas" value={form.vagas} onChange={v => update('vagas', v)} type="number" />
          </div>
          <InputF label="Posição solar" value={form.posicaoSol} onChange={v => update('posicaoSol', v)} />
          <SelectF label="Mobília" value={form.mobiliado} onChange={v => update('mobiliado', v)} options={MOBILIA.map(m => ({ key: m, label: formatLabel(m) }))} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Localização</h2>
          <InputF label="CEP" value={form.cep} onChange={v => update('cep', v)} />
          <InputF label="Endereço" value={form.logradouro} onChange={v => update('logradouro', v)} />
          <InputF label="Número" value={form.numero} onChange={v => update('numero', v)} />
          <InputF label="Bairro" value={form.bairro} onChange={v => update('bairro', v)} />
          <InputF label="Link Google Maps" value={form.linkGoogleMaps} onChange={v => update('linkGoogleMaps', v)} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Descrição</h2>
          <textarea value={form.descricao} onChange={e => update('descricao', e.target.value)} rows={6} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Mídia</h2>
          <InputF label="URL foto capa" value={form.fotoCapa} onChange={v => update('fotoCapa', v)} />
          <UploadField onUpload={url => update('fotoCapa', url)} label="Upload foto capa" folder="imoveis" />
          <InputF label="URL vídeo" value={form.videoUrl} onChange={v => update('videoUrl', v)} />
          <InputF label="URL tour virtual" value={form.tourVirtualUrl} onChange={v => update('tourVirtualUrl', v)} />
          <div>
            <label className="block text-sm font-medium text-text mb-1">Fotos</label>
            <UploadField onUpload={url => update('fotosUpload', [...form.fotosUpload, url])} label="Adicionar foto" folder="imoveis" />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {form.fotosUpload.map((url: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-surface-soft border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update('fotosUpload', form.fotosUpload.filter((_: string, j: number) => j !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">&times;</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text">Contato</h2>
          <InputF label="Nome *" value={form.nomeAnunciante} onChange={v => update('nomeAnunciante', v)} />
          <InputF label="Telefone" value={form.telefoneContato} onChange={v => update('telefoneContato', v)} />
          <InputF label="WhatsApp" value={form.whatsappContato} onChange={v => update('whatsappContato', v)} />
          <InputF label="E-mail" value={form.emailContato} onChange={v => update('emailContato', v)} />
          <InputF label="CRECI" value={form.creci} onChange={v => update('creci', v)} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 disabled:opacity-60">
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}

function InputF({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary" />
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
