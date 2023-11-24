import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

THREE.ColorManagement.enabled = false;
const parameters = {
  materialColor: "#ffeded",
};
const objectLoader = new GLTFLoader();

/**
 * Base
 */
// Canvas
const canvasChevre = document.querySelector("#canvas-chevre");
fitCanvaToContainer(canvasChevre);

function fitCanvaToContainer(canvas) {
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvasChevre.offsetWidth;
  canvas.height = canvasChevre.offsetHeight;
}

// Scene
const scene = new THREE.Scene();

// 3D Object Loader
objectLoader.load(
  "objects/chevre.glb",
  function (chevre) {
    // console.log(chevre.scene);
    chevre.scene.position.y = -1.5;
    chevre.scene.position.x = 0.25;
    // chevre.scene.scale.set(0.5, 0.5, 0.5);
    scene.add(chevre.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(1, 0, 2);

const directionalLight2 = new THREE.DirectionalLight("#ffffff", 2);
directionalLight2.position.set(-1, -1, -5);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight2,
//   0.2
// );
// scene.add(directionalLightHelper);

scene.add(directionalLight, directionalLight2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */

// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(35, 1 / 1, 1, 20);
camera.position.z = 10;
cameraGroup.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvasChevre);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvasChevre,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
// renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
