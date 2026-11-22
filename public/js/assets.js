export const ASSETS = {
  pip: 'pip', beto: 'beto', balloon: 'Globo', logo: 'logo',
  platform_clasico: 'plataforma_01_rayada',
  platform_torres: 'plataforma_06_violeta_larga',
  platform_piramide: 'plataforma_07_verde_larga',
  floor: 'bloque_azul_conectable_02', crate: 'caja_madera',
  frame_hd: 'marco_laboratorio_hd'
};
for (const id of ['clasico', 'torres', 'piramide']) {
  ASSETS[`background_${id}`] = `balloonatics_fondo_${id}_1920x1080`;
}
for (const player of ['pip', 'beto']) {
  for (const state of ['full', 'empty']) {
    ASSETS[`heart_${player}_${state}`] = `heart_${player}_${state}`;
  }
}

export function preloadArtwork(scene) {
  for (const [key, file] of Object.entries(ASSETS)) {
    scene.load.image(`art_${key}`, `assets/${file}.png`);
  }
}

// Mantener el tamaño lógico evita que la resolución del arte cambie las colisiones.
export function fitTexture(scene, key, width, height, preserveAspect = false) {
  const image = scene.textures.get(`art_${key}`).getSourceImage();
  const texture = scene.textures.createCanvas(key, width, height);
  const ratio = Math.min(width / image.width, height / image.height);
  const drawWidth = preserveAspect ? image.width * ratio : width;
  const drawHeight = preserveAspect ? image.height * ratio : height;
  texture.context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  texture.refresh();
}
