// WebGL Starfield/Galaxy Background
// Uses global THREE (already loaded in index.html)

window.addEventListener('DOMContentLoaded', function() {
  // Get the container
  const container = document.getElementById('starfield-container');
  if (!container) {
    console.error('Starfield container not found');
    return;
  }

  // Clear any existing content
  container.innerHTML = '';

  // Set up dimensions
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
  camera.position.z = 1000;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000010, 1); // Dark blue background
  
  // Apply inline styles to ensure it works on mobile
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.zIndex = '-999';
  renderer.domElement.style.pointerEvents = 'none';
  
  container.appendChild(renderer.domElement);

  // Starfield parameters
  const starCount = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const color = new THREE.Color();

  for (let i = 0; i < starCount; i++) {
    // Random position in a sphere
    const r = 900 * Math.pow(Math.random(), 0.7);
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions.push(x, y, z);
    
    // Color: mostly white, some blue/purple
    color.setHSL(0.6 + 0.2 * Math.random(), 0.7, 0.7 + 0.3 * Math.random());
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // Create a circular texture for high-quality stars
  function createCircleTexture(size = 64) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'white';
      ctx.shadowBlur = size / 6;
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
  }

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    map: createCircleTexture(64),
    alphaTest: 0.01
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // Animation loop
  function animate() {
    stars.rotation.y += 0.0007;
    stars.rotation.x += 0.0002;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  
  // Force a background color on the body to ensure proper rendering on mobile
  document.body.style.backgroundColor = '#000010';
});