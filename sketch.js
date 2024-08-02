// INSPIRACIÓN //
// He creado un filtro para la webcam inspirado en los efectos de imagen retro tipo VHS y glitch;
// 1 | He desplazado la capa R de la imagen;
// 2 | He añadido una viñeta que oscure los bordes de la imagen;
// 3 | He creado un efecto de ruido que hace que el contenido RGB de los píxeles varíe ligeramente;
// 4 | Al pasar el cursor sobre la imagen, ésta se muestra en su estado original;

let capture;

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
}

function draw() {
  background(0);

  capture.loadPixels();

  // Calculo la posición del cursor;
  let centerX = mouseX;
  let centerY = mouseY;

  // Recorro la matriz de la imagen capturada;
  for (let y = 0; y < capture.height; y++) {
    for (let x = 0; x < capture.width; x++) {
      let index = (x + y * capture.width) * 4;

      // Calculo la distancia de los píxeles a la posición del cursor;
      let d = dist(x, y, centerX, centerY);

      if (d < 100) {

        // Si la distancia es menor que 100px, muestro el píxel original;
        capture.pixels[index + 0] = capture.pixels[index + 0]; // R
        capture.pixels[index + 1] = capture.pixels[index + 1]; // G
        capture.pixels[index + 2] = capture.pixels[index + 2]; // B

      } else {

        // Si la distancia es mayor o igual a 100px, aplico los efectos de VHS y glitch;

        // Desplazamiento del canal R;
        let offset = 15;
        let displacedR = ((x + offset) + y * capture.width) * 4;
        capture.pixels[index + 0] = capture.pixels[displacedR + 0]; // R

        // Ruido de la imagen;
        let noiseVal = random(-30, 30);
        capture.pixels[index + 0] += noiseVal; // R
        capture.pixels[index + 1] += noiseVal; // G
        capture.pixels[index + 2] += noiseVal; // B

        // Limito los valores a un rango válido (0-255);
        capture.pixels[index + 0] = constrain(capture.pixels[index + 0], 0, 255);
        capture.pixels[index + 1] = constrain(capture.pixels[index + 1], 0, 255);
        capture.pixels[index + 2] = constrain(capture.pixels[index + 2], 0, 255);
      }
    }
  }

  capture.updatePixels();

  image(capture, 0, 0, width, height);

  // Aplico la viñeta;
  applyVignette();
}

// Función para crear la viñeta;
function applyVignette() {
  // Calculo la distancia del centro de cada píxel;
  loadPixels();
  let centerX = width / 2;
  let centerY = height / 2;
  let maxDist = dist(0, 0, centerX + width / 4, centerY + height / 4);

  // Aplico la viñeta en los bordes de la imagen;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let d = dist(x, y, centerX, centerY);
      let borderVignette = map(d, 0, maxDist, 1, 0);
      let index = (x + y * width) * 4;

      pixels[index + 0] *= borderVignette;
      pixels[index + 1] *= borderVignette;
      pixels[index + 2] *= borderVignette;
    }
  }

  updatePixels();
}