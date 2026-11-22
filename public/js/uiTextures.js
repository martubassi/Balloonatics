const PANELS = [
  { key: 'ui_panel', fill: '#111e34', border: '#557898' },
  { key: 'ui_button', fill: '#294d70', border: '#8bb2ce' },
  { key: 'ui_key', fill: '#20364f', border: '#668bab' }
];

export function createUiTextures(scene) {
  createKnobTexture(scene);
  PANELS.forEach((panel) => createPanelTexture(scene, panel));
}

function createKnobTexture(scene) {
  const texture = scene.textures.createCanvas('ui_knob', 96, 96);
  const ctx = texture.context;
  const gradient = ctx.createLinearGradient(20, 10, 70, 86);
  gradient.addColorStop(0, '#e1f5ff');
  gradient.addColorStop(0.45, '#8ebbe0');
  gradient.addColorStop(1, '#42678f');

  drawCircle(ctx, 45, '#07162d');
  drawCircle(ctx, 39, '#83a9ca');
  drawCircle(ctx, 34, gradient);
  texture.refresh();
}

function drawCircle(ctx, radius, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(48, 48, radius, 0, Math.PI * 2);
  ctx.fill();
}

function createPanelTexture(scene, { key, fill, border }) {
  const texture = scene.textures.createCanvas(key, 96, 96);
  const ctx = texture.context;

  ctx.fillStyle = '#071020';
  ctx.beginPath();
  ctx.roundRect(0, 0, 96, 96, 14);
  ctx.fill();
  ctx.fillStyle = border;
  ctx.beginPath();
  ctx.roundRect(3, 3, 90, 90, 12);
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(6, 6, 84, 84, 9);
  ctx.fill();

  ctx.fillStyle = '#b0d4e6';
  for (const x of [13, 83]) {
    for (const y of [13, 83]) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  texture.refresh();
}
