export const FONT_DISPLAY = 'Tektur, "Arial Black", sans-serif';

export async function loadDisplayFont(fonts = document.fonts) {
  if (!fonts) return;
  // Phaser dibuja el texto en texturas; la fuente debe estar cargada antes.
  try {
    await Promise.race([
      fonts.load('700 48px Tektur', 'Balloonatics ÁÉÍÓÚ áéíóú ñ ¡¿ 0123456789'),
      new Promise((resolve) => setTimeout(resolve, 4000))
    ]);
  } catch (error) {
    console.warn('Tektur no disponible; se usará la fuente alternativa.', error);
  }
}
