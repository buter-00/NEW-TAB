chrome.runtime.onInstalled.addListener(function (obj){
	var reason = obj.reason;
	if(reason == "install"){
		setOnInstall();
	}else if(reason == "update"){
		onAppUpdate();
	}
});

function setOnInstall() {
	// _gaq.push(['_trackEvent', 'extensions', 'install']);
	// setAppData();
	setDefaultAppData();
}

const fixBrokenLinks = (links) => {
	const fixLinks = [ {
		broken: "https://ad.admitad.com/g/1d9ed345dd21a60bd21cdc28f2033d/",
		fixed: "https://www.wildberries.ru/"
	}, {
		broken: "https://ad.admitad.com/g/tekzyq4q2i21a60bd21cf7c2d5eccb/",
		fixed: "https://worldoftanks.ru/"
	}, {
		broken: "https://ad.admitad.com/g/40f3crspww21a60bd21c9dc87d04ab/",
		fixed: "https://worldofwarships.ru/"
	}, {
		broken: "https://alitems.com/g/1e8d11449421a60bd21c16525dc3e8/",
		fixed: "https://ru.aliexpress.com/"
	}, {
		broken: "https://modato.ru/g/3f2779c2d421a60bd21c4e8640d77b/",
		fixed: "https://www.lamoda.ru/"
	}, {
		broken: "https://pafutos.com/g/slzpfzyb7j21a60bd21cf4f7b11c0c/",
		fixed: "https://www.ulmart.ru/"
	}, {
		broken: "https://ad.admitad.com/g/dru1fiprm421a60bd21cc54bdbf551/",
		fixed: "https://www.dresslily.com/"
	}];
	
	return links.map(link => {
		const findInBrokens = fixLinks.findIndex(v => v.broken === link.url);
		if(findInBrokens !== -1) {
			console.log("FIX", link.url, fixLinks[findInBrokens].fixed);
			link.url = fixLinks[findInBrokens].fixed;
		}
		return link;
	});
}

const chromeStoreGet = (item) => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(item, (answer) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			const result = JSON.parse(answer[item]);
			resolve(result);
		});
	});
};


const chromeStoreSet = (object) => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(object, (answer) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve();
		})
	})
}

const onAppUpdate = async () => {
	try {
		let boards = await chromeStoreGet("boards");

		boards = boards.map(board => {
			board.lists = board.lists.map(list => {
				list.links = fixBrokenLinks(list.links);
				return list;
			});
			return board;
		});

		await chromeStoreSet({boards: JSON.stringify(boards)});
		refreshTabs();
	} catch (error) {
		console.error(error);
	}
};



function setAppData() {
	console.log('SET APP DATA', 'start');
	var ui_locale = chrome.i18n.getMessage('@@ui_locale');
	if(!ui_locale) ui_locale = 'en';
	var req_url = "https://friendly-tab.net/api/default.data/" + ui_locale;

	var xhr = new XMLHttpRequest();
	xhr.open("GET", req_url);
	xhr.timeout = 5000;

	xhr.onload = function () {
		console.log('SET APP DATA', 'server onload');
		var j_boards;
		var j_opt;

		try {
			var data = JSON.parse(this.responseText);
			j_boards = JSON.stringify(data.boards);
			j_opt = JSON.stringify(data.opt);

			
			console.log(data)
			// if(data.ab) {
			// 	localStorage['ab_name'] = data.ab.name;
			// 	localStorage['ab_value'] = data.ab.value;
			// 	setUninstalLink()
			// }
		} catch (error) {
			console.log('SET APP DATA', 'json parse error');
			console.error(error)
			setDefaultAppData()
		}

		
		chrome.storage.local.set({boards: j_boards}, function() {
			chrome.storage.local.set({options: j_opt}, function() {
				console.log('SET APP DATA', 'success!');
				chrome.storage.local.set({last_update: Date.now()});
				refreshTabs();
			});
		});
	};
	
	xhr.ontimeout = function (e) {
		console.log('SET APP DATA', 'error timeout');
		setDefaultAppData();
	};
	xhr.onerror = function (e) {
		console.log('SET APP DATA', 'error other');
		setDefaultAppData();
	};

	xhr.send(null);
}


