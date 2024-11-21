document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get({ bookmarks: [] }, function(result) {
        const bookmarks = result.bookmarks.map(bookmark => {
            const displayContent = bookmark.url.match(/\.(glb|gltf)$/) ? `<model-viewer src="${bookmark.url}" alt="${bookmark.title}" auto-rotate camera-controls></model-viewer>`
                : bookmark.url.match(/\.(mp4|webm)$/) ? `<video src="${bookmark.url}" controls></video>`
                : `<img src="${bookmark.icon || 'default-icon.png'}" alt="${bookmark.title}">`;
            return `<li>
                <a href="${bookmark.url}" target="_blank">${displayContent}</a>
                <p>${bookmark.title}</p>
                <p>${bookmark.folder}</p>
            </li>`;
        }).join('');
        document.getElementById('bookmarkList').innerHTML = bookmarks;
    });
});

function deleteBookmark(index) {
    chrome.storage.sync.get({ bookmarks: [] }, function(result) {
        const bookmarks = result.bookmarks;
        bookmarks.splice(index, 1);
        chrome.storage.sync.set({ bookmarks }, loadBookmarks);
    });
}

function loadBookmarks() {
    chrome.storage.sync.get({ bookmarks: [] }, function(result) {
        const bookmarks = result.bookmarks.map((bookmark, index) => {
            const displayContent = bookmark.url.match(/\.(glb|gltf)$/) ? `<model-viewer src="${bookmark.url}" alt="${bookmark.title}" auto-rotate camera-controls></model-viewer>`
                : bookmark.url.match(/\.(mp4|webm)$/) ? `<video src="${bookmark.url}" controls></video>`
                : `<img src="${bookmark.icon || 'default-icon.png'}" alt="${bookmark.title}">`;
            return `<li>
                <a href="${bookmark.url}" target="_blank">${displayContent}</a>
                <p>${bookmark.title}</p>
                <p>${bookmark.folder}</p>
                <button onclick="deleteBookmark(${index})">Delete</button>
            </li>`;
        }).join('');
        document.getElementById('bookmarkList').innerHTML = bookmarks;
    });
}
document.addEventListener('DOMContentLoaded', loadBookmarks);
