document.addEventListener('DOMContentLoaded', function() {

    const htmlElem = document.querySelector('html');
    const toggle = document.getElementById('mode-toggle');
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');
    const toggleCircle = document.querySelector('.toggle-circle');

    function toggleUpdate() {
        toggleCircle.classList.toggle('is-dark')
        lightIcon.classList.toggle('is-on')
        darkIcon.classList.toggle('is-on')
    }
    
    function checkInitialMode() {
        if (htmlElem.classList.contains('dark-mode')) {
            toggleUpdate();
        }
    }

    function init() {
        checkInitialMode();

        toggle.addEventListener('click', toggleUpdate)
    }
    
    init()
})