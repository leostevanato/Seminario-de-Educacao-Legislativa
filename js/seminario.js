var script_tag_youtube = document.createElement('script');
script_tag_youtube.src = "https://www.youtube.com/iframe_api";

// Adiciona o script_tag_youtube criado antes de todos os scitps
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(script_tag_youtube, firstScriptTag);

var player1;

// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
	let player1_video_id = document.querySelector('#video-1').getAttribute("data-video-id");

	player1 = new YT.Player('video-1', {
		width: '242',
		height: '136.125',
		videoId: player1_video_id,
		events: {
			'onReady': setPlayerYoutubeSize,
		}
	});
}

function setPlayerYoutubeSize(event) {
	// event pode ser um evento (quando chamado dos events da função onYouTubeIframeAPIReady por exemplo) ou pode ser um elemento. Então fazemos a verificação para que player sempre receba o elemento correto.
	let player = (typeof event.target === "undefined") ? event : event.target;

	if (window.screen.width >= 1200) {
		player.setSize(685, 385.3125);
	} else if (window.screen.width >= 576 && window.screen.width < 1200) {
		player.setSize(396, 222.75);
	} else {
		player.setSize(242, 136.125);
	}
}

function substituirTextoInnerHtml(elemento, txt_velho, txt_novo) {
	elemento.innerHTML = elemento.innerHTML.replace(txt_velho, txt_novo);
}

