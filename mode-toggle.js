document.addEventListener('DOMContentLoaded', function() {

    const toggle = document.getElementById('mode-toggle');
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');
    const toggleCircle = document.querySelector('.toggle-circle');


    function toggleUpdate() {
        toggleCircle.classList.toggle('is-dark')
        lightIcon.classList.toggle('is-on')
        darkIcon.classList.toggle('is-on')
    }


    toggle.addEventListener('click', toggleUpdate)

    window.toggleUpdate = toggleUpdate;

})