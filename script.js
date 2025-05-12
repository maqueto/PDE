document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const donateModal = document.getElementById('donate-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    const donateBtns = document.querySelectorAll('.btn.primary[href="#donate"]');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileMenu = document.querySelector('nav ul');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const donateForm = document.getElementById('donate-form');
    const donationsGrid = document.getElementById('donations-grid');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const impactStats = {
        mealsDonated: document.getElementById('meals-donated'),
        peopleHelped: document.getElementById('people-helped'),
        donorsCount: document.getElementById('donors-count'),
        communities: document.getElementById('communities')
    };

    // Dados simulados
    let donations = [
        {
            id: 1,
            type: 'food',
            title: 'Cestas Básicas',
            description: '10 cestas básicas com arroz, feijão, óleo e outros itens essenciais.',
            quantity: 10,
            location: 'São Paulo, SP',
            image: 'https://via.placeholder.com/300x200?text=Cesta+Básica'
        },
        {
            id: 2,
            type: 'food',
            title: 'Frutas e Verduras',
            description: 'Caixas de frutas e verduras frescas, colhidas hoje.',
            quantity: 5,
            location: 'Rio de Janeiro, RJ',
            image: 'https://via.placeholder.com/300x200?text=Frutas+Verduras'
        },
        {
            id: 3,
            type: 'clothes',
            title: 'Roupas de Inverno',
            description: 'Casacos, blusas e cobertores em bom estado para doação.',
            quantity: 20,
            location: 'Porto Alegre, RS',
            image: 'https://via.placeholder.com/300x200?text=Roupas+Inverno'
        },
        {
            id: 4,
            type: 'hygiene',
            title: 'Kits de Higiene',
            description: 'Kits contendo sabonete, shampoo, escova de dentes e pasta.',
            quantity: 15,
            location: 'Belo Horizonte, MG',
            image: 'https://via.placeholder.com/300x200?text=Kits+Higiene'
        }
    ];

    let users = [];
    let currentUser = null;

    // Funções auxiliares
    function toggleModal(modal) {
        modal.classList.toggle('active');
    }

    function renderDonations() {
        const category = categoryFilter.value;
        const location = locationFilter.value.toLowerCase();
        
        donationsGrid.innerHTML = '';
        
        const filteredDonations = donations.filter(donation => {
            const matchesCategory = category === 'all' || donation.type === category;
            const matchesLocation = donation.location.toLowerCase().includes(location);
            return matchesCategory && matchesLocation;
        });
        
        if (filteredDonations.length === 0) {
            donationsGrid.innerHTML = '<p class="no-results">Nenhuma doação encontrada com esses critérios.</p>';
            return;
        }
        
        filteredDonations.forEach(donation => {
            const donationCard = document.createElement('div');
            donationCard.className = 'donation-card';
            
            let categoryText = '';
            switch(donation.type) {
                case 'food':
                    categoryText = 'Alimento';
                    break;
                case 'clothes':
                    categoryText = 'Roupa';
                    break;
                case 'hygiene':
                    categoryText = 'Higiene';
                    break;
                default:
                    categoryText = 'Outro';
            }
            
            donationCard.innerHTML = `
                <div class="donation-image" style="background-image: url('${donation.image}')"></div>
                <div class="donation-info">
                    <h3>${donation.title}</h3>
                    <span class="donation-category">${categoryText}</span>
                    <p>${donation.description}</p>
                    <div class="donation-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donation.location}</span>
                    </div>
                    <div class="donation-quantity">Quantidade: ${donation.quantity}</div>
                    <button class="btn secondary reserve-btn" data-id="${donation.id}">Reservar</button>
                </div>
            `;
            
            donationsGrid.appendChild(donationCard);
        });
        
        // Adiciona event listeners aos novos botões
        document.querySelectorAll('.reserve-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!currentUser) {
                    toggleModal(loginModal);
                    return;
                }
                
                const donationId = parseInt(this.getAttribute('data-id'));
                const donation = donations.find(d => d.id === donationId);
                
                alert(`Obrigado por reservar: ${donation.title}\nEntre em contato com o doador para combinar a entrega.`);
            });
        });
    }

    function animateStats() {
        const targets = {
            meals: 1250,
            people: 780,
            donors: 320,
            communities: 45
        };
        
        const duration = 2000; // 2 segundos
        const interval = 20; // atualizar a cada 20ms
        const steps = duration / interval;
        
        Object.keys(targets).forEach((key, index) => {
            const target = targets[key];
            const step = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                switch(key) {
                    case 'meals':
                        impactStats.mealsDonated.textContent = Math.floor(current);
                        break;
                    case 'people':
                        impactStats.peopleHelped.textContent = Math.floor(current);
                        break;
                    case 'donors':
                        impactStats.donorsCount.textContent = Math.floor(current);
                        break;
                    case 'communities':
                        impactStats.communities.textContent = Math.floor(current);
                        break;
                }
            }, interval);
        });
    }

    // Event Listeners
    loginBtn.addEventListener('click', () => toggleModal(loginModal));
    
    donateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                toggleModal(loginModal);
            } else {
                toggleModal(donateModal);
            }
        });
    });

    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            toggleModal(modal);
        });
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(loginModal);
        toggleModal(registerModal);
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(registerModal);
        toggleModal(loginModal);
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('#email').value;
        const password = this.querySelector('#password').value;
        
        // Simulação de login
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            alert(`Bem-vindo de volta, ${user.name}!`);
            toggleModal(loginModal);
            // Atualizar UI para usuário logado
            loginBtn.textContent = 'Minha Conta';
        } else {
            alert('Email ou senha incorretos. Tente novamente ou cadastre-se.');
        }
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email-register').value;
        const password = this.querySelector('#password-register').value;
        const userType = this.querySelector('#user-type').value;
        
        // Verifica se o usuário já existe
        if (users.some(u => u.email === email)) {
            alert('Este email já está cadastrado. Faça login ou use outro email.');
            return;
        }
        
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            type: userType
        };
        
        users.push(newUser);
        currentUser = newUser;
        
        alert(`Cadastro realizado com sucesso, ${name}!`);
        toggleModal(registerModal);
        // Atualizar UI para usuário logado
        loginBtn.textContent = 'Minha Conta';
    });

    donateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const type = this.querySelector('#donation-type').value;
        const description = this.querySelector('#donation-description').value;
        const quantity = this.querySelector('#donation-quantity').value;
        const expiry = this.querySelector('#donation-expiry').value;
        const location = this.querySelector('#donation-location').value;
        
        let title = '';
        switch(type) {
            case 'food':
                title = 'Doação de Alimentos';
                break;
            case 'clothes':
                title = 'Doação de Roupas';
                break;
            case 'hygiene':
                title = 'Doação de Produtos de Higiene';
                break;
            default:
                title = 'Doação Diversa';
        }
        
        const newDonation = {
            id: donations.length + 1,
            type,
            title,
            description,
            quantity,
            expiry,
            location,
            image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`
        };
        
        donations.push(newDonation);
        renderDonations();
        
        alert('Doação publicada com sucesso! Obrigado por sua contribuição.');
        toggleModal(donateModal);
        this.reset();
    });

    categoryFilter.addEventListener('change', renderDonations);
    locationFilter.addEventListener('input', renderDonations);

    // Inicialização
    renderDonations();
    animateStats();

    // Fechar modais ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
});