function elementoClick(element) {
	element.addEventListener("click", function (event) {
		if (element.getAttribute("data-alvo") != null) {
			let elemento;

			if (document.querySelector('.item-menu[data-item="' + element.getAttribute("data-alvo") + '"]')) {
				elemento = document.querySelector('.item-menu[data-item="' + element.getAttribute("data-alvo") + '"]');
			}
			
			if (typeof elemento !== 'undefined') {
				setItemMenuAtivo(elemento);
			}
		}
		
		if (element.getAttribute("data-link") != null) {
			window.open(element.getAttribute("data-link"));
			return false;
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	substituirTextoInnerHtml(document.querySelector('#seminario-de-educacao-legislativa'), string_alvo, codigo_pasta_arquivos);
});

$(document).ready(() => {
	const itens_menu = [
		"Início",
		"Sobre o evento",
		"Boas-vindas",
		"Acesse o evento",
		"Programação",
		"Rede do Legislativo",
		"Certificado",
		"Gravações"
	];

	const slugify = str =>
		str.toLowerCase()
			.trim()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	
	function setItemMenuAtivo(elemento) {
		if(typeof item_menu_ativo === 'undefined' || item_menu_ativo.getAttribute("data-item") != elemento.getAttribute("data-item")) {
			if(itemMenuList) {
				itemMenuList.forEach(item => item.classList.remove("ativo"));
			}

			elemento.classList.add("ativo");
			item_menu_ativo = elemento;

			document.querySelector('#coluna-conteudo').dataset.itemAtivo = elemento.getAttribute("data-item");

			document.querySelectorAll(".item-conteudo").forEach(item => item.classList.remove("ativo"));
			
			document.querySelector('.item-conteudo[data-item="' + elemento.getAttribute("data-item") + '"]').classList.add("ativo");

			if (document.querySelector('.item-conteudo[data-item="' + elemento.getAttribute("data-item") + '"]').getAttribute("data-mostrar-logos") === "true") {
				document.querySelector('.logos').classList.add("ativo");
			} else {
				document.querySelector('.logos').classList.remove("ativo");
			}

			if (elemento.getAttribute("data-item") !== "boas-vindas") {
				if (typeof player1 !== "undefined" && player1.getPlayerState() === 1) {
					player1.pauseVideo();
				}
			}
		}
	}

	function animarMenu() {
		if(largura_coluna !== "") {
			$("#coluna-lateral").animate({
				width: largura_coluna
			}, 300);

			$("#menu-lateral").animate({
				marginLeft: esquerda_menu,
				opacity: opacity_menu
			}, 300, function() {
				if(opacity_menu == 0) {
					$(this).hide();
				}
			});

			$("#fundo-sombra").fadeToggle();
		}
	}

	var largura_coluna = "";
	var esquerda_menu = "";
	var opacity_menu = 0;
	var item_menu_ativo;
	var layout_mobile_width = 768;
	var layout_mobile = true;

	if (window.screen.width >= layout_mobile_width) {
		layout_mobile = false;
	}

	const iconeMenu = document.getElementById('icone-menu');
	const menuLateral = document.getElementById('menu-lateral');
	const resetarMenu = new Event('resetar');
	const abrirMenu = new Event('abrir');
	const fecharMenu = new Event('fechar');
	const trocarMenu = new Event('trocar');
	
	menuLateral.addEventListener('resetar', function (e) {
		menuLateral.classList.remove("aberto", "fechado");
		largura_coluna = "";
		esquerda_menu = "";
		opacity_menu = 0;
		menuLateral.removeAttribute('style');
		document.getElementById('coluna-lateral').removeAttribute('style');
		document.getElementById('fundo-sombra').removeAttribute('style');
	}, false);
		
	menuLateral.addEventListener('abrir', function (e) {
		if (layout_mobile) {
			menuLateral.classList.remove("fechado");
			menuLateral.classList.add("aberto");
			iconeMenu.classList.remove("fechado");
			iconeMenu.classList.add("aberto");

			largura_coluna = "172px";
			esquerda_menu = "26px";
			opacity_menu = 1;

			menuLateral.style.display = "block";
			
			animarMenu();
		}
	}, false);
	
	menuLateral.addEventListener('fechar', function (e) {
		if (layout_mobile) {
			menuLateral.classList.remove("aberto");
			menuLateral.classList.add("fechado");
			iconeMenu.classList.remove("aberto");
			iconeMenu.classList.add("fechado");

			largura_coluna = "52px";
			esquerda_menu = "0px";
			opacity_menu = 0;

			animarMenu();
		}
	}, false);

	menuLateral.addEventListener('trocar', function (e) {
		if (layout_mobile) {
			if (menuLateral.classList.contains("aberto")) {
				menuLateral.dispatchEvent(fecharMenu);
			} else {
				menuLateral.dispatchEvent(abrirMenu);
			}
		}
	}, false);
	
	itens_menu.forEach((value, index) => {
		var novo_item = document.createElement("div");

		novo_item.classList.add("item-menu");
		novo_item.innerText = value;
		novo_item.dataset.item = slugify(value);
				
		menuLateral.appendChild(novo_item);

		if (index == 0) {
			setItemMenuAtivo(novo_item);
		}

		if (index != itens_menu.length - 1) {
			var item_menu_separador = document.createElement("div");
	
			item_menu_separador.classList.add("item-menu-separador");

			menuLateral.appendChild(item_menu_separador);
		}
	});

	var itemMenuList = document.querySelectorAll(".item-menu");

	itemMenuList.forEach((element) => {
		let itemConteudo = document.querySelector('.item-conteudo[data-item="' + element.getAttribute("data-item") + '"]');

		if (itemConteudo.getAttribute("data-link") != null) {
			element.dataset.link = itemConteudo.getAttribute("data-link");
		}

		element.addEventListener("click", function (event) {
			if (element.getAttribute("data-link") != null) {
				window.open(element.getAttribute("data-link"));
				return false;
			} else {
				setItemMenuAtivo(element);
				menuLateral.dispatchEvent(fecharMenu);
			}
		});
	});

	iconeMenu.addEventListener("click", function () {
		menuLateral.dispatchEvent(trocarMenu);
	}, false);

	var linkDentroTextoList = document.querySelectorAll(".link-dentro-texto");
	var botaoCtaList = document.querySelectorAll(".botao-cta");

	linkDentroTextoList.forEach((elemento) => {
		elementoClick(elemento);
	});

	botaoCtaList.forEach((element) => {
		elementoClick(element);
	});
	
	var caixas = document.querySelectorAll(".caixa");

	caixas.forEach((element) => {
		element.addEventListener("click", function (event) {
			window.open(element.getAttribute("data-link"));
			return false;
		});
	});
	
	window.addEventListener('resize', () => {
		if (window.screen.width >= layout_mobile_width) {
			layout_mobile = false;
			menuLateral.dispatchEvent(resetarMenu);
		} else {
			layout_mobile = true;
		}

		setPlayerYoutubeSize(player1);
	});

	// setItemMenuAtivo(document.querySelector('.item-conteudo[data-item="acesse-o-evento"]'));
});