// WebGL Starfield/Galaxy Background for maximum compatibility
// Uses global THREE (already loaded in index.html)

(function() {
  // Execute immediately without waiting for DOMContentLoaded
  // This ensures the background is created as early as possible
  
  // Create the container if it doesn't exist
  let container = document.getElementById('starfield-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'starfield-container';
    document.body.insertBefore(container, document.body.firstChild);
  }

  let width = window.innerWidth;
  let height = window.innerHeight;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
  camera.position.z = 1000;

  // Renderer with alpha transparency
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000010, 1); // Solid dark background
  
  // Make sure the canvas is positioned correctly with inline styles
  // This ensures the styles are applied immediately and not affected by CSS loading
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.zIndex = '-9999'; // Far behind everything
  renderer.domElement.style.pointerEvents = 'none'; // Allow clicks to pass through
  
  // Add the canvas to the container
  container.appendChild(renderer.domElement);
  
  // Also set styles on the container itself to ensure it's positioned correctly
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  container.style.background = 'transparent';

  // Starfield parameters
  const starCount = 1800; // More stars for better effect
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

  const material = new THREE.PointsMaterial({
    size: 2.5, // Slightly larger stars
    vertexColors: true,
    transparent: true,
    opacity: 0.9, // Higher opacity for better visibility
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // Animation loop
  function animate() {
    // Rotate the starfield slowly for a galaxy effect
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
})();