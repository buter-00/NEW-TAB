var cluster = document.getElementsByClassName("cluster")[0];
code(array_all, "Всё"); // Загрузка по умолчанию

function code(category, categoryName) {
    cluster.innerHTML = '';
    for (var n = 0; n < category.length; n++) {
        if (category[n].NAME && category[n].ICON) {
            var url = category[n].NAME === "ADD" ? "ADD.html" : category[n].URL;
            cluster.innerHTML += `
                <a class="card" href="${url}" target="_blank" data-category="${categoryName}">
                    <div class="icon" style="background-image: url(IMG/${category[n].ICON})"></div>
                    <div class="name-container">
                        <div class="name">${category[n].NAME}</div>
                        <div class="category">${categoryName}</div>
                    </div>
                </a>`;
        }
    }
}

// Обработчики событий для кнопок
document.getElementById('allButton').addEventListener('click', () => code(array_all, "Всё"));
document.getElementById('codeButton').addEventListener('click', () => code(array_code, "Программирование"));
document.getElementById('programButton').addEventListener('click', () => code(array_program, "Программы"));
document.getElementById('extensionsButton').addEventListener('click', () => code(array_extensions, "Расширения"));

window.onload = () => {
    document.body.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme');
};

// Время полной отрисовки страницы
let loadTime = (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) / 1000;
console.log("Время загрузки:", loadTime.toFixed(3), "сек");

document.getElementById('plusButton').addEventListener('click', function() {
    window.open('ADD.html', '_blank');
});
