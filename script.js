// Global state
let currentPage = 'dashboard';
let currentQuestion = 27;
let totalQuestions = 45;
let timeRemaining = 6330; // seconds
let timerInterval;

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const filterBtns = document.querySelectorAll('.filter-btn');
const assessmentCards = document.querySelectorAll('.assessment-card[data-category]');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFilters();
    initQuestionNavigator();
    startTimer();
    initAnimations();
});

// Navigation
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.dataset.page;
            navigateToPage(targetPage);
        });
    });
}

function navigateToPage(pageId) {
    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Update active page
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    currentPage = pageId;
    
    // Page-specific initialization
    if (pageId === 'assessment') {
        updateQuestionDisplay();
    }
}

// Filters for assessments page
function initFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter assessments
            filterAssessments(filter);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchAssessments(this.value);
        });
    }
}

function filterAssessments(filter) {
    assessmentCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchAssessments(query) {
    assessmentCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Assessment functionality
function startAssessment() {
    navigateToPage('assessment');
}

function initQuestionNavigator() {
    const questionGrid = document.querySelector('.question-grid');
    if (!questionGrid) return;
    
    // Clear existing content
    questionGrid.innerHTML = '';
    
    // Generate question number buttons
    for (let i = 1; i <= totalQuestions; i++) {
        const btn = document.createElement('button');
        btn.className = 'question-number-btn';
        btn.textContent = i;
        btn.addEventListener('click', () => navigateToQuestion(i));
        
        // Add appropriate classes
        if (i < currentQuestion) {
            btn.classList.add('answered');
        } else if (i === currentQuestion) {
            btn.classList.add('current');
        }
        
        questionGrid.appendChild(btn);
    }
}

function navigateToQuestion(questionNumber) {
    currentQuestion = questionNumber;
    updateQuestionDisplay();
    initQuestionNavigator(); // Refresh navigator
}

function updateQuestionDisplay() {
    // Update progress circle
    const progressCircle = document.querySelector('.circle');
    if (progressCircle) {
        const progressPercentage = (currentQuestion / totalQuestions) * 100;
        progressCircle.style.strokeDasharray = `${progressPercentage}, 100`;
    }
    
    // Update progress text
    const currentSpan = document.querySelector('.progress-text .current');
    if (currentSpan) {
        currentSpan.textContent = currentQuestion;
    }
    
    // Update question header
    const questionNumber = document.querySelector('.question-number');
    if (questionNumber) {
        questionNumber.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
    }
    
    // Generate sample question data
    updateQuestionContent();
}

function updateQuestionContent() {
    const questions = [
        {
            category: "React Components",
            question: "What is the correct way to handle state updates in React functional components?",
            options: [
                "Directly mutating the state variable",
                "Using the setState function from useState hook",
                "Modifying the state directly with assignment",
                "Using this.setState() method"
            ]
        },
        {
            category: "JavaScript",
            question: "Which of the following is the correct way to create a Promise in JavaScript?",
            options: [
                "new Promise((resolve, reject) => {})",
                "Promise.create((resolve, reject) => {})",
                "new Promise(resolve => {})",
                "Promise((resolve, reject) => {})"
            ]
        },
        {
            category: "Node.js",
            question: "What is the purpose of the package.json file in a Node.js project?",
            options: [
                "To store application data",
                "To define project metadata and dependencies",
                "To configure the web server",
                "To store environment variables"
            ]
        }
    ];
    
    const questionIndex = (currentQuestion - 1) % questions.length;
    const questionData = questions[questionIndex];
    
    // Update category
    const categoryElement = document.querySelector('.question-category');
    if (categoryElement) {
        categoryElement.textContent = questionData.category;
    }
    
    // Update question text
    const questionElement = document.querySelector('.question-content h3');
    if (questionElement) {
        questionElement.textContent = questionData.question;
    }
    
    // Update options
    const optionElements = document.querySelectorAll('.option-text');
    optionElements.forEach((element, index) => {
        if (questionData.options[index]) {
            element.textContent = questionData.options[index];
        }
    });
    
    // Clear previous selections
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.checked = false;
    });
}

function previousQuestion() {
    if (currentQuestion > 1) {
        navigateToQuestion(currentQuestion - 1);
    }
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        navigateToQuestion(currentQuestion + 1);
    }
}

// Timer functionality
function startTimer() {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timeRemaining = 0;
            // Handle time up
            alert('Time\'s up! Assessment will be submitted automatically.');
            return;
        }
        
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change timer color when time is running low
        if (timeRemaining <= 300) { // 5 minutes
            timerDisplay.parentElement.style.background = '#fee2e2';
            timerDisplay.parentElement.style.color = '#991b1b';
        }
    }, 1000);
}

// Animations and interactions
function initAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .assessment-card, .activity-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
    // Add scroll animations
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
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.stat-card, .assessment-card, .summary-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for ripple effect and notifications
const additionalStyles = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10000;
}

.notification.show {
    transform: translateX(0);
}

.notification-info {
    background: #2563eb;
}

.notification-success {
    background: #10b981;
}

.notification-warning {
    background: #f59e0b;
}

.notification-error {
    background: #ef4444;
}
`;

// Add additional styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export functions for global use
window.startAssessment = startAssessment;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;