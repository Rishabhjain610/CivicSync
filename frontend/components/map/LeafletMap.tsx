"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useIssueStore, useFilteredIssues, Issue } from '@/lib/store/useIssueStore';
import { stateCities } from '@/lib/data/stateCities';

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORY_FLAGS: Record<string, string> = {
  Infrastructure: "/yellowflag.png",
  Sanitation:     "/greenflag.png",
  Safety:         "/redflag.png",
  Greenery:       "/greenflag.png",
};

const CATEGORY_LABEL: Record<string, string> = {
  Infrastructure: '🚧 Infrastructure',
  Sanitation:     '♻️ Sanitation',
  Safety:         '🚨 Safety',
  Greenery:       '🌿 Greenery',
};

const categoryConfig: Record<string, { emoji: string; color: string }> = {
  Infrastructure: { emoji: '🏗️', color: '#3B82F6' },
  Sanitation:     { emoji: '♻️', color: '#10B981' },
  Safety:         { emoji: '🚨', color: '#F43F5E' },
  Greenery:       { emoji: '🌿', color: '#22C55E' },
};

// ── Local city lookup ─────────────────────────────────────────────────────────
function localGeocode(state?: string, city?: string): { lat: number; lng: number } | null {
  if (!state && !city) return null;
  if (state && city) {
    const cities = stateCities[state];
    if (cities) {
      const found = cities.find(c => c.name.toLowerCase() === city.toLowerCase());
      if (found) return { lat: found.lat, lng: found.lng };
    }
  }
  if (city) {
    for (const cities of Object.values(stateCities)) {
      const found = cities.find(c => c.name.toLowerCase() === city.toLowerCase());
      if (found) return { lat: found.lat, lng: found.lng };
    }
  }
  if (state && stateCities[state]?.length) {
    const capital = stateCities[state][0];
    return { lat: capital.lat, lng: capital.lng };
  }
  return null;
}

// ── Nominatim geocoder ────────────────────────────────────────────────────────
const geocodeCache = new Map<string, { lat: number; lng: number }>();
async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  if (!query?.trim()) return null;
  const key = query.toLowerCase().trim();
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', India')}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (data.length > 0) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache.set(key, result);
      return result;
    }
  } catch { /* silent */ }
  return null;
}

