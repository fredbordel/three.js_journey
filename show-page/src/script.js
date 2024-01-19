import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const objectLoader = new GLTFLoader();
let chevreObj = null;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Resize
 */
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
scene.add(camera);

/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

/**
 * Geometry
 */
objectLoader.load(
  "objects/chevre.glb",
  function (chevre) {
    chevreObj = chevre.scene;
    chevreObj.scale.set(1.5, 1.5, 1.5);
    chevreObj.position.x = 0;
    chevreObj.position.y = -1.5;
    scene.add(chevreObj);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
ambientLight.position.set(0, 0, 3);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight("#D06541", 8, 10, Math.PI * 0.12, 0.2, 5);

const spotLight2 = new THREE.SpotLight(
  "#FFFFFF",
  8,
  10,
  Math.PI * 0.12,
  0.2,
  5
);

const spotLight3 = new THREE.SpotLight(
  "#960905",
  8,
  10,
  Math.PI * 0.12,
  0.2,
  5
);

spotLight.position.set(3, 0, 3);
spotLight2.position.set(0, 3, 3);
spotLight3.position.set(-3, 0, 3);

spotLight.visible = false;
spotLight2.visible = false;
spotLight3.visible = false;

scene.add(spotLight);
scene.add(spotLight2);
scene.add(spotLight3);

// ADD SPOTLIGHT helper
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

/**
 * Reveal on scroll
 */

let hasScrolledTo90Percent = false;

window.addEventListener("scroll", () => {
  let scrollHeight = document.documentElement.scrollHeight;
  let scrollTop = document.documentElement.scrollTop;
  let clientHeight = document.documentElement.clientHeight;
  let scrolledPercentage = (scrollTop + clientHeight) / scrollHeight;

  if (!hasScrolledTo90Percent) {
    if (scrolledPercentage > 0.9) {
      hasScrolledTo90Percent = true;

      spotLight.visible = true;
      spotLight2.visible = true;
      spotLight3.visible = true;

      ambientLight.intensity = 0.5;

      document.getElementById("site").style.pointerEvents = "none";

      if (chevreObj) chevreObj.scale.set(1, 1, 1);
    }
  } else if (hasScrolledTo90Percent && scrolledPercentage < 0.9) {
    hasScrolledTo90Percent = false;
    spotLight.visible = false;
    spotLight2.visible = false;
    spotLight3.visible = false;
    chevreObj.scale.set(1.5, 1.5, 1.5);
    ambientLight.intensity = 0.05;
    document.getElementById("site").style.pointerEvents = "auto";
  }
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
let direction = 1;

Math.clamp = function (num, min, max) {
  return num <= min ? min : num >= max ? max : num;
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate chevreObj position
  if (chevreObj) {
    chevreObj.rotation.y = elapsedTime * 0.02;

    if (chevreObj.rotation.x > 0.2) {
      direction = -1;
    } else if (chevreObj.rotation.x < -0.2) {
      direction = 1;
    }

    chevreObj.rotation.x += deltaTime * 0.01 * direction;
  }

  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
