console.log("Script file loaded - Version 20241220");
console.log("User Agent:", navigator.userAgent);
console.log("Screen size:", window.innerWidth, "x", window.innerHeight);
console.log("Three.js available:", typeof THREE !== 'undefined');
console.log("WebGL supported:", !!document.createElement('canvas').getContext('webgl'));

// 3D Starfield Class
class Starfield {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stars = [];
        this.shootingStars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Mobile detection and optimization
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        
        // Adjust settings for mobile
        this.starCount = this.isMobile ? 8000 : 20000;
        this.twinkleSpeed = this.isMobile ? 0.5 : 1.0;
        this.shootingStarFrequency = this.isMobile ? 5.0 : 3.0;
        this.mouseSensitivity = this.isMobile ? 0.3 : 0.5;
        this.starColor = 0xffffff;
        this.lastShootingStarTime = 0;
        this.clock = new THREE.Clock();
        this.fpsCounter = 0;
        this.lastFpsUpdate = 0;
        
        console.log('Starfield initialized:', {
            isMobile: this.isMobile,
            starCount: this.starCount,
            twinkleSpeed: this.twinkleSpeed
        });
        
        this.init();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 50;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: !this.isMobile, // Disable antialiasing on mobile for performance
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // Add error handling for WebGL support
        try {
            document.getElementById('starfield-container').appendChild(this.renderer.domElement);
            console.log('WebGL renderer created successfully');
        } catch (error) {
            console.error('Failed to create WebGL renderer:', error);
            this.createFallbackBackground();
            return;
        }
        
        // Create stars
        this.createStars();
        