function setDefaultAppData() {
	console.log('SET APP DATA (local)', 'start');

	var defaultOpt = {
		search: 'google',
		lang: 'ru',
		columns: 6,
		width_type: 'auto',
		width_px: 1210,
		token: null
	};

	var _lists = [{
		links: [{
			title: "Twitter",
			url: "https://twitter.com/"
		},{
			title: "Facebook",
			url: "https://www.facebook.com/"
		},{
			title: "LinkedIn",
			url: "https://www.linkedin.com/"
		},{
			title: "YouTube",
			url: "https://www.youtube.com/"
		},{
			title: "Reddit",
			url: "https://www.reddit.com/"
		}],
		title: "Social Networks",
		column: 0
	},
	
	{
		links: [{
			title: "Instagram",
			url: "https://www.instagram.com/"
		},{
			title: "Pinterest",
			url: "https://www.pinterest.com/"
		},{
			title: "Tumblr",
			url: "https://www.tumblr.com/"
		}],
		title: "Social Networks 2",
		column: 0
	},
		
	
	{
		links: [{
			title: "Amazon",
			url: "https://www.amazon.com/"
		},{
			title: "Ebay",
			url: "https://www.ebay.com/"
		},{
			title: "AliExpress",
			url: "https://www.aliexpress.com/"
		}],
		title: "Online Shopping",
		column: 1
	}, {
		links: [{
			title: "Steam",
			url: "https://steamcommunity.com/"
		},{
			title: "Origin",
			url: "https://www.origin.com/"
		},{
			title: "Epic Games",
			url: "https://www.epicgames.com/"
		},{
			title: "World of Tanks",
			url: "https://worldoftanks.com/"
		},{
			title: "World of Warships",
			url: "https://worldofwarships.com/"
		}],
		title: "Games",
		column: 5
	}];

	var defaultBoards = [{
		lists: _lists,
		share: false,
		type: "normal",
		favicon_sourse: "internet",
		name: "Main Page",
		bgColor: "#afd0d9",
		bgImage: "https://images6.alphacoders.com/113/1139907.jpg"
	}];

	var j_boards;
	var j_opt;

	try {
		j_boards = JSON.stringify(defaultBoards);
		j_opt = JSON.stringify(defaultOpt);
	} catch (error) {
		console.log('SET APP DATA (local)', 'fatal error');
		console.error(error)
	}

	
	chrome.storage.local.set({boards: j_boards}, function() {
		chrome.storage.local.set({options: j_opt}, function() {
			console.log('SET APP DATA (local)', 'success!');
			chrome.storage.local.set({last_update: Date.now()});
			refreshTabs();
		});
	});
}





function checkUpdate(sender_tab) {
	// сохраняем время последней проверки
	// localStorage['last_sync'] = Date.now() / 1000 | 0;

	chrome.storage.local.get(['options'], function(result) {
		try {
			var opt = JSON.parse(result.options);
		} catch (error) {
			return false;
		}

		// console.log(opt)
		
		if(opt.token) {
			var xhr = new XMLHttpRequest();
			// xhr.withCredentials = true;
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					if(sender_tab && sender_tab.id) chrome.tabs.sendMessage(sender_tab.id, 'check_update_ready');

					try {
						var answer = JSON.parse(this.responseText)
					} catch (err) {
						console.error(err)
						return false;
					}

					var app_data = answer.result;
					console.log(app_data)
					chrome.storage.local.get(['last_update'], function(result) {
						console.log(result.last_update, Date.parse(app_data.date))
						console.log(result.last_update - Date.parse(app_data.date))
						console.log(result.last_update - Date.parse(app_data.date) > -10000)

						if(!result.last_update) return false;
						console.log('GOOD 1')
						if(result.last_update - Date.parse(app_data.date) > -10000) return false;

						console.log('GOOD 2')

						Object.keys(app_data.options).forEach(function(key) {
							opt[key] = app_data.options[key];
						});
						
						chrome.storage.local.set({boards: JSON.stringify(app_data.boards)}, function() {
							chrome.storage.local.set({options: JSON.stringify(opt)}, function() {
								chrome.storage.local.set({last_update: Date.now()});
								refreshTabs();
							});
						});
					});
				}
			});
			xhr.open("GET", "https://friendly-tab.net/api/sync");
			xhr.setRequestHeader("authorization", opt.token);
			xhr.setRequestHeader("cache-control", "no-cache");

			xhr.send(null);
		}
	});
}
// checkUpdate();



