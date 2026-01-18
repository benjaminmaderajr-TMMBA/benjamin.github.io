// Smooth scrolling for anchor links
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

// Intersection Observer for fade-in animations
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

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Animate skill cards on scroll
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Animate certification badges
    const certBadges = document.querySelectorAll('.cert-badge');
    certBadges.forEach((badge, index) => {
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.8)';
        badge.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(badge);
    });

    // Animate experience cards
    const expCards = document.querySelectorAll('.experience-card');
    expCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Animate education cards
    const eduCards = document.querySelectorAll('.education-card');
    eduCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add active state to buttons on click
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Console message
console.log('%c Benjamin Madera Jr - Portfolio', 'color: #2563eb; font-size: 24px; font-weight: bold;');
console.log('%c Senior Military Officer | Program Management & Leadership Expert', 'color: #3b82f6; font-size: 14px;');

// Email Tooltip Functionality
let currentTooltip = null;

// Function to create and show email tooltip
function showEmailTooltip(email, buttonElement, event) {
    event.preventDefault();

    // Remove any existing tooltip and its listeners before creating a new one
    if (currentTooltip) {
        document.removeEventListener('click', handleClickOutside);
        currentTooltip.remove();
        currentTooltip = null;
    }

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'email-tooltip';
    tooltip.innerHTML = `
        <button class="email-tooltip-close" aria-label="Close">&times;</button>
        <div class="email-tooltip-header">Email Address</div>
        <div class="email-tooltip-content">${email}</div>
        <div class="email-tooltip-buttons">
            <button class="email-tooltip-copy-btn">
                <i class="fas fa-copy"></i> Copy to Clipboard
            </button>
            <button class="email-tooltip-mailto-btn">
                <i class="fas fa-envelope"></i> Open Email Client
            </button>
        </div>
        <div class="email-tooltip-copied">Copied to clipboard!</div>
    `;

    // Add tooltip to body
    document.body.appendChild(tooltip);
    currentTooltip = tooltip;

    // Position tooltip
    const buttonRect = buttonElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Calculate position (centered below button)
    let left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);
    let top = buttonRect.bottom + 10;

    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = buttonRect.top - tooltipRect.height - 10;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    // Show tooltip with animation
    setTimeout(() => tooltip.classList.add('show'), 10);

    // Add event listeners
    const copyBtn = tooltip.querySelector('.email-tooltip-copy-btn');
    const mailtoBtn = tooltip.querySelector('.email-tooltip-mailto-btn');
    const closeBtn = tooltip.querySelector('.email-tooltip-close');
    const copiedMsg = tooltip.querySelector('.email-tooltip-copied');

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            // Show success message
            copiedMsg.classList.add('show');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';

            // Reset after 2 seconds
            setTimeout(() => {
                copiedMsg.classList.remove('show');
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
            alert('Failed to copy email. Please try again.');
        }
    });

    // Open email client
    mailtoBtn.addEventListener('click', () => {
        window.location.href = `mailto:${email}`;
        closeTooltip();
    });

    // Close button
    closeBtn.addEventListener('click', closeTooltip);

    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);
}

// Function to close tooltip
function closeTooltip() {
    if (currentTooltip) {
        currentTooltip.classList.remove('show');
        setTimeout(() => {
            if (currentTooltip) {
                currentTooltip.remove();
                currentTooltip = null;
            }
        }, 300);
        document.removeEventListener('click', handleClickOutside);
    }
}

// Handle clicks outside tooltip
function handleClickOutside(event) {
    if (currentTooltip && !currentTooltip.contains(event.target) && !event.target.closest('.email-btn')) {
        closeTooltip();
    }
}

// Add event listeners to all email buttons
document.addEventListener('DOMContentLoaded', () => {
    const emailButtons = document.querySelectorAll('.email-btn');

    emailButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const email = this.getAttribute('data-email');
            if (email) {
                showEmailTooltip(email, this, event);
            }
        });
    });

    // Skill Highlighting Functionality
    let activeSkill = null;

    // Function to reset all highlights
    function resetHighlights() {
        // Remove active class from all skill cards
        document.querySelectorAll('.skill-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove highlighted class from all bullet points
        document.querySelectorAll('.exp-details li').forEach(li => {
            li.classList.remove('highlighted');
        });
        
        activeSkill = null;
    }

    // Function to highlight bullets for a specific skill
    function highlightSkill(skill) {
        // Reset first
        resetHighlights();
        
        // If clicking the same skill, just reset (toggle off)
        if (activeSkill === skill) {
            return;
        }
        
        // Set active skill
        activeSkill = skill;
        
        // Add active class to the clicked skill card
        const skillCard = document.querySelector(`.skill-card[data-skill="${skill}"]`);
        if (skillCard) {
            skillCard.classList.add('active');
        }
        
        // Find and highlight all bullets that contain this skill
        document.querySelectorAll('.exp-details li').forEach(li => {
            const skills = li.getAttribute('data-skills');
            if (skills && skills.split(',').map(s => s.trim()).includes(skill)) {
                li.classList.add('highlighted');
            }
        });
    }

    // Add click event listeners to skill cards
    document.querySelectorAll('.skill-card[data-skill]').forEach(card => {
        card.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            highlightSkill(skill);
        });
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const skill = this.getAttribute('data-skill');
                highlightSkill(skill);
            }
        });
    });

    // Add click event listener to reset button
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', resetHighlights);
        resetButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                resetHighlights();
            }
        });
    }
});
