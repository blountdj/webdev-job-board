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
    
    // Filters
    const searchBtn = document.getElementById('search-btn');
    const searchFilter = document.getElementById('search-filter');
    const locationFilter = document.getElementById('location-filter');
    const fullTimeCheckbox = document.getElementById('full-time-checkbox');

    // Details Section for Updates
    const companyElem = jobDetailsWrapper.querySelector('.heading-2');
    const companyLogo = jobDetailsWrapper.querySelector('.details-logo');
    const companyLogoBackground = jobDetailsWrapper.querySelector('.details-logo-wrapper');
    const companyPosition = jobDetailsWrapper.querySelector('.details-position');
    const companyPositionFooter = jobDetailsFooter.querySelector('.details-position');
    const companyWebsite = jobDetailsWrapper.querySelector('.details-company-website');
    const companySiteBtn = jobDetailsWrapper.querySelector('#company-site-btn');
    const postedAgo = jobDetailsWrapper.querySelector('#time-posted-ago');
    const companyWebsiteFooter = jobDetailsFooter.querySelector('.details-company-website');
    const detailsContract = jobDetailsWrapper.querySelector('#details-contract');
    const detailsLocation = jobDetailsWrapper.querySelector('#details-location');
    const detailsApplyBtn = jobDetailsWrapper.querySelector('#details-apply-btn');
    const footerApplyBtn = jobDetailsFooter.querySelector('#footer-apply-btn');
    const detailsDescription = jobDetailsWrapper.querySelector('#details-description');
    const detailsRequirements = jobDetailsWrapper.querySelector('#details-requirements');
    const requirementList = document.getElementById('requirements-list');
    const detailsRole = jobDetailsWrapper.querySelector('#role-list');
    const roleList = document.getElementById('role-list');


    // Data
    let fetchedData;
    let currentNoJobs;
    let currentLimit = 9;

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

    function removeLogoClasses() {
        companyLogo.classList.remove('is-text'); 
        companyLogo.classList.remove('is-image');
    }

    function updateJobDetails(jobId) {
        const jobData = fetchedData.filteredData[jobId];

        companyElem.textContent = jobData.company;    
        companyLogo.src = jobData.logo;
        companyLogoBackground.style.backgroundColor = jobData.logoBackground;

        removeLogoClasses();
        jobData.logoType === 'text' ? companyLogo.classList.add('is-text') : companyLogo.classList.add('is-image');

        companyPosition.textContent = jobData.position;
        companyPositionFooter.textContent = jobData.position;
        companyWebsite.textContent = `${jobData.company.replace(/\s+/g, '').toLowerCase()}.com`;
        companyWebsiteFooter.textContent = `${jobData.company.replace(/\s+/g, '').toLowerCase()}.com`;
        companySiteBtn.href = jobData.website;
        postedAgo.textContent = jobData.postedAt;
        detailsContract.textContent = jobData.contract;
        detailsLocation.textContent = jobData.location;
        detailsApplyBtn.href = jobData.apply;    
        footerApplyBtn.href = jobData.apply;   
        detailsDescription.textContent = jobData.description;
        detailsRequirements.textContent = jobData.requirements.content;
        requirementList.innerHTML = '';

        jobData.requirements.items.forEach(requirementText => {
            const listItem = document.createElement('li');
            listItem.className = 'job-text is-ul';
            
            listItem.textContent = requirementText;
            requirementList.appendChild(listItem);
        });

        detailsRole.textContent = jobData.role.content;
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
        window.scrollTo(0, 0);
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

    function filterPositionData(data, fullTimeOnly) {
        return data.filter(item => item.contract === "Full Time");
    }

    function filterLocationData(data, locationFilter) {
        console.log('locationFilter:', locationFilter)
        return data.filter(item => item.location.toLowerCase() === locationFilter.trim().toLowerCase());
    }

    function filterSearchData(data, searchFilter) {
        const trimmedFilter = searchFilter.trim().toLowerCase();
        
        return data.filter(item => 
            item.company.toLowerCase().includes(trimmedFilter) || 
            item.position.toLowerCase().includes(trimmedFilter)
        );
    }


    function loadData(noJobs = currentLimit) {
        loadingSpinner.classList.add('block');
        let filteredData;

        let searchFilterValue = searchFilter.value;
        searchFilterValue = searchFilterValue === '' ? false : searchFilterValue;

        let locationFilterValue = locationFilter.value;
        locationFilterValue = locationFilterValue === '' ? false : locationFilterValue;
        const fullTimeOnly = fullTimeCheckbox.checked;

        // Fetch the JSON data
        fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            loadingSpinner.classList.remove('block');
            jobsGrid.innerHTML = '';
            
            fullTimeOnly ? filteredData = filterPositionData(data, fullTimeOnly) : filteredData = data
            locationFilterValue ? filteredData = filterLocationData(filteredData, locationFilterValue) : filteredData = filteredData;
            searchFilterValue ? filteredData = filterSearchData(filteredData, searchFilterValue) : filteredData = filteredData;


            // console.log('filteredData:')
            // console.log(filteredData)

            fetchedData = { filteredData: {} };
            const noJobsVar = noJobs <= filteredData.length ? noJobs : filteredData.length;
            currentNoJobs = noJobsVar;
            for (let i = 0; i < noJobsVar; i++) {
                addJobCard(filteredData[i])
                fetchedData.filteredData[filteredData[i].id] = filteredData[i];
            }

            if (noJobsVar >= filteredData.length) {
                loadMoreBtn.classList.add('hidden');
            } else {
                loadMoreBtn.classList.remove('hidden');
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
        loadData(currentNoJobs + currentLimit);
    })

    function closeDetails() {
        toggleJobDetails()
        window.scrollTo(0, 0);
        setTimeout(() => {
            jobDetailsWrapper.style.display = 'none';
            jobDetailsFooter.style.display = 'none';
        }, 200)

        
    }

    function search() {
        jobsGrid.innerHTML = '';
        loadData()
    }

    function init() {
        loadData(currentLimit);
        checkInitialMode();
        loadMoreBtn.classList.remove('hidden');
        jobDetailsWrapper.classList.add('hidden');
        jobDetailsFooter.classList.add('hidden');
        viewAllListingsLink.addEventListener('click', closeDetails);
        searchBtn.addEventListener('click', search);
    }

    init()

});

  