        // Mouse event listeners
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Touch event listeners for mobile
        document.addEventListener('touchmove', (event) => {
            if (this.isMobile) {
                event.preventDefault();
                const touch = event.touches[0];
                this.mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        // Add touchstart for mobile
        document.addEventListener('touchstart', (event) => {
            if (this.isMobile) {
                const touch = event.touches[0];
                this.mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createFallbackBackground() {
        console.log('Creating fallback background for devices without WebGL support');
        const container = document.getElementById('starfield-container');
        if (container) {
            container.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)';
            container.innerHTML = `
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; text-align: center; opacity: 0.3;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">⭐</div>
                        <div style="font-size: 0.9rem;">Pokémon Trainer Hub</div>
                    </div>
                </div>
            `;
        }
    }

    createStars() {
        // Clear existing stars
        this.stars.forEach(star => this.scene.remove(star));
        this.stars = [];
        
        // Create star geometry with BufferGeometry for performance
        const starGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const opacities = [];
        const twinklePhases = [];
        const starTypes = [];
        
        for (let i = 0; i < this.starCount; i++) {
            // Random position in 3D space
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            
            positions.push(x, y, z);
            
            // Enhanced color variation with more realistic star colors
            const colorVariation = Math.random();
            let r, g, b;
            let starType = 0; // 0=white, 1=blue, 2=yellow, 3=red
            
            if (colorVariation < 0.75) {
                // White stars (75%)
                r = g = b = 1.0;
                starType = 0;
            } else if (colorVariation < 0.85) {
                // Blue stars (10%)
                r = 0.7; g = 0.8; b = 1.0;
                starType = 1;
            } else if (colorVariation < 0.95) {
                // Yellow stars (10%)
                r = 1.0; g = 1.0; b = 0.7;
                starType = 2;
            } else {
                // Red stars (5%)
                r = 1.0; g = 0.7; b = 0.7;
                starType = 3;
            }
            
            colors.push(r, g, b);
            
            // Size with distance falloff (stars further away are smaller)
            const distance = Math.sqrt(x*x + y*y + z*z);
            const baseSize = Math.random() * 2.0 + 0.5;
            const distanceFalloff = Math.max(0.3, 1.0 - distance / 1000);
            const size = baseSize * distanceFalloff;
            sizes.push(size);
            
            // Random initial opacity
            opacities.push(Math.random() * 0.5 + 0.5);
            
            // Random twinkling phase for each star
            twinklePhases.push(Math.random() * Math.PI * 2);
            
            // Star type for shader
            starTypes.push(starType);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        starGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));
        starGeometry.setAttribute('twinklePhase', new THREE.Float32BufferAttribute(twinklePhases, 1));
        starGeometry.setAttribute('starType', new THREE.Float32BufferAttribute(starTypes, 1));
        
        // Create custom shader material for realistic star rendering
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                twinkleSpeed: { value: this.twinkleSpeed },
                pixelRatio: { value: window.devicePixelRatio || 1 }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                attribute float twinklePhase;
                attribute float starType;
                varying float vOpacity;
                varying vec3 vColor;
                varying float vTwinklePhase;
                varying float vStarType;
                varying float vDistance;
                
                void main() {
                    vOpacity = opacity;
                    vColor = color;
                    vTwinklePhase = twinklePhase;
                    vStarType = starType;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vDistance = length(mvPosition.xyz);
                    
                    // Size attenuation with distance
                    float pointSize = size * (300.0 / -mvPosition.z);
                    
                    // Ensure minimum size for visibility
                    pointSize = max(pointSize, 1.0);
                    
                    gl_PointSize = pointSize;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float twinkleSpeed;
                uniform float pixelRatio;
                varying float vOpacity;
                varying vec3 vColor;
                varying float vTwinklePhase;
                varying float vStarType;
                varying float vDistance;
                
                void main() {
                    // Calculate distance from center of point
                    vec2 center = vec2(0.5, 0.5);
                    float dist = length(gl_PointCoord - center);
                    
                    // Create smooth circular star shape
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    
                    // Add star spikes for different star types
                    float spikes = 0.0;
                    if (vStarType > 0.5) {
                        // Create star spikes
                        float angle = atan(gl_PointCoord.y - 0.5, gl_PointCoord.x - 0.5);
                        float spike = sin(angle * 4.0) * 0.1;
                        spikes = max(0.0, spike);
                    }
                    
                    // Twinkling effect with individual phase
                    float twinkle = sin(time * twinkleSpeed + vTwinklePhase) * 0.3 + 0.7;
                    twinkle += sin(time * twinkleSpeed * 0.5 + vTwinklePhase * 2.0) * 0.2;
                    
                    // Add subtle pulsing
                    float pulse = sin(time * 0.5 + vTwinklePhase) * 0.1 + 0.9;
                    
                    // Combine effects
                    float finalAlpha = alpha * vOpacity * twinkle * pulse + spikes;
                    
                    // Add glow effect
                    float glow = 1.0 - smoothstep(0.0, 0.8, dist);
                    glow *= 0.3;
                    
                    // Final color with glow
                    vec3 finalColor = vColor + glow * vColor;
                    
                    // Discard transparent pixels
                    if (finalAlpha < 0.01) {
                        discard;
                    }
                    
                    gl_FragColor = vec4(finalColor, finalAlpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true
        });
        
        const starSystem = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starSystem);
        this.stars.push(starSystem);
    }

    createShootingStar() {
        const startX = (Math.random() - 0.5) * 1000;
        const startY = (Math.random() - 0.5) * 1000;
        const startZ = (Math.random() - 0.5) * 1000;
        
        // Create longer, more dramatic trails
        const length = Math.random() * 300 + 200;
        const angle = Math.random() * Math.PI * 2;
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        const endZ = startZ + (Math.random() - 0.5) * 100;
        
        // Create multiple points for a smoother trail
        const points = [];
        const segments = 20;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            const z = startZ + (endZ - startZ) * t;
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create gradient material for the trail
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying float vDistance;
                void main() {
                    vDistance = position.z;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying float vDistance;
                void main() {
                    // Create gradient trail effect
                    float alpha = 1.0 - vDistance;
                    alpha = smoothstep(0.0, 1.0, alpha);
                    
                    // Add twinkling to the trail
                    float twinkle = sin(time * 10.0 + vDistance * 10.0) * 0.3 + 0.7;
                    
                    // White to blue gradient
                    vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.5, 0.8, 1.0), vDistance);
                    
                    gl_FragColor = vec4(color, alpha * twinkle);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        
        const shootingStar = {
            line: line,
            opacity: 1.0,
            fadeSpeed: 0.015,
            material: material,
            startTime: this.clock.getElapsedTime()
        };
        
        this.shootingStars.push(shootingStar);
        
        // Remove shooting star after animation
        setTimeout(() => {
            this.scene.remove(line);
            const index = this.shootingStars.indexOf(shootingStar);
            if (index > -1) {
                this.shootingStars.splice(index, 1);
            }
        }, 3000);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Update star twinkling
        this.stars.forEach(star => {
            star.material.uniforms.time.value = time;
        });
        
        // Update shooting stars
        this.shootingStars.forEach(shootingStar => {
            shootingStar.opacity -= shootingStar.fadeSpeed;
            shootingStar.line.material.opacity = shootingStar.opacity;
            
            // Update shader time for trail effects
            if (shootingStar.material && shootingStar.material.uniforms) {
                shootingStar.material.uniforms.time.value = time;
            }
        });
        
        // Create new shooting stars
        if (time - this.lastShootingStarTime > this.shootingStarFrequency) {
            this.createShootingStar();
            this.lastShootingStarTime = time;
        }
        
        // Mouse parallax effect
        this.camera.position.x += (this.mouseX * 10 * this.mouseSensitivity - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouseY * 10 * this.mouseSensitivity - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize starfield when page loads
let starfield;
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing...");
    
    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const cardsGrid = document.getElementById('cards-grid');
    
    console.log("Found tab buttons:", tabBtns.length);
    console.log("Found tab contents:", tabContents.length);
    console.log("Found cards grid:", cardsGrid ? "yes" : "no");

    // Tab switching functionality
    tabBtns.forEach(btn => {
        console.log("Adding event listeners to button:", btn.textContent.trim());
        
        // Click event
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            console.log('Tab clicked:', targetTab);
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-content`);
            console.log('Target content element:', targetContent);
            
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Content activated:', targetTab);
            } else {
                console.error('Target content not found:', `${targetTab}-content`);
            }
            
            // Load cards if switching to cards tab
            if (targetTab === 'cards') {
                console.log('Cards tab activated (click)');
                loadCards();
            }
        });
        
        // Touch event for mobile
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent double-firing with click
            const targetTab = btn.getAttribute('data-tab');
            console.log('Tab touched:', targetTab);
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-content`);
            console.log('Target content element (touch):', targetContent);
            
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Content activated (touch):', targetTab);
            } else {
                console.error('Target content not found (touch):', `${targetTab}-content`);
            }
            
            if (targetTab === 'cards') {
                console.log('Cards tab activated (touch)');
                loadCards();
            }
        });
    });

    // Card loading functionality
    async function loadCards() {
        console.log('loadCards() function called');
        
        // Show loading state
        if (cardsGrid) {
            cardsGrid.innerHTML = '<div class="loading">Loading your Pokémon cards...</div>';
            console.log('Loading message displayed');
        } else {
            console.error('cardsGrid element not found');
            return;
        }
        
        try {
            console.log('Fetching cards.json...');
            const response = await fetch('cards.json');
            console.log('Fetch response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Failed to load cards: ${response.status}`);
            }
            
            const cards = await response.json();
            console.log('Cards loaded:', cards.length, 'cards');
            displayCards(cards);
        } catch (error) {
            console.error('Error loading cards:', error);
            if (cardsGrid) {
                cardsGrid.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px; color: var(--pokeball-red);"></i>
                        <p>Failed to load cards. Error: ${error.message}</p>
                    </div>
                `;
            }
        }
    }

    function displayCards(cards) {
        console.log('displayCards() called with:', cards.length, 'cards');
        
        if (!cards || cards.length === 0) {
            console.log('No cards to display');
            if (cardsGrid) {
                cardsGrid.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <i class="fas fa-cards-blank" style="font-size: 2rem; margin-bottom: 15px; color: var(--pokeball-red);"></i>
                        <p>No cards found. Add some cards to your cards.json file!</p>
                    </div>
                `;
            }
            return;
        }
        
        const cardsHTML = cards.map(card => `
            <div class="card-item">
                <img src="${card.image}" alt="${card.name}" class="card-image" onerror="this.src='assets/card-placeholder.jpg'">
                <div class="card-info">
                    <h3 class="card-name">${card.name}</h3>
                    <span class="card-rarity rarity-${card.rarity.toLowerCase()}">${card.rarity}</span>
                </div>
            </div>
        `).join('');
        
        if (cardsGrid) {
            cardsGrid.innerHTML = cardsHTML;
            console.log('Cards HTML inserted into grid');
        } else {
            console.error('cardsGrid element not found in displayCards');
        }
    }

    // Profile image fallback
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        profileImage.addEventListener('error', function() {
            this.src = 'assets/default-profile.jpg';
        });
    }

    console.log("Initialization complete");
});

// Smooth scroll for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Initialize 3D Starfield with retry logic
    function initStarfield() {
        try {
            // Check if Three.js is loaded
            if (typeof THREE === 'undefined') {
                console.log('Three.js not loaded yet, waiting...');
                setTimeout(initStarfield, 100); // Retry in 100ms
                return;
            }
            
            console.log('Three.js loaded, initializing starfield...');
            starfield = new Starfield();
            console.log('3D Starfield initialized successfully');
        } catch (error) {
            console.error('Failed to initialize 3D Starfield:', error);
            // Create fallback background on error
            const container = document.getElementById('starfield-container');
            if (container) {
                container.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)';
            }
        }
    }
    
    // Start initialization
    initStarfield();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animation to profile section
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.style.opacity = '0';
        profileSection.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            profileSection.style.transition = 'all 0.8s ease';
            profileSection.style.opacity = '1';
            profileSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Add hover effects to cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe card items when they're added
    const cardsContainer = document.getElementById('cards-content');
    if (cardsContainer) {
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('card-item')) {
                        node.style.opacity = '0';
                        node.style.transform = 'translateY(20px)';
                        node.style.transition = 'all 0.6s ease';
                        observer.observe(node);
                    }
                });
            });
        });
        
        mutationObserver.observe(cardsContainer, {
            childList: true,
            subtree: true
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Tab switching with arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tab-btn.active');
        const currentIndex = Array.from(tabBtns).indexOf(activeTab);
        let newIndex;
        
        if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabBtns.length - 1;
        } else {
            newIndex = currentIndex < tabBtns.length - 1 ? currentIndex + 1 : 0;
        }
        
        tabBtns[newIndex].click();
    }
    
    // Theme toggle with 't' key
    if (e.key === 't' || e.key === 'T') {
        themeBtn.click();
    }
});

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const activeTab = document.querySelector('.tab-btn.active');
        const currentIndex = Array.from(tabBtns).indexOf(activeTab);
        
        if (diff > 0 && currentIndex < tabBtns.length - 1) {
            // Swipe left - next tab
            tabBtns[currentIndex + 1].click();
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - previous tab
            tabBtns[currentIndex - 1].click();
        }
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-based animations
const handleScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.profile-section');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
}, 10);

window.addEventListener('scroll', handleScroll); 