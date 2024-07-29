document.addEventListener('DOMContentLoaded', function() {
    const jsonUrl = 'https://raw.githubusercontent.com/blountdj/webdev-job-board/main/data.json';

    const loadingSpinner = document.getElementById('loading-spinner');
    const jobsGrid = document.querySelector('.main-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const htmlElem = document.querySelector('html');
    const mainWrapper = document.querySelector('.main-wrapper');
    const jobDetailsWrapper = document.querySelector('.job-details-wrapper');
    const jobDetailsFooter = document.querySelector('.job-details-footer');
    const viewAllListingsLink = document.getElementById('view-all-listings-link');
    
    let fetchedData;

    let currentNoJobs;

    function addJobCard(data) {

        const id = data.id;
        const company = data.company;
        const logo = data.logo;
        const logoBackground = data.logoBackground;
        const position = data.position;
        const postedAt = data.postedAt;
        const contract = data.contract;
        const location = data.location;
        // console.log('id:', id, 'company:', company, 'logoBackground:', logoBackground);

        let jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.dataset.id = `${id}`;
        jobCard.innerHTML = `
            <div class="company-logo-wrapper" style="background-color: ${logoBackground};">
                <img src="${logo}" loading="lazy" alt="" class="company-logo">   
            </div>
            <div class="job-top-row">
                <div>${postedAt}</div>
                <img src="https://cdn.prod.website-files.com/66a2503a8b85ff0bd5f535b4/66a26d97681a763b259e14aa_circle.svg" loading="lazy" alt="">
                <div>${contract}</div>
            </div>
            <h3 class="heading">${position}</h3>
            <div>${company}</div>
            <div class="text-block">${location}</div>
        `;

        jobsGrid.appendChild(jobCard);
    }

    function updateJobDetails(jobId) {
        
        const jobData = fetchedData.data[jobId];

        const companyElem = jobDetailsWrapper.querySelector('.heading-2');
        companyElem.textContent = jobData.company;

        const companyLogo = jobDetailsWrapper.querySelector('.details-logo');
        companyLogo.src = jobData.logo;

        const companyLogoBackground = jobDetailsWrapper.querySelector('.details-logo-wrapper');
        companyLogoBackground.style.backgroundColor = jobData.logoBackground;

        jobData.logoType === 'text' ? companyLogo.classList.add('is-text') : companyLogo.classList.add('is-image');

        const companyPosition = jobDetailsWrapper.querySelector('.details-position');
        companyPosition.textContent = jobData.position;

        const companyPositionFooter = jobDetailsFooter.querySelector('.details-position');
        companyPositionFooter.textContent = jobData.position;

        const companyWebsite = jobDetailsWrapper.querySelector('.details-company-website');
        companyWebsite.textContent = `${jobData.company.replace(/\s+/g, '').toLowerCase()}.com`;

        const companyWebsiteFooter = jobDetailsFooter.querySelector('.details-company-website');
        companyWebsiteFooter.textContent = `${jobData.company.replace(/\s+/g, '').toLowerCase()}.com`;

        const companySiteBtn = jobDetailsWrapper.querySelector('#company-site-btn');
        companySiteBtn.href = jobData.website;
        
        const postedAgo = jobDetailsWrapper.querySelector('#time-posted-ago');
        postedAgo.textContent = jobData.postedAt;

        const detailsContract = jobDetailsWrapper.querySelector('#details-contract');
        detailsContract.textContent = jobData.contract;

        const detailsLocation = jobDetailsWrapper.querySelector('#details-location');
        detailsLocation.textContent = jobData.location;
        
        const detailsApplyBtn = jobDetailsWrapper.querySelector('#details-apply-btn');
        detailsApplyBtn.href = jobData.apply;

        const footerApplyBtn = jobDetailsFooter.querySelector('#footer-apply-btn');
        footerApplyBtn.href = jobData.apply;
  
        const detailsDescription = jobDetailsWrapper.querySelector('#details-description');
        detailsDescription.textContent = jobData.description;
        
        const detailsRequirements = jobDetailsWrapper.querySelector('#details-requirements');
        detailsRequirements.textContent = jobData.requirements.content;

        const requirementList = document.getElementById('requirements-list');
        requirementList.innerHTML = '';

        jobData.requirements.items.forEach(requirementText => {
            const listItem = document.createElement('li');
            listItem.className = 'job-text is-ul';
            
            listItem.textContent = requirementText;
            requirementList.appendChild(listItem);
        });

        const detailsRole = jobDetailsWrapper.querySelector('#role-list');
        detailsRole.textContent = jobData.role.content;

        const roleList = document.getElementById('role-list');
        roleList.innerHTML = '';

        jobData.role.items.forEach(roleText => {
            const listItem = document.createElement('li');
            listItem.className = 'job-text is-ol';
            
            listItem.textContent = roleText;
            roleList.appendChild(listItem);
        });




    }

    function toggleJobDetails() {
        mainWrapper.classList.toggle('hidden');
        jobDetailsWrapper.classList.toggle('hidden');
        jobDetailsFooter.classList.toggle('hidden');
    }

    function jobCardClick(event) {
        const jobId = event.target.closest('.job-card').dataset.id;
        updateJobDetails(jobId)
        jobDetailsWrapper.style.display = 'flex';
        jobDetailsFooter.style.display = 'flex';
        toggleJobDetails()
    }

    function addJobCardEventListeners() {
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            card.addEventListener('click', jobCardClick);
        });
    }

    function loadData(noJobs = 12) {
        loadingSpinner.classList.add('block');

        // Fetch the JSON data
        fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            loadingSpinner.classList.remove('block');
            jobsGrid.innerHTML = '';
            fetchedData = { data: {} };
            // Process the JSON data
            // console.log(data);

            const noJobsVar = noJobs <= data.length ? noJobs : data.length;
            currentNoJobs = noJobsVar;
            // console.log('noJobsVar:', noJobsVar)
            for (let i = 0; i < noJobsVar; i++) {
                addJobCard(data[i])
                fetchedData.data[data[i].id] = data[i];
            }

            if (noJobsVar >= data.length) {
                loadMoreBtn.classList.add('hidden');
            }

            addJobCardEventListeners();

        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
            loadingSpinner.classList.add('block');
        });
    }

    function checkInitialMode() {
        if (htmlElem.classList.contains('dark-mode')) {
            toggleUpdate();
        }
    }

    loadMoreBtn.addEventListener('click', function() {
        loadData(currentNoJobs + 9);
    })

    function closeDetails() {
        toggleJobDetails()
        setTimeout(() => {
            jobDetailsWrapper.style.display = 'none';
            jobDetailsFooter.style.display = 'none';
        }, 200)
        
    }

    function init() {
        loadData(9);
        checkInitialMode();
        loadMoreBtn.classList.remove('hidden');
        jobDetailsWrapper.classList.add('hidden');
        jobDetailsFooter.classList.add('hidden');
        viewAllListingsLink.addEventListener('click', closeDetails);
        
    }

    init()

});

  