// проверка необходимости обновления при запуске браузера
chrome.storage.local.get(['need_update_clound'], function(result) {
	// if(result.need_update_clound == true) putSync();
});




function putSync() {
	console.log('Need Update Clound (2)')
	// localStorage['last_sync'] = Date.now() / 1000 | 0;

	chrome.storage.local.get(['options'], function(result) {
		try {
			var opt = JSON.parse(result.options);
		} catch (error) {
			return false;
		}

		
		if(opt.token) {
			chrome.storage.local.get(['boards'], function(res) {
				if(res.boards) {
					var _boards;

					try {
						_boards = JSON.parse(res.boards);
						_boards = _boards.map(function(arr) {
							if(arr.bgImageBase64) delete arr.bgImageBase64;
							return arr;
						})
						_boards.forEach(board => {
							board.lists.forEach(list => {
								list.links.map(link => {
									if(link.favicon_cache) delete link.favicon_cache;
									return link;
								})
							})
						})
					} catch (error) {
						console.error(err);
						return;
					}

					// var data = {
					// 	boards: _boards,
					// 	options: opt
					// };
					// var xhr = new XMLHttpRequest();
					// xhr.addEventListener("readystatechange", function () {
					// 	if (this.readyState === 4) {
					// 		var answer = JSON.parse(this.responseText);
					// 		console.log(answer)
					// 		chrome.storage.local.set({need_update_clound: false});
					// 	}
					// });
					// xhr.open("POST", "https://friendly-tab.net/api/sync", true);
					// xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
					// xhr.setRequestHeader("authorization", opt.token);
					// xhr.setRequestHeader("cache-control", "no-cache");
					// xhr.send(JSON.stringify(data));
				}
			})
			
		}
	});
}


var _t = null;
var syncTimer = function(){
	if(_t != null) clearTimeout(_t)
	_t = setTimeout(function(){
		// putSync();
	}, 5000);
};



chrome.runtime.onMessage.addListener(function (request, sender, cb) {
	if(request == 'need_update_clound') {
		console.log('Need Update Clound (1)')
		chrome.storage.local.set({need_update_clound: true});
		syncTimer();
	} else if(request == 'check_update') {
		// checkUpdate(sender.tab);
	} else if(request == 'refresh_all_tab') {
		refreshTabs();
	}
})





function setUninstalLink() {
	if(chrome.runtime.setUninstallURL) {
		chrome.runtime.setUninstallURL('https://friendly-tab.net/uninstall/');
	}
}
setUninstalLink()




var refreshTabs = function() {
	chrome.tabs.query({windowType: 'normal'}, function(tabs) {
		tabs.filter(function(tab){
			if(tab.url == 'chrome://newtab/') return true;
			else return false;
		}).forEach(function(tab) {
			chrome.tabs.sendMessage(tab.id, {action: 'need-refresh-data'});
		});
	})
}



/**
 * ===================================
 *         OMNIBOX FUNCTIONS
 * ===================================
 */
function navigate(link_obg) {
	if(link_obg.length == 0) return;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.update(tabs[0].id, {url: link_obg.url});
	});
}

function resetDefaultSuggestion() {
	chrome.omnibox.setDefaultSuggestion({
		description: '<match>Быстрый поиск по сохраненным ссылкам <url>β</url></match>'
	});
}

