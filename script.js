let CANVAS, CTX, VIDEO;

// cor do objeto que deseja ativar o efeito
const COLOR = [8, 73, 175];

function main() {
  CANVAS = document.getElementById('myCanvas');
  CTX = CANVAS.getContext('2d');

  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then(function (rawData) {
      VIDEO = document.createElement('video');
      VIDEO.srcObject = rawData;
      VIDEO.play();
      VIDEO.onloadeddata = animateTorchEffect;
    })
    .catch(function (err) {
      alert(err);
    });
}

function animateTorchEffect() {
  CANVAS.width = VIDEO.videoWidth;
  CANVAS.height = VIDEO.videoHeight;
  CTX.drawImage(VIDEO, 0, 0, CANVAS.width, CANVAS.height);

  const locs = [];
  const { data } = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (distance(r, g, b, COLOR) < 150) {
      const x = (i / 4) % CANVAS.width;
      const y = Math.floor(i / 4 / CANVAS.width);
      locs.push({ x, y });
    }
  }

  console.log(locs.length);

  requestAnimationFrame(animateTorchEffect);
}

function distance(v1, v2) {
  return Math.sqrt(
    (v1[0] - v2[0]) * (v1[0] - v1[0]) +
      (v1[1] - v2[1]) * (v1[1] - v1[1]) +
      (v1[2] - v2[2]) * (v1[2] - v1[2])
  );
}
