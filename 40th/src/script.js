import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

let chevreObj = null;
let lionObj = null;

const gui = new dat.GUI({ width: 300 });
gui.close();
const parameters = {
  lightColor: "#ffffff",
};

gui.addColor(parameters, "lightColor").onChange(changeLightColor);

THREE.ColorManagement.enabled = false;
// const parameters = {
//   materialColor: "#ffeded",
// };
const objectLoader = new GLTFLoader();

/**
 * Base
 */
// Canvas
const canvasChevre = document.querySelector("#canvas-chevre");
fitCanvaToContainer(canvasChevre);

const canvasLion = document.querySelector("#canvas-lion");
fitCanvaToContainer(canvasLion);

function fitCanvaToContainer(canvas) {
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

// fitCanToContainer whenever the screen is resized
// window.addEventListener("resize", () => {
//   fitCanvaToContainer(canvasChevre);
//   fitCanvaToContainer(canvasLion);
// });

// Scene
const scene = new THREE.Scene();
const sceneLion = new THREE.Scene();

/**
 * 3D Object Loader
 */

// CHEVRE
objectLoader.load(
  "objects/chevre.glb",
  function (chevre) {
    chevreObj = chevre.scene;
    chevre.scene.position.y = -1.5;
    chevre.scene.position.x = 0.25;
    scene.add(chevre.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// LION
objectLoader.load(
  "objects/lion.glb",
  function (lion) {
    lionObj = lion.scene;
    lion.scene.position.y = -1.1;
    lion.scene.scale.set(1.3, 1.3, 1.3);
    sceneLion.add(lion.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

/**
 * Light
 */

// const lightColor = new THREE.Color(parameters.lightColor);
function changeLightColor() {
  directionalLight.color.set(parameters.lightColor);
  directionalLight2.color.set(parameters.lightColor);
  directionalLightLion.color.set(parameters.lightColor);
  directionalLight2Lion.color.set(parameters.lightColor);
}

// CHEVRE
const directionalLight = new THREE.DirectionalLight(parameters.lightColor, 2);
directionalLight.position.set(1, 0, 2);

const directionalLight2 = new THREE.DirectionalLight(parameters.lightColor, 2);
directionalLight2.position.set(-1, -1, -5);

// LION
const directionalLightLion = new THREE.DirectionalLight(
  parameters.lightColor,
  2
);
directionalLightLion.position.set(2, 0, 2);

const directionalLight2Lion = new THREE.DirectionalLight(
  parameters.lightColor,
  2
);
directionalLight2Lion.position.set(-1, -1, -5);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLightLion,
//   0.2
// );
// sceneLion.add(directionalLightHelper);

scene.add(directionalLight, directionalLight2);
sceneLion.add(directionalLightLion, directionalLight2Lion);

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

// Group Lion
const cameraGroupLion = new THREE.Group();
scene.add(cameraGroupLion);

// Base camera Lion
const cameraLion = new THREE.PerspectiveCamera(35, 1 / 1, 1, 20);
cameraLion.position.z = 10;
cameraGroup.add(cameraLion);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvasChevre);
controls.enableDamping = true;

const controlsLion = new OrbitControls(cameraLion, canvasLion);
controlsLion.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvasChevre,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const rendererLion = new THREE.WebGLRenderer({
  canvas: canvasLion,
  alpha: true,
});
rendererLion.outputColorSpace = THREE.LinearSRGBColorSpace;
rendererLion.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Lion animation
  if (lionObj) {
    lionObj.rotation.y = elapsedTime * 0.2;
  }

  // Chevre animation
  if (chevreObj) {
    chevreObj.rotation.y = elapsedTime * 0.2;
  }

  // Render
  renderer.render(scene, camera);
  rendererLion.render(sceneLion, cameraLion);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
