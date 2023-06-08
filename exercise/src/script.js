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

// Group
const group = new THREE.Object3D();
scene.add(group);

let cube;
let positionX = 0;
for (let i = 0; i < 27; i++) {
  cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "#fff" })
  );

  // First stage of cube [from bottom to top]
  //
  if (i >= 0 && i < 2) {
    positionX += 1;
    cube.position.x += positionX;
  }

  if (i >= 2 && i < 5) {
    positionX += -1;
    cube.position.x += positionX + 1;
    cube.position.z += 1;
  }

  if (i >= 5 && i < 8) {
    positionX += 1;
    cube.position.x += positionX;
    cube.position.z += 2;
  }

  // Second stage of cube
  //
  if (i >= 8 && i < 11) {
    positionX += 1;
    cube.position.x += positionX - 3;
    cube.position.y += 1;
  }

  if (i >= 11 && i < 14) {
    positionX += -1;
    cube.position.x += positionX - 2;
    cube.position.z += 1;
    cube.position.y += 1;
  }

  if (i >= 14 && i < 17) {
    positionX += 1;
    cube.position.x += positionX - 3;
    cube.position.z += 2;
    cube.position.y += 1;
  }

  // Third and last stage of cube
  //

  if (i >= 17 && i < 20) {
    positionX += 1;
    cube.position.x += positionX - 6;
    cube.position.y += 2;
  }

  if (i >= 20 && i < 23) {
    positionX += -1;
    cube.position.x += positionX - 5;
    cube.position.z += 1;
    cube.position.y += 2;
  }

  if (i >= 23 && i < 26) {
    positionX += 1;
    cube.position.x += positionX - 6;
    cube.position.z += 2;
    cube.position.y += 2;
  }

  cube.material.wireframe = true;
  group.add(cube);
  scene.add(cube);
}

// Debugger controls
// gui.add(cube.position, "x").min(-3).max(3).step(0.01).name("[x] side to side");
// gui.add(cube.position, "y").min(-3).max(3).step(0.01).name("[y] top to bottom");
// gui.add(cube.position, "z").min(-3).max(3).step(0.01).name("[z] far to near");
// gui.add(cube, "visible");
// gui.add(cube.material, "wireframe");
// gui.addColor(cube.material, "color");

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

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

tick();
