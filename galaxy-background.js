import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import * as Nodes from 'three/tsl';

// Container for the background
const container = document.getElementById('starfield-container');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1.5;

// WebGPU Renderer
const renderer = new WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000010, 1);
container.appendChild(renderer.domElement);

// Galaxy shader using TSL (Three.js Shading Language)
// This is a simplified version for demo purposes
const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    float star = smoothstep(0.995, 1.0, fract(sin(dot(vUv * 1000.0, vec2(12.9898,78.233))) * 43758.5453));
    float glow = 0.02 / length(vUv - 0.5);
    float galaxy = pow(glow, 1.5) * 0.6;
    float twinkle = 0.5 + 0.5 * sin(uTime + vUv.x * 40.0 + vUv.y * 40.0);
    gl_FragColor = vec4(vec3(star * twinkle + galaxy), 1.0);
  }
`;

const uniforms = {
  uTime: { value: 0 }
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  depthWrite: false,
  depthTest: false
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation loop
function animate(time) {
  uniforms.uTime.value = time * 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Responsive resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}); 