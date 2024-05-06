import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();
/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;

      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1;
gui
  .add(global, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

// HDR (RGBE) equirectangular
rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Directional light
 */
const directionLight = new THREE.DirectionalLight("#ffffff", 6);
directionLight.position.set(-10, 10, 5);
scene.add(directionLight);

gui
  .add(directionLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");

gui
  .add(directionLight.position, "x")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("lightX");

gui
  .add(directionLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("lightY");

gui
  .add(directionLight.position, "z")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("lightZ");

// Light shadows
directionLight.castShadow = true;
directionLight.shadow.camera.far = 15;
directionLight.shadow.mapSize.set(512, 512);

// Light helper
const directionLightHelper = new THREE.CameraHelper(
  directionLight.shadow.camera
);
scene.add(directionLightHelper);

// Light target
directionLight.target.position.set(0, 4, 0);
directionLight.target.updateMatrixWorld();

/**
 * Models
 */
// Helmet
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Objects
 */

// Textures
const floorTextureDiff = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg"
);
floorTextureDiff.colorSpace = THREE.SRGBColorSpace;
const floorTextureNormal = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png"
);
const floorTextureARM = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg"
);

const wallTextureDiff = textureLoader.load(
  "/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg"
);
wallTextureDiff.colorSpace = THREE.SRGBColorSpace;
const wallTextureNormal = textureLoader.load(
  "/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png"
);
const wallTextureARM = textureLoader.load(
  "/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg"
);

// Floor
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorTextureDiff,
  normalMap: floorTextureNormal,
  aoMap: floorTextureARM,
  roughnessMap: floorTextureARM,
  metalnessMap: floorTextureARM,
});
const floorGeometry = new THREE.PlaneGeometry(8, 8);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Backwall
const backwallMaterial = new THREE.MeshStandardMaterial({
  map: wallTextureDiff,
  normalMap: wallTextureNormal,
  aoMap: wallTextureARM,
  roughnessMap: wallTextureARM,
  metalnessMap: wallTextureARM,
});
const backwallGeometry = new THREE.PlaneGeometry(8, 8);
const backwall = new THREE.Mesh(backwallGeometry, backwallMaterial);
backwall.position.z = -2.5;
backwall.position.y = 2.5;
scene.add(backwall);

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2;

gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.0001);

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
