document.addEventListener('DOMContentLoaded', () => {
    const campaignsContainer = document.querySelector('.container .row');
    const itemsContainer = document.querySelector('.items-container'); // Certifique-se de ter esse contêiner no HTML

    async function loadCampaigns() {
        try {
            const response = await fetch('http://localhost:3000/api/itens'); // Altere para o endpoint correto
            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
            
            const items = await response.json();

            items.forEach(item => {
                // Aqui, altere de acordo com o tipo que você deseja exibir, como 'campanha'
                if (item.tipo === 'campanha') {
                    const imageName = item.nome.toLowerCase().replace(/\s+/g, '-') + '.jpg';
                    const imagePath = `img/${imageName}`;

                    const cardHTML = `
                        <div class="col-md-4" data-type="campanha">
                            <div class="card bg-light mb-4">
                                <img src="${imagePath}" class="card-img-top" alt="${item.nome}" onerror="this.onerror=null;this.src='img/default.jpg';">
                                <div class="card-body">
                                    <h5 class="card-title">${item.nome}</h5>
                                    <p class="card-text">${item.descricao}</p>
                                    <a href="#" class="btn btn-secondary">Ver Detalhes</a>
                                </div>
                            </div>
                        </div>
                    `;

                    campaignsContainer.insertAdjacentHTML('beforeend', cardHTML);
                }
            });

        } catch (error) {
            console.error('Erro ao carregar campanhas:', error);
            campaignsContainer.innerHTML = `<p class="text-danger">Erro ao carregar campanhas. Tente novamente mais tarde.</p>`;
        }
    }

    async function loadRecentItems() {
        try {
            const response = await fetch('http://localhost:3000/api/itens'); // Use o mesmo endpoint para obter todos os itens
            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

            const items = await response.json();

            items.forEach(item => {
                // Aqui, altere de acordo com o tipo que você deseja exibir, como 'item'
                if (item.tipo === 'item') {
                    const imageName = item.nome.toLowerCase().replace(/\s+/g, '-') + '.jpg';
                    const imagePath = `img/${imageName}`;

                    const cardHTML = `
                        <div class="col-md-3" data-type="item">
                            <div class="card bg-light mb-4">
                                <img src="${imagePath}" class="card-img-top" alt="${item.nome}" onerror="this.onerror=null;this.src='img/default.jpg';">
                                <div class="card-body">
                                    <h5 class="card-title">${item.nome}</h5>
                                    <p class="card-text">${item.descricao}</p>
                                    <a href="#" class="btn btn-secondary">Ver Detalhes</a>
                                </div>
                            </div>
                        </div>
                    `;

                    itemsContainer.insertAdjacentHTML('beforeend', cardHTML);
                }
            });

        } catch (error) {
            console.error('Erro ao carregar itens recentes:', error);
            itemsContainer.innerHTML = `<p class="text-danger">Erro ao carregar itens recentes. Tente novamente mais tarde.</p>`;
        }
    }

    loadCampaigns();
    loadRecentItems();
});
