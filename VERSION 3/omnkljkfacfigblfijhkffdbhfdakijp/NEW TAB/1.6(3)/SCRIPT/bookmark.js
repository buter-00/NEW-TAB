chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentURL = tabs[0].url;
    document.getElementById('addBookmarkButton').addEventListener('click', function() {
        const title = prompt("Введите название закладки:");
        if (!title) return;
        const form = document.createElement('div');
        form.innerHTML = `
            <div style="width: 300px; padding: 20px; background: white; border: 1px solid #ccc; border-radius: 10px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000;">
                <h3>Добавить закладку</h3>
                <label>
                    <span>Название:</span>
                    <input type="text" id="bookmarkTitle" value="${title}">
                </label>
                <label>
                    <span>URL:</span>
                    <input type="text" id="bookmarkURL" value="${currentURL}" readonly>
                </label>
                <label>
                    <span>Иконка:</span>
                    <img id="bookmarkIconPreview" alt="Icon Preview" style="width: 100px; height: 100px; display: none;">
                    <input type="file" id="bookmarkIcon" accept="image/*">
                </label>
                <label>
                    <span>Папка:</span>
                    <select id="bookmarkFolder">
                        <option value="default">Панель закладок</option>
                        <option value="folder1">Folder 1</option>
                        <option value="folder2">Folder 2</option>
                    </select>
                </label>
                <div>
                    <button id="saveBookmark">Сохранить</button>
                    <button id="cancelBookmark">Отмена</button>
                </div>
            </div>`;
        document.body.appendChild(form);
        document.getElementById('bookmarkIcon').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const icon = e.target.result;
                document.getElementById('bookmarkIcon').setAttribute('data-icon', icon);
                document.getElementById('bookmarkIconPreview').src = icon;
                document.getElementById('bookmarkIconPreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('saveBookmark').addEventListener('click', function() {
            const title = document.getElementById('bookmarkTitle').value;
            const url = document.getElementById('bookmarkURL').value;
            const icon = document.getElementById('bookmarkIcon').getAttribute('data-icon');
            const folder = document.getElementById('bookmarkFolder').value;
            chrome.storage.sync.get({ bookmarks: [] }, function(result) {
                const bookmarks = result.bookmarks;
                bookmarks.push({ title, url, icon, folder });
                chrome.storage.sync.set({ bookmarks }, function() {
                    alert("Закладка добавлена!");
                    document.body.removeChild(form);
                });
            });
        });
        document.getElementById('cancelBookmark').addEventListener('click', function() {
            document.body.removeChild(form);
        });
    });
});

document.getElementById('saveBookmarkButton').addEventListener('click', function() {
    window.open('bookmarks.html', '_blank');
});