var searchInBoards = function(search_str, cb) {
	if(search_str.length == 0) return;

	chrome.storage.local.get(['boards'], function(res) {
		if(res.boards) {
			var boards = JSON.parse(res.boards);
			// cb(boards);

			var _links = [];

			boards.forEach(function(_b){
				if(_b.type === 'secret') return true; // исключаем из поиска секретные коллекции

				_b.lists.forEach(function(_list){
					_list.links.forEach(function(_link){

						if (/^-u/.test(search_str)) {
							// search in url
							var query = search_str.replace(/-u |-u/, '');
							
							// var regStr = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
							var reg = new RegExp(query, 'i');
							if(_link.url.search(reg) != -1) {
								var s1 = _link.title.replace(/["'<>&]/gi, '');
								var s2 = _b.name.replace(/["'<>&]/gi, '');
								var s3 = _list.title.replace(/["'<>&]/gi, '');

								_links.push({
									desc: s1 + ' <dim> — <url>'+s2+'</url> → <url>'+s3+'</url></dim>',
									title: _link.title,
									url: _link.url
								});
							}

						} else {

							// search in title
							// var regStr = search_str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
							var reg = new RegExp(search_str, 'i');
							if(_link.title.search(reg) != -1) {
								var s1 = _link.title.replace(/["'<>&]/gi, '');
								var s2 = _b.name.replace(/["'<>&]/gi, '');
								var s3 = _list.title.replace(/["'<>&]/gi, '');

								_links.push({
									desc: s1.replace(reg, '<match>$&</match>') + ' <dim> — <url>'+s2+'</url> → <url>'+s3+'</url></dim>',
									title: _link.title,
									url: _link.url
								});
							}
							
						}
						
					});
				});
			});

			cb(_links);
		} else {
			// cb();
		}
	});
}


var omnibox_search_result = [];
chrome.omnibox.onInputChanged.addListener(function (text, suggest){
	searchInBoards(text, function(results) {
		console.log(results)
		omnibox_search_result = results;
		var suggest_results = results.map(function(arr) {
			return {
				content: arr.url,
				description: arr.desc
			}
		});
		suggest(suggest_results)

		chrome.omnibox.setDefaultSuggestion({
			description: '<match>Search Result: <url>'+results.length+'</url></match>'
		});
	});
})


chrome.omnibox.onInputEntered.addListener(function(text) {
	var link;
	if(omnibox_search_result.length == 0) {
		return false;
	} else if(omnibox_search_result.length == 1) {
		link = omnibox_search_result[0];
		navigate(link)
	} else {
		var filter_1 = omnibox_search_result.filter(function(arr) {
			return arr.url == text;
		})
		
		if(filter_1.length == 0) {
			navigate(omnibox_search_result[0])
		} else {
			navigate(filter_1[0])
		}
	}
});



/**
 * ===================================
 *         INTERVAL 24H SYNC
 * ===================================
 */
// var intervalSync = function() {
// 	if(!localStorage.last_sync) return;

// 	var _d = (Date.now() / 1000 | 0) - localStorage.last_sync;
// 	if(_d >= (1000 * 60 * 60 * 12)) {
// 		putSync();
// 	}
// }
// setTimeout(function() {
// 	setInterval(intervalSync, 1000 * 60)
// }, 1000 * 60)

const getFaviconUrl = (favicon_path) => {
	const url = new URL(chrome.runtime.getURL("/_favicon/"));
	url.searchParams.set("pageUrl", favicon_path);
	url.searchParams.set("size", "32");
	return url.toString();
}

function cachingAllFavicon() {
	chrome.storage.local.get(['boards'], function(data) {
		var boards_json = data.boards;
		var boards;
		var need_iteration = 0;
		var already_iteration = 0;

		try {
			boards = JSON.parse(boards_json);
		} catch (err) {
			console.error(err)
			return false;
		}

		
		console.log(boards)

		boards.forEach(function(board, board_num) {
			if(board.type == "secret") return;
			if(board.lists.length == 0) return;
			
			board.lists.forEach(function(list, list_num) {
				if(list.links.length == 0) return;

				list.links.forEach(function(link, link_i) {
					if(link.favicon_cache) return;

					var favicon_url = getFaviconUrl(link.url);
					need_iteration += 1;

					toDataUrl(favicon_url, function(favicon_data) {
						already_iteration += 1;
						link.favicon_cache = favicon_data;

						console.log(need_iteration, already_iteration)

						if(need_iteration == already_iteration) {
							setBoards(boards, function() {
								console.log('cachingAllFavicon', 'DONE')
							})
						}
					})
				})
			})
		})
	})
}


function setBoards(data, callback) {
	var j_boards;

	try {
		j_boards = JSON.stringify(data);
	} catch (err) {
		console.error(err)
	}

	chrome.storage.local.set({boards: j_boards}, function() {
		callback()
	});
}






function toDataUrl(url, callback) {
	/**
	 * Конвертация ссылки на изображение в Base64
	 */
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var reader = new FileReader();
		reader.onloadend = function() {
			callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
	};
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}