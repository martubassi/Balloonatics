// Mapas: solo datos. Cada plataforma es [centroX, yTop, ancho, tipo]:
//   'low' = alcanzable desde el suelo (aquí aparece el Calzado antideslizante)
//   'air' = aérea (aquí aparece el Globo pesado)
// Todos son simétricos y recorribles saltando (salto máximo ≈ 275 px).
export const MAPS = [
  {
    id: 'clasico', name: 'Clásico',
    background: 0x1B1F3B, platformColor: 0x4A5080,
    dashSpawn: { x: 960, y: 640 },
    platforms: [
      [400, 800, 340, 'low'], [1520, 800, 340, 'low'],
      [700, 640, 200, 'air'], [1220, 640, 200, 'air'],
      [300, 570, 260, 'air'], [1620, 570, 260, 'air']
    ]
  },
  {
    id: 'torres', name: 'Torres',
    background: 0x2B1B3D, platformColor: 0x7A4A8C,
    dashSpawn: { x: 960, y: 640 },
    platforms: [
      [300, 790, 280, 'low'], [1620, 790, 280, 'low'],
      [700, 790, 200, 'low'], [1220, 790, 200, 'low'],
      [450, 590, 240, 'air'], [1470, 590, 240, 'air'],
      [650, 400, 200, 'air'], [1270, 400, 200, 'air']
    ]
  },
  {
    id: 'piramide', name: 'Pirámide',
    background: 0x1B3B2E, platformColor: 0x3F7A5C,
    dashSpawn: { x: 960, y: 640 },
    platforms: [
      [400, 800, 500, 'low'], [1520, 800, 500, 'low'],
      [400, 600, 300, 'air'], [1520, 600, 300, 'air'],
      [400, 400, 140, 'air'], [1520, 400, 140, 'air']
    ]
  }
];

export function getMap(id) {
  return MAPS.find((m) => m.id === id) || MAPS[0];
}

// Votación: si coinciden, gana ese mapa; si no, se sortea entre los dos votados
export function resolveMapVote(voteA, voteB, rng = Math.random) {
  if (voteA === voteB) return { mapId: voteA, random: false };
  return { mapId: rng() < 0.5 ? voteA : voteB, random: true };
}
