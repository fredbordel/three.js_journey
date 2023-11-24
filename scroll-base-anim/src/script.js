import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

THREE.ColorManagement.enabled = false;
const parameters = {
  materialColor: "#ffeded",
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
const moonColorTexture = textureLoader.load("textures/moon_color_texture.jpg");
const moonDisplacementTexture = textureLoader.load(
  "textures/moon_displacement_texture.jpg"
);
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const objectsDistance = 4;
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(0.8, 0.2, 14, 45),
  material
);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1, 30), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.5, 0.2, 80, 10),
  material
);

mesh1.position.y = -objectsDistance * 1;
mesh2.position.y = -objectsDistance * 2;
mesh3.position.y = -objectsDistance * 3;

mesh1.position.x = 2;
mesh2.position.x = 2;
mesh3.position.x = 2;

const moonGeometry = new THREE.SphereGeometry(0.6, 20, 20);

const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: moonColorTexture,
  moonDisplacementTexture: moonDisplacementTexture,
  displacementScale: 0.06,
  bumpMap: moonDisplacementTexture,
  bumpScale: 0.04,
  reflectivity: 0,
  shininess: 0,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = -2;
moon.position.y = 0.63;
moon.position.z = 5;
scene.add(moon);

const sectionMeshes = [mesh1];

/**
 * Particles
 */
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.4 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.2);
directionalLight.position.set(0, 1, 6);

const sunLight = new THREE.DirectionalLight("#ffffff", 1.5);
sunLight.position.set(0.2, 0.71, 4.5);
sunLight.target = moon;

scene.add(sunLight, sunLight.target, directionalLight);

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
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);
  if (newSection !== currentSection) {
    currentSection = newSection;
    gsap.to(sectionMeshes[currentSection]?.rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=06",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Moon animtation
  if (moon.position.x >= -0.02) {
    moon.position.x = moon.position.x;
  } else if (moon.position.x >= -0.5) {
    moon.position.x += 0.0015;
  } else {
    moon.position.x += 0.002;
  }

  moon.rotation.y += 0.0005;
  moon.rotation.x += 0.0009;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
