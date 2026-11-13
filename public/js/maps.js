// Mapas: solo datos. Cada plataforma es [centroX, yTop, ancho, tipo]:
//   'low' = alcanzable desde el suelo (aquí aparece el Calzado antideslizante)
//   'air' = aérea (aquí aparece el Globo pesado)
// Todos son simétricos y recorribles saltando (salto máximo ≈ 275 px).
export const MAPS = [
  {
    id: 'clasico', name: 'Clásico',
    background: 0x1B1F3B, platformColor: 0x4A5080,
    dashSpawn: { x: 960, y: 480 },
    platforms: [
      [420, 800, 360, 'low'], [1500, 800, 360, 'low'],
      [960, 660, 320, 'air'],
      [180, 580, 280, 'air'], [1740, 580, 280, 'air']
    ]
  },
  {
    id: 'torres', name: 'Torres',
    background: 0x2B1B3D, platformColor: 0x7A4A8C,
    dashSpawn: { x: 960, y: 420 },
    platforms: [
      [260, 790, 300, 'low'], [1660, 790, 300, 'low'], [960, 790, 220, 'low'],
      [560, 600, 240, 'air'], [1360, 600, 240, 'air'],
      [960, 480, 280, 'air']
    ]
  },
  {
    id: 'piramide', name: 'Pirámide',
    background: 0x1B3B2E, platformColor: 0x3F7A5C,
    dashSpawn: { x: 960, y: 480 },
    platforms: [
      [960, 800, 700, 'low'], [960, 590, 380, 'air'], [960, 380, 180, 'air'],
      [260, 780, 300, 'low'], [1660, 780, 300, 'low'],
      [300, 550, 220, 'air'], [1620, 550, 220, 'air']
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
