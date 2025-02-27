document.addEventListener('DOMContentLoaded', () => {
    const campaignsContainer = document.querySelector('.container .row');

    async function loadCampaigns() {
        try {
            const response = await fetch('http://localhost:3000/api/campaigns'); // Altere para a URL correta do seu backend
            const campaigns = await response.json();

            campaigns.forEach(campaign => {
                const cardHTML = `
                    <div class="col-md-4">
                        <div class="card bg-light mb-4">
                            <img src="img/${campaign.name.toLowerCase().replace(/\s+/g, '-')}.jpg" class="card-img-top" alt="${campaign.name}">
                            <div class="card-body">
                                <h5 class="card-title">${campaign.name}</h5>
                                <p class="card-text">${campaign.description}</p>
                                <a href="#" class="btn btn-secondary">Ver Detalhes</a>
                            </div>
                        </div>
                    </div>
                `;
                campaignsContainer.innerHTML += cardHTML;
            });
        } catch (error) {
            console.error('Erro ao carregar campanhas:', error);
        }
    }

    loadCampaigns();
});
