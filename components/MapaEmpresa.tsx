'use client'

import { useEffect, useState } from 'react'

interface Props {
  endereco: string
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  cep?: string | null
  nomeFantasia: string
}

interface Coords {
  lat: number
  lon: number
}

export default function MapaEmpresa({ endereco, bairro, cidade, estado, cep, nomeFantasia }: Props) {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [erro, setErro] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const partes = [endereco, bairro, cidade, estado, cep, 'Brasil'].filter(Boolean)
    const query = encodeURIComponent(partes.join(', '))

    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'ilicinea.com' },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) })
        } else {
          setErro(true)
        }
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false))
  }, [endereco, bairro, cidade, estado, cep])

  if (carregando) {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-surface-soft h-52 flex items-center justify-center">
        <span className="text-text-muted text-sm">Carregando mapa...</span>
      </div>
    )
  }

  if (erro || !coords) return null

  const { lat, lon } = coords
  const zoom = 17
  const tileUrl = `https://tile.openstreetmap.org/${zoom}`

  // Converte lat/lon para tile XY no zoom dado
  const n = Math.pow(2, zoom)
  const xTile = Math.floor(((lon + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const yTile = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n)

  // Montar iframe estático com OpenStreetMap embed (sem dependência de react-leaflet no bundle SSR)
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.003},${lat - 0.002},${lon + 0.003},${lat + 0.002}&layer=mapnik&marker=${lat},${lon}`
  const linkExterno = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <div className="relative">
        <iframe
          src={iframeSrc}
          width="100%"
          height="220"
          style={{ border: 0, display: 'block' }}
          title={`Localização de ${nomeFantasia}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Overlay badge OpenStreetMap */}
        <div className="absolute bottom-2 right-2 bg-white/90 rounded px-1.5 py-0.5 text-[10px] text-text-muted">
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a>
        </div>
      </div>
      <a
        href={linkExterno}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-2 text-xs text-text-muted hover:text-primary transition-colors bg-surface-soft border-t border-border"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Ver mapa maior
      </a>
    </div>
  )
}
