const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require(require.resolve('sharp', { paths: [process.env.NODE_REPL_NODE_MODULE_DIRS || '.', '.'] }));

const source = path.resolve('imagenes');
const target = path.resolve('public/assets');

async function main() {
  const { ASSETS } = await import('../public/js/assets.js');
  await fs.mkdir(target, { recursive: true });
  await exportImages(new Set(Object.values(ASSETS)));
  await exportHearts();
  await exportPlayers();
  await sharp(path.resolve('imagenes-GDD/logotipo.png'))
    .trim({ threshold: 10 }).png().toFile(path.join(target, 'logo.png'));
  console.log('Arte preparado en public/assets');
}

async function exportImages(runtimeFiles) {
  for (const file of await fs.readdir(source)) {
    if (!/\.(png|webp)$/i.test(file)) continue;
    const key = path.parse(file).name;
    if (!runtimeFiles.has(key)) continue;

    const input = path.join(source, file);
    const output = path.join(target, `${key}.png`);
    if (key.startsWith('balloonatics_fondo')) {
      await fs.copyFile(input, output);
    } else if (!['Marcos_UI', 'Vidas'].includes(key)) {
      await sharp(input).trim({ threshold: 10 }).png().toFile(output);
    }
  }
}

async function exportHearts() {
  const input = path.join(source, 'Vidas.webp');
  const { width, height } = await sharp(input).metadata();
  const players = ['pip', 'beto'];
  const states = ['full', 'half', 'empty'];

  for (let row = 0; row < players.length; row++) {
    for (let col = 0; col < states.length; col++) {
      const left = Math.round(col * width / 3);
      const top = Math.round(row * height / 2);
      const crop = await sharp(input).extract({
        left, top,
        width: Math.round((col + 1) * width / 3) - left,
        height: Math.round((row + 1) * height / 2) - top
      }).png().toBuffer();
      const output = `heart_${players[row]}_${states[col]}.png`;
      await sharp(crop).trim({ threshold: 10 }).png().toFile(path.join(target, output));
    }
  }
}

async function exportPlayers() {
  for (const name of ['pip', 'beto']) {
    const input = path.join(source, 'personajes', `${name}.svg`);
    await sharp(input, { density: 576 })
      .resize(512, 768).png().toFile(path.join(target, `${name}.png`));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
