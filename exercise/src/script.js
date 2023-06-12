import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// Debugger
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("/textures/Lapis_Lazuli_001_COLOR.jpg");

// Group
const group = new THREE.Object3D();
scene.add(group);

// Creatin all 27 cubes
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
let cubeGroup = new THREE.Object3D();
let cubes = [];
let n = 0;

for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      cubes.push(new THREE.Mesh(geometry, material));
      cubes[n].position.set(x - 1, y - 1, z - 1);
      cubeGroup.add(cubes[n]);
      n++;
    }
  }
}

scene.add(cubeGroup);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 4;
camera.position.z = 8;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

let f = 0;
let sign = 1;
let upper = 25;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animating 27 cubes
  for (var i = 0; i < 27; i++) {
    cubes[i].position.x += sign * 0.02 * Math.sign(cubes[i].position.x);
    cubes[i].position.y += sign * 0.02 * Math.sign(cubes[i].position.y);
    cubes[i].position.z += sign * 0.02 * Math.sign(cubes[i].position.z);
  }
  if (f > upper || f < 0) {
    sign *= -1;
  }
  f += sign / 2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

// Axis helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Debugger controls
// gui.add(cube.position, "y").min(-3).max(3).step(0.01).name("[y] top to bottom");
// gui.add(cube.position, "z").min(-3).max(3).step(0.01).name("[z] far to near");
// gui.add(cube, "visible");
// gui.add(cube.material, "wireframe");
// gui.addColor(cube.material, "color");

// tick();
