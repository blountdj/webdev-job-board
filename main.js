document.addEventListener('DOMContentLoaded', function() {
    // URL of your JSON data
    const jsonUrl = 'https://raw.githubusercontent.com/blountdj/webdev-job-board/main/data.json';

    const loadingSpinner = document.getElementById('loading-spinner');


    function addJobCard() {

        let jobCard = document.createElement('div');

        jobCard.innerHTML = `
            <div class="job-card" id="job-card-${id}">
                <div class="company-logo-wrapper">
                    <img src="https://cdn.prod.website-files.com/66a2503a8b85ff0bd5f535b4/66a2514db757ccf33d1e25fe_scoot.svg" loading="lazy" alt="" class="company-logo">   
                </div>
                <div class="job-top-row">
                    <div>5h ago</div>
                    <img src="https://cdn.prod.website-files.com/66a2503a8b85ff0bd5f535b4/66a26d97681a763b259e14aa_circle.svg" loading="lazy" alt="">
                    <div>Full Time</div>
                </div>
                <h3 class="heading">Senior Software Engineer</h3>
                <div>Scoot</div>
                <div class="text-block">United Kingdom</div>
            </div>
        `;

        return jobCard;
    }


    loadingSpinner.classList.add('block');

    // Fetch the JSON data
    fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
        loadingSpinner.classList.remove('block');
        // Process the JSON data
        // console.log(data);

        // Example: Insert data into an element with the ID 'data-container'
        const container = document.getElementById('data-container');
        if (container) {
            container.innerHTML = JSON.stringify(data, null, 2);

            for (let i = 0; i < data.length; i++) {
                const id = data[i].id;
                const company = data[i].company;
                const logoBackground = data[i].logoBackground;
                console.log('id:', id, 'company:', company, 'logoBackground:', logoBackground);
            }
        }

        // You can also manipulate the DOM based on the JSON data
        // For example, creating elements, updating content, etc.
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
        loadingSpinner.classList.add('block');
    });
});

  


