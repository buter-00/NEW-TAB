document.addEventListener("DOMContentLoaded", () => {
    const appMain = document.getElementById('app_main');

    // Создание заголовка
    const header = document.createElement('div');
    header.id = 'header';
    header.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-6">
                    <div class="app-search">
                        <div class="app-search-input">
                            <button class="btn btn-default">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                    <button id="plusButton">+</button>
                    <button id="allButton">Всё</button>
                    <button id="codeButton">Программирование</button>
                    <button id="programButton">Программы</button>
                </div>
                <div class="col-xs-6 text-right">
                    <button class="btn btn-default">
                        <i class="fa fa-plus"></i>
                    </button>
                    <button type="button" class="btn btn-default">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>`;
    appMain.appendChild(header);

    // Создание основной панели
    const appBoard = document.createElement('div');
    appBoard.id = 'app-board';
    appBoard.style.minWidth = '1210px';
    appBoard.innerHTML = `
        <div class="row row-5">
            <div id="_board_col_0" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_1" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_2" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_3" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_4" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_5" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
        </div>`;
    appMain.appendChild(appBoard);

    // Ваша логика Interact.js, добавление контейнеров и прочее
    // Пример:
    interact('.columns-dropzone').dropzone({
        accept: '.list-container',
        overlap: 0.5,
        ondropactivate: function (event) {
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        },
        ondragleave: function (event) {
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        },
        ondrop: function (event) {
            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;
            dropzoneElement.appendChild(draggableElement);
        },
        ondropdeactivate: function (event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const appMain = document.getElementById('app_main');

    // Создание заголовка
    const header = document.createElement('div');
    header.id = 'header';
    header.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-6">
                    <div class="app-search">
                        <div class="app-search-input">
                            <button class="btn btn-default">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                    <button id="plusButton">+</button>
                    <button id="allButton">Всё</button>
                    <button id="codeButton">Программирование</button>
                    <button id="programButton">Программы</button>
                </div>
                <div class="col-xs-6 text-right">
                    <button class="btn btn-default">
                        <i class="fa fa-plus"></i>
                    </button>
                    <button type="button" class="btn btn-default">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>`;
    appMain.appendChild(header);

    // Создание основной панели
    const appBoard = document.createElement('div');
    appBoard.id = 'app-board';
    appBoard.style.minWidth = '1210px';
    appBoard.innerHTML = `
        <div class="row row-5">
            <div id="_board_col_0" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_1" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_2" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_3" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_4" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
            <div id="_board_col_5" class="_board_cols" style="width: 16.6667%;">
                <div class="columns-dropzone"></div>
            </div>
        </div>`;
    appMain.appendChild(appBoard);

    // Функция добавления контейнера
    const addContainer = (title) => {
        const newContainer = document.createElement('div');
        newContainer.classList.add('list-container');
        newContainer.setAttribute('draggable', 'true');
        newContainer.innerHTML = `
            <div class="links-container">
                <div class="links-container-header">
                    <div class="links-container-title">${title}</div>
                    <div class="title-btns">
                        <span class="btn"><i class="fa fa-fw fa-ellipsis-v"></i></span>
                    </div>
                </div>
                <div class="links-container-body">
                    <div class="dropArea">
                        <div title="New Link" class="link"><img src=" ">New Link</div>
                    </div>
                </div>
            </div>`;
        return newContainer;
    };

    // Пример добавления контейнера
    document.getElementById('plusButton').addEventListener('click', () => {
        const container = addContainer("New Container");
        document.querySelector('.columns-dropzone').appendChild(container);
        // Подключение drag-and-drop к новому контейнеру
        interact(container).draggable({
            inertia: true,
            autoScroll: true,
            onmove: dragMoveListener
        });
    });

    // Ваша логика Interact.js, добавление контейнеров и прочее
    interact('.columns-dropzone').dropzone({
        accept: '.list-container',
        overlap: 0.5,
        ondropactivate: function (event) {
            event.target.classList.add('drop-active');
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        },
        ondragleave: function (event) {
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        },
        ondrop: function (event) {
            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;
            dropzoneElement.appendChild(draggableElement);
        },
        ondropdeactivate: function (event) {
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });

    function dragMoveListener(event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    // Сделать dragMoveListener доступным глобально
    window.dragMoveListener = dragMoveListener;
});
