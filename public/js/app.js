"use strict";var app = app || {};app.currentPage = 0;app.searchGames = function () {	app.currentPage = 1;	app.message.style.display = "none";	return app.getGames(escape(document.getElementById("search-box").value.trim()), false);};app.navigatePreviousGames = function () {	document.getElementById("search-box").focus();	if (!app.dataInProgress) {		--app.currentPage;		app.getGames(false, app.data._links.prev);	}	return false;};app.navigateNextGames = function () {	document.getElementById("search-box").focus();	if (!app.dataInProgress) {		++app.currentPage;		app.getGames(false, app.data._links.next);	}	return false;};app.response = function (data) {	clearTimeout(app.jsonpTimer);	app.ps.publish("onData", data);};app.setGames = function (data) {	var total;	app.ps.unsubscribe("onData", app.setGames);	app.data = data;	app.dataInProgress = false;	total = data ? data._total : 0;	document.body.removeChild(app.script);  // remove the script tag		if (!total) {		app.results.style.display = "none";		app.errorMessage.style.display 	= "block";		return;	}	app.errorMessage.style.display 	= "none";	app.results.style.display = "block";	app.error = false;	app.currentPage = total ? app.currentPage : total;  // check if streams available		app.disableButtons(total);		app.totalResults.textContent = total;	app.navigationNumber.textContent = app.getNavigationNumber(total);	app.renderList(data);};app.renderList = function (data) {	var description, currentStream, gameLink;	for (var i = 0; i < 5; i++) {		var	image 		= document.createElement("img"),			a 			= document.createElement("a"),			p 			= document.createElement("p"),			span		= document.createElement("span"),			div			= document.createElement("div"),			li 			= document.createElement("li"),			docFragment = document.createDocumentFragment(),			item 		= document.getElementById("game-results");					currentStream = data.streams[i];		if (currentStream) {			image.src = currentStream.preview.medium;			image.className = "game-image";			span.textContent = "Game name - " + currentStream.channel.display_name;			description = "The game, " + currentStream.channel.game + ", was created at" + currentStream.created_at + " and has been viewed by " + currentStream.viewers + ".";			p.textContent = description;			div.appendChild(span);			div.appendChild(p);			div.className = "game-data";			a.href = currentStream.channel.url;			a.target = "_blank";			a.appendChild(image);			a.appendChild(div);						li.className = "game-row";			li.appendChild(a);		}    	    	docFragment.appendChild(li);    	item.replaceChild(docFragment, item.childNodes[i]);	}};app.disableButtons = function (total) {	app.previousImage.disabled = !app.data._links.prev;	app.nextImage.disabled = app.currentPage === Math.ceil(total/5);};app.getNavigationNumber = function (total) {	return app.currentPage + "/" + Math.ceil(total/5);};