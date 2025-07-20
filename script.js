console.log("Script file loaded");

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