import { GAME_WIDTH, GAME_HEIGHT, FLOOR_TOP, PLATFORM_HEIGHT, CENTER_WALL_WIDTH } from './config.js';

export const ARENA_STYLE = {
  clasico: { accent: 0xffdd75, backgroundShade: 0.56 },
  torres: { accent: 0xe9c9ff, backgroundShade: 0.58 },
  piramide: { accent: 0xb4ffb5, backgroundShade: 0.60 }
};

export function platformSliceLayout(sourceWidth, sourceHeight, width, height) {
  const sourceCap = Math.round(sourceHeight / 2);
  const ratio = height / sourceHeight;
  return {
    sourceCap, ratio, capWidth: sourceCap * ratio,
    middleWidth: Math.max(0, width - 2 * sourceCap * ratio),
    tileWidth: (sourceWidth - 2 * sourceCap) * ratio
  };
}

export function preparePlatformFrames(scene, id) {
  const texture = scene.textures.get(`art_platform_${id}`);
  const image = texture.getSourceImage();
  const cap = Math.round(image.height / 2);
  texture.add('left', 0, 0, 0, cap, image.height);
  texture.add('middle', 0, cap, 0, image.width - 2 * cap, image.height);
  texture.add('right', 0, image.width - cap, 0, cap, image.height);
}

export function drawArenaBackground(scene, map, width = GAME_WIDTH, height = GAME_HEIGHT, cx = GAME_WIDTH / 2, cy = GAME_HEIGHT / 2) {
  scene.add.image(cx, cy, `art_background_${map.id}`).setDisplaySize(width, height);
  scene.add.rectangle(cx, cy, width, height, 0x081120, ARENA_STYLE[map.id].backgroundShade);
}

export function drawDivider(scene) {
  const x = GAME_WIDTH / 2;
  const g = scene.add.graphics();
  g.fillStyle(0x040c19, 0.9).fillRect(x - 12, 0, 24, FLOOR_TOP);
  g.fillStyle(0x55d9ee, 0.13).fillRect(x - 24, 0, 48, FLOOR_TOP);
  g.fillStyle(0xb3f5ff, 0.9).fillRect(x - CENTER_WALL_WIDTH / 2, 0, 3, FLOOR_TOP);
  g.fillRect(x + CENTER_WALL_WIDTH / 2 - 3, 0, 3, FLOOR_TOP);
  for (let y = 18; y < FLOOR_TOP; y += 42) {
    g.fillStyle(0x67dceb, 0.8).fillRect(x - 3, y, 6, 22);
  }
  for (const y of [10, FLOOR_TOP - 10]) {
    g.fillStyle(0x122940, 1).fillRoundedRect(x - 29, y - 10, 58, 20, 5);
    g.lineStyle(2, 0x8eacbe, 1).strokeRoundedRect(x - 29, y - 10, 58, 20, 5);
  }
}

export function drawPlatform(scene, mapId, x, top, width, scale = 1) {
  const h = PLATFORM_HEIGHT * scale;
  const color = ARENA_STYLE[mapId].accent;
  const g = scene.add.graphics();
  g.fillStyle(0x020915, 0.96).fillRoundedRect(x - width / 2 - 5 * scale, top - 3 * scale,
    width + 10 * scale, h + 12 * scale, 7 * scale);
  const textureKey = `art_platform_${mapId}`;
  const source = scene.textures.get(textureKey).getSourceImage();
  const layout = platformSliceLayout(source.width, source.height, width, h);
  scene.add.image(x - width / 2, top + h / 2, textureKey, 'left')
    .setOrigin(0, 0.5).setScale(layout.ratio);
  if (layout.middleWidth > 0) {
    scene.add.tileSprite(x, top + h / 2, layout.middleWidth, h, textureKey, 'middle')
      .setTileScale(layout.ratio);
  }
  scene.add.image(x + width / 2, top + h / 2, textureKey, 'right')
    .setOrigin(1, 0.5).setScale(layout.ratio);
  const edge = scene.add.graphics();
  edge.lineStyle(Math.max(2, 3 * scale), color, 1);
  edge.lineBetween(x - width / 2 + 8 * scale, top, x + width / 2 - 8 * scale, top);
}
