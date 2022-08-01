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

	function setItemMenuAtivo(elemento, classe='item-menu') {
		if(typeof $item_menu_ativo === 'undefined' || $item_menu_ativo.data("item") != elemento.data("item")) {
			$("."+ classe).removeClass("ativo");

			elemento.addClass("ativo");
			$item_menu_ativo = elemento;

			$('.item-conteudo').hide();
			$('.item-conteudo[data-item="'+ elemento.data("item") +'"]').show();
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
	var $item_menu_ativo;

	$("#menu-lateral").on("trocar", function(event) {
		console.log("a");

		var menu = $(this);

		if(menu.is(".aberto")) {
			menu.trigger("fechar");
		} else {
			menu.trigger("abrir");
		}
	}).on("abrir", function(event) {
		$(this).removeClass("fechado").addClass("aberto");
		$("#icone-menu").removeClass("fechado").addClass("aberto");

		largura_coluna = "172px";
		esquerda_menu = "26px";
		opacity_menu = 1;

		$(this).show();
		
		console.log("b");

		animarMenu();
	}).on("fechar", function(event) {
		$(this).removeClass("aberto").addClass("fechado");
		$("#icone-menu").removeClass("aberto").addClass("fechado");

		largura_coluna = "52px";
		esquerda_menu = "0px";
		opacity_menu = 0;

		console.log("c");

		animarMenu();
	});

	$.each(itens_menu, function(index, value) {
		var $novo_item = $("<div class='item-menu'></div>");

		//$novo_item.text(value).data("item", slugify(value));
		$novo_item.text(value);
		$novo_item.attr("data-item", slugify(value));

		if(index == 0) {
			setItemMenuAtivo($novo_item);
		}
		
		$("#menu-lateral").append($novo_item);

		if(index != itens_menu.length - 1) {
			$("#menu-lateral").append("<div class='item-menu-separador'></div>");
		}
	});

	$("#icone-menu").addClass("fechado").on("click", function(event) {
		console.log(event.target);
		$("#menu-lateral").trigger("trocar");
	});
	
	$("#coluna-lateral").on("click", function (event) {
		console.log(event.target);
		$("#menu-lateral").trigger("abrir");
	});

	$(".item-menu").click(function(event) {
		setItemMenuAtivo($(this));
		$("#menu-lateral").trigger("fechar");
	});

	$(".botao-cta").on("click", function() {
		//console.log($(this).parents(".item-conteudo").data("item"));
		if(typeof $(this).data("alvo") !== 'undefined') {
			//console.log($(this).data("alvo"));

			let $elemento;

			if($('.item-menu[data-item="'+ $(this).data("alvo") +'"]').length > 0) {
				$elemento = $('.item-menu[data-item="'+ $(this).data("alvo") +'"]');
			}
			
			if(typeof $elemento !== 'undefined') {
				setItemMenuAtivo($elemento);
			}
		}
		
	});
});