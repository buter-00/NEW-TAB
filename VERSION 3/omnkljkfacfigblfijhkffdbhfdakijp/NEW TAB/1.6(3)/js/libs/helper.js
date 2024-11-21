const _helper = _h = {};

/**
 * Преобразовывает ссылку на изображение в Base64
 */
_helper.imageUrl_to_Base64 = (url) => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.onload = function() {
			let reader = new FileReader();
			reader.onloadend = function() {
				resolve(reader.result);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.onerror = function(err) {
			// reject(err);
			resolve(null);
		}
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	});
}


/**
 * Преобразовывает объект изображения в Base64 (через канвас)
 */
_helper.imageObj_to_Base64 = (img) => {
	return new Promise((resolve, reject) => {
		let canvas = document.createElement("canvas");
		let w = img.width, h = img.height;

		canvas.width = w;
		caches.height = h;
		let ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, w, h);
		let dataUrl = canvas.toDataURL("image/png");

		resolve(dataUrl);
	});
};


const getFaviconUrl = (favicon_path) => {
	const url = new URL(chrome.runtime.getURL("/_favicon/"));
	url.searchParams.set("pageUrl", favicon_path);
	url.searchParams.set("size", "32");
	return url.toString();
}

_helper.getFaviconUrl = (link, favicon_sourse) => {
	if(favicon_sourse == 'internet' || link.favicon_url) {
		let l = document.createElement("a");

		if(link.favicon_url) l.href = link.favicon_url;
		else l.href = link.url;

		let origin = l.origin;
		return origin+'/favicon.ico';
	} else {
		var pixelRadio = 1;
		if(window.devicePixelRatio) pixelRadio = window.devicePixelRatio;
		return getFaviconUrl(link.url);
	}
}


_helper.copy = data => JSON.parse(JSON.stringify(data));



// FAVICON CACHED
_helper.favicon_cached_data = {};
_helper.count_favWithoutCache = (board, board_num) => {
	let count = 0;
	if(board.lists.length != 0) {
		board.lists.forEach(_list => {
			_list.links.forEach(_link => {
				if(!_link.favicon_cache) count += 1;
			});
		});
	}
	if(count != 0) {
		_helper.favicon_cached_data[board_num] = {
			need: count,
			done: 0
		};
		console.info('favicon without cache:', count)
	}
}



_helper.clearOtherBoardsData = (boards) => {
	let new_b = JSON.parse(JSON.stringify(boards))
	new_b.forEach((board, i) => {
		if(board.bgImageBase64) delete board.bgImageBase64;
		board.lists.forEach(list => {
			list.links.map(link => {
				if(link.favicon_cache) delete link.favicon_cache;
				return link;
			})
		})
	})
	return new_b;
}


_helper.cachingBg = (img_url, cb) => {
	let canvas = document.createElement("canvas");
	let img = document.createElement("img");

	img.onload = function() {
		let w = img.width / 200;
		let h = img.height / 200;

		canvas.width = w;
		canvas.height = h;
		let ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, w, h);
		let smallImage = canvas.toDataURL("image/png");

		// w = img.width / 2;
		// h = img.height / 2;

		// canvas.width = w;
		// canvas.height = h;
		// ctx.drawImage(img, 0, 0, w, h);
		// let middleImage = canvas.toDataURL("image/png");

		// console.log('smallImage', smallImage.length)
		// console.log('middleImage', middleImage.length)

		cb(smallImage)
	};
	img.src = img_url;
}