import * as THREE from "three";

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
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry();
const count = 250;

const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

for (
  let i = 0;
  i < count * 3;
  i++ // Multiply by 3 for same reason
) {
  positions[i] = (Math.random() - 0.5) * 2; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
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
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

/**
 * Mouse move
 */
document.addEventListener("mousemove", animateParticles);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
