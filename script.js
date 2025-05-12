// Espera o DOM (estrutura HTML) ser completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // --- Seletores de Elementos ---
    // Botões de Cadastro
    const btnRegisterDonor = document.querySelector('.btn-register-donor');
    const btnRegisterVolunteer = document.querySelector('.btn-register-volunteer');

    // Formulários de Cadastro
    const formDonor = document.getElementById('form-doador');
    const formVolunteer = document.getElementById('form-voluntario');

    // Botão e Formulário de Publicar Doação
    const btnOfferDonation = document.getElementById('btn-oferecer-doacao');
    const formPublishDonation = document.getElementById('form-publicar-doacao');

    // Link e Seção de Login
    const loginLink = document.querySelector('a[href="#login"]'); // Pega o link pelo href
    const loginSection = document.getElementById('login');
    const loginForm = document.getElementById('form-login');

    // Seção de Relatórios
    const reportsSection = document.getElementById('relatorios');

    // Input de Busca de Doações e Lista
    const searchDonationInput = document.getElementById('search-doacao');
    const donationItems = document.querySelectorAll('.lista-doacoes .doacao-item'); // Pega todos os itens de doação

    // --- Funções Auxiliares ---
    /**
     * Alterna a visibilidade de um elemento adicionando/removendo a classe 'hidden'
     * @param {HTMLElement} element O elemento a ser mostrado/oculto
     * @param {boolean} [forceShow=false] Se true, força a exibição; se false, força a ocultação. Se omitido, alterna.
     */
    function toggleVisibility(element, forceShow) {
        if (!element) return; // Sai se o elemento não existir

        if (typeof forceShow === 'boolean') {
            element.classList.toggle('hidden', !forceShow);
        } else {
            element.classList.toggle('hidden');
        }
    }

    // --- Event Listeners ---

    // 1. Mostrar Formulário de Doador
    if (btnRegisterDonor && formDonor) {
        btnRegisterDonor.addEventListener('click', () => {
            toggleVisibility(formDonor, true); // Mostra form doador
            toggleVisibility(formVolunteer, false); // Garante que o outro form esteja oculto
            // Opcional: Ocultar a caixa de opção do voluntário para não poluir
             if(btnRegisterVolunteer) toggleVisibility(btnRegisterVolunteer.closest('.cadastro-box'), false);
        });
    }

    // 2. Mostrar Formulário de Voluntário
    if (btnRegisterVolunteer && formVolunteer) {
        btnRegisterVolunteer.addEventListener('click', () => {
            toggleVisibility(formVolunteer, true); // Mostra form voluntário
            toggleVisibility(formDonor, false); // Garante que o outro form esteja oculto
             // Opcional: Ocultar a caixa de opção do doador
            if(btnRegisterDonor) toggleVisibility(btnRegisterDonor.closest('.cadastro-box'), false);
        });
    }

    // 3. Mostrar Formulário de Publicar Doação
    if (btnOfferDonation && formPublishDonation) {
        btnOfferDonation.addEventListener('click', () => {
            toggleVisibility(formPublishDonation); // Alterna a visibilidade
        });
    }

    // 4. Mostrar Seção de Login ao clicar no link
    if (loginLink && loginSection) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault(); // Previne a navegação padrão para #login
            toggleVisibility(loginSection, true); // Mostra a seção de login
            loginSection.scrollIntoView({ behavior: 'smooth' }); // Rola a tela até a seção
        });
    }

    // 5. Simulação de Envio de Formulários
    const allForms = document.querySelectorAll('form'); // Pega TODOS os formulários da página
    allForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // IMPEDE o envio real do formulário (que recarregaria a página)

            // Simulação Simples: Exibe um alerta
            alert('Formulário enviado com sucesso! (Esta é uma simulação)');

            // Opcional: Limpar os campos do formulário após o envio
            form.reset();

            // Opcional: Esconder o formulário após o envio (exceto login)
            if (form !== loginForm) {
                 toggleVisibility(form, false);
                // Reexibir botões de cadastro se for um form de cadastro
                if (form === formDonor && btnRegisterVolunteer) toggleVisibility(btnRegisterVolunteer.closest('.cadastro-box'), true);
                if (form === formVolunteer && btnRegisterDonor) toggleVisibility(btnRegisterDonor.closest('.cadastro-box'), true);
            }

            // Simulação de Login: Se for o formulário de login, mostrar relatórios
            if (form === loginForm && reportsSection) {
                alert('Login realizado com sucesso! (Simulação)');
                toggleVisibility(reportsSection, true); // Mostra a seção de relatórios
                toggleVisibility(loginSection, false); // Esconde a seção de login
                // Você pode querer também mudar o link "Login" para "Logout" ou "Painel"
                if(loginLink) loginLink.textContent = "Painel";
                loginLink.href = "#relatorios"; // Muda o link para apontar para relatórios
            }
        });
    });

    // 6. Filtro de Busca de Doações (Cliente-Side Simples)
    if (searchDonationInput && donationItems.length > 0) {
        searchDonationInput.addEventListener('input', () => {
            const searchTerm = searchDonationInput.value.toLowerCase().trim();

            donationItems.forEach(item => {
                const itemText = item.textContent.toLowerCase(); // Pega todo o texto dentro do card da doação
                const isVisible = itemText.includes(searchTerm);
                // Em vez de usar a classe hidden (que pode bagunçar o grid),
                // alteramos o display diretamente.
                item.style.display = isVisible ? 'block' : 'none';
            });
        });
    }

    // 7. (Opcional) Smooth Scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]'); // Links que começam com #
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Evita o comportamento padrão apenas se for um link para uma seção existente
            const targetId = this.getAttribute('href');
            // Ignora links simples '#' ou links que não apontam para IDs válidos
            if (targetId === '#' || targetId.length <= 1) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Previne o salto direto
                targetElement.scrollIntoView({
                    behavior: 'smooth', // Rolagem suave
                    block: 'start' // Alinha o topo do elemento com o topo da viewport
                });

                // Opcional: Fecha menus mobile ou realiza outras ações ao navegar
            }
             // Se o link for o de login e a seção já estiver visível, não faz nada extra (já tratado no listener 4)
             if (targetId === '#login' && !loginSection.classList.contains('hidden')) {
                 return;
             }
        });
    });

}); 