// ── Tile layers ───────────────────────────────────────────────────────────────
const TILE_LAYERS = [
  { name: '🌍 Voyager',  url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attr: '&copy; CARTO' },
  { name: '🌙 Dark',     url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',       attr: '&copy; CARTO' },
  { name: '☀️ Light',    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',      attr: '&copy; CARTO' },
  { name: '🗺️ Standard', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                  attr: '&copy; OpenStreetMap' },
];

// ── Main Component ────────────────────────────────────────────────────────────
const LeafletMap = ({ compact = false }: { compact?: boolean }) => {
  const { isLoading, searchQuery } = useIssueStore();
  const filteredIssues = useFilteredIssues();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const clusterRef   = useRef<any>(null);
  const heatRef      = useRef<any>(null);
  const tileRef      = useRef<any>(null);
  const controlRef   = useRef<any>(null);

  const [geoIssues, setGeoIssues] = useState<Issue[]>([]);
  const [activeLayer, setActiveLayer] = useState(TILE_LAYERS[0].name);

  const categoryCounts = Object.keys(CATEGORY_LABEL).map(c => ({
    category: c,
    count: filteredIssues.filter(i => i.category === c).length,
    flag: CATEGORY_FLAGS[c],
    label: CATEGORY_LABEL[c],
  }));

  const height    = compact ? '100%' : '600px';
  const minHeight = compact ? '680px' : '600px';

  // ── Step 1: Geocode issues ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      const jitter = () => (Math.random() - 0.5) * 0.08;
      const resolved: Issue[] = [];
      for (const issue of filteredIssues) {
        if (issue.latlng?.lat && issue.latlng?.lng) {
          resolved.push(issue);
        } else {
          const local = localGeocode(issue.state, issue.city);
          if (local) {
            resolved.push({ ...issue, latlng: { lat: local.lat + jitter(), lng: local.lng + jitter() } });
          } else {
            const parts = [issue.city, issue.state, issue.location].filter(Boolean);
            const query = parts.join(', ');
            if (query) {
              const coords = await geocode(query);
              if (coords) { resolved.push({ ...issue, latlng: coords }); continue; }
            }
            // Last resort: scatter across India
            resolved.push({ ...issue, latlng: { lat: 20.5937 + (Math.random()-0.5)*10, lng: 78.9629 + (Math.random()-0.5)*10 } });
          }
        }
      }
      if (!cancelled) setGeoIssues(resolved);
    };
    resolve();
    return () => { cancelled = true; };
  }, [filteredIssues]);

  // ── Step 2: Initialize map (once) ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return; // already initialized

    let map: any;

    const init = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!containerRef.current) return;

      map = L.map(containerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      // Build base layer map for the layer control
      const baseLayers: Record<string, any> = {};
      TILE_LAYERS.forEach((t, i) => {
        const layer = L.tileLayer(t.url, { attribution: t.attr, maxZoom: 19 });
        baseLayers[t.name] = layer;
        if (i === 0) layer.addTo(map);
      });

      const ctrl = L.control.layers(baseLayers, {}, { position: 'topright', collapsed: true });
      ctrl.addTo(map);
      controlRef.current = ctrl;

      // Track active layer name for UI
      map.on('baselayerchange', (e: any) => setActiveLayer(e.name));
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        clusterRef.current = null;
        heatRef.current = null;
      }
    };
  }, []);

  // ── Step 3: Update markers + heatmap when geoIssues change ─────────────────
  useEffect(() => {
    if (!mapRef.current) return;

    const updateLayers = async () => {
      const L = (await import('leaflet')).default;
      const map = mapRef.current;
      if (!map) return;

      // ── Marker Cluster ──────────────────────────────────────────────────────
      try {
        await import('leaflet.markercluster');
        await import('leaflet.markercluster/dist/MarkerCluster.css');
        await import('leaflet.markercluster/dist/MarkerCluster.Default.css');

        if (clusterRef.current) {
          map.removeLayer(clusterRef.current);
          clusterRef.current = null;
        }

        if (geoIssues.length > 0 && (L as any).markerClusterGroup) {
          const cluster = (L as any).markerClusterGroup({
            maxClusterRadius: 50,
            disableClusteringAtZoom: 14,
            spiderfyOnMaxZoom: true,
            iconCreateFunction: (c: any) => {
              const count = c.getChildCount();
              let bg = '#3B82F6';
              let scale = 1;
              if (count > 20) { bg = '#7F1D1D'; scale = 1.5; }
              else if (count > 10) { bg = '#DC2626'; scale = 1.3; }
              else if (count > 5)  { bg = '#F59E0B'; scale = 1.15; }
              const size = Math.round(44 * scale);
              return L.divIcon({
                html: `<div style="background:${bg};border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:${Math.round(14*scale)}px;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.35);">${count}</div>`,
                className: '',
                iconSize: [size, size],
                iconAnchor: [size/2, size/2],
              });
            },
          });

          geoIssues.forEach(issue => {
            if (!issue.latlng?.lat || !issue.latlng?.lng) return;
            const src = CATEGORY_FLAGS[issue.category] || CATEGORY_FLAGS['Safety'];
            const icon = L.icon({ iconUrl: src, iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -40] });
            const marker = L.marker([issue.latlng.lat, issue.latlng.lng], { icon });
            const { emoji, color } = categoryConfig[issue.category] || { emoji: '📍', color: '#6366f1' };
            const statusColor = ({ New: '#EF4444', 'In Progress': '#F59E0B', Resolved: '#10B981' } as any)[issue.status] || '#6B7280';
            const loc = [issue.town, issue.city, issue.state].filter(Boolean).join(' › ') || issue.location || 'India';
            marker.bindPopup(`
              <div style="font-family:system-ui,sans-serif;min-width:220px;max-width:280px;">
                <div style="display:flex;align-items:center;gap:10px;padding-bottom:10px;border-bottom:1px solid #F1F5F9;margin-bottom:10px;">
                  <img src="${src}" style="width:24px;height:32px;object-fit:contain;" />
                  <div>
                    <div style="font-weight:900;font-size:14px;color:#0F172A;">${issue.title}</div>
                    <div style="font-size:10px;color:#64748B;margin-top:2px;">📍 ${loc}</div>
                  </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                  <div style="background:#F8FAFC;border-radius:10px;padding:8px;text-align:center;">
                    <div style="font-size:8px;color:#94A3B8;font-weight:800;text-transform:uppercase;">Category</div>
                    <div style="font-size:12px;font-weight:900;color:${color};margin-top:2px;">${emoji} ${issue.category}</div>
                  </div>
                  <div style="background:#F8FAFC;border-radius:10px;padding:8px;text-align:center;">
                    <div style="font-size:8px;color:#94A3B8;font-weight:800;text-transform:uppercase;">Status</div>
                    <div style="font-size:12px;font-weight:900;color:${statusColor};margin-top:2px;">${issue.status}</div>
                  </div>
                </div>
                <div style="font-size:11px;color:#475569;line-height:1.6;margin-bottom:8px;">${issue.description?.slice(0,120) || 'No description.'}${(issue.description?.length||0) > 120 ? '…' : ''}</div>
                <div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #F1F5F9;">
                  <span style="font-size:11px;font-weight:900;color:#3B82F6;">👍 ${issue.votes} Votes</span>
                  <span style="font-size:9px;font-weight:900;padding:4px 10px;border-radius:999px;background:${statusColor}22;color:${statusColor};">${issue.status.toUpperCase()}</span>
                </div>
              </div>
            `, { maxWidth: 300 });
            cluster.addLayer(marker);
          });

          map.addLayer(cluster);
          clusterRef.current = cluster;
        }
      } catch (e) {
        console.warn('Marker cluster load error:', e);
      }

      // ── Heatmap ─────────────────────────────────────────────────────────────
      try {
        if (!document.getElementById('leaflet-heat-script')) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script');
            s.id = 'leaflet-heat-script';
            s.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
            s.onload = () => resolve();
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }

        if (heatRef.current) { map.removeLayer(heatRef.current); heatRef.current = null; }

        const points = geoIssues
          .filter(i => i.latlng?.lat && i.latlng?.lng)
          .map(i => [i.latlng!.lat, i.latlng!.lng, 0.6]);

        if (points.length > 0 && (L as any).heatLayer) {
          const heat = (L as any).heatLayer(points, {
            radius: 25, blur: 15, maxZoom: 17,
            gradient: { 0.4: '#3B82F6', 0.65: '#10B981', 1: '#EF4444' },
          });
          heat.addTo(map);
          heatRef.current = heat;
        }
      } catch (e) {
        console.warn('Heatmap load error:', e);
      }

      // ── Auto-fit bounds ──────────────────────────────────────────────────────
      const pts = geoIssues.filter(i => i.latlng?.lat && i.latlng?.lng).map(i => [i.latlng!.lat, i.latlng!.lng] as [number, number]);
      if (pts.length === 1) {
        map.setView(pts[0], 12, { animate: true });
      } else if (pts.length > 1) {
        map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: 14, animate: true });
      }
    };

    updateLayers();
  }, [geoIssues]);

  return (
    <div
      className="relative z-0 w-full h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-900"
      style={{ height, minHeight }}
    >
      {/* Empty state */}
      {!isLoading && filteredIssues.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <div className="text-center p-8">
            <div className="text-5xl mb-4">{searchQuery ? '🔍' : '🌍'}</div>
            <p className="text-slate-700 dark:text-slate-300 font-bold text-base">
              {searchQuery ? 'No matching issues' : 'No issues to map yet'}
            </p>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">
              {searchQuery ? 'Try a different search term or clear the filter.' : 'Create issues via the drill-down map to see flags appear here'}
            </p>
          </div>
        </div>
      )}

      {/* Map container — vanilla Leaflet mounts here */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xl min-w-[160px]">
        <p className="font-black text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
          Categories
        </p>
        <div className="space-y-2.5">
          {categoryCounts.map(({ category, count, flag, label }) => (
            <div key={category} className="flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flag} alt={category} className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{label.split(' ')[1]}</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live count pill */}
      <div className="absolute top-4 right-14 z-[400]">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            {filteredIssues.length} Issue{filteredIssues.length !== 1 ? 's' : ''} on map
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
