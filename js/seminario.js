$(document).ready(() => {
	const itens_menu = [
		"Início",
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

			document.querySelectorAll(".item-conteudo").forEach(item => item.classList.remove("ativo"));
			document.querySelector('.item-conteudo[data-item="' + elemento.getAttribute("data-item") + '"]').classList.add("ativo");

			if (document.querySelector('.item-conteudo[data-item="' + elemento.getAttribute("data-item") + '"]').getAttribute("data-mostrar-logos") === "true") {
				document.querySelector('.logos').classList.add("ativo");
			} else {
				document.querySelector('.logos').classList.remove("ativo");
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
					$(this).hide()
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
		element.addEventListener("click", function (event) {
			setItemMenuAtivo(element);
			menuLateral.dispatchEvent(fecharMenu);
		});
	});
	
	iconeMenu.addEventListener("click", function () {
		menuLateral.dispatchEvent(trocarMenu);
	}, false);

	var botaoCtaList = document.querySelectorAll(".botao-cta");

	botaoCtaList.forEach((element) => {
		element.addEventListener("click", function (event) {
			if(typeof element.getAttribute("data-alvo") !== 'undefined') {
				let elemento;
	
				if(document.querySelector('.item-menu[data-item="'+ element.getAttribute("data-alvo") +'"]')) {
					elemento = document.querySelector('.item-menu[data-item="'+ element.getAttribute("data-alvo") +'"]');
				}
				
				if(typeof elemento !== 'undefined') {
					setItemMenuAtivo(elemento);
				}
			}
		});
	});

	// if (window.screen.width >= layout_mobile_width) {
	// 	menuLateral.dispatchEvent(abrirMenu);
	// }

	// new ResizeObserver(() => {
	// 	console.log(window.screen.width)
	// }).observe(document.body);

	window.addEventListener('resize', () => {
		if (window.screen.width >= layout_mobile_width) {
			layout_mobile = false;
			menuLateral.dispatchEvent(resetarMenu);
		} else {
			layout_mobile = true;
		}
	});
});