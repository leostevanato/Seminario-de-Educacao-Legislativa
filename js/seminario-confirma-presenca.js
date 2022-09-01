// Carrega a div de um arquivo externo e adiciona a div ao HTML alvo.
if (document.querySelector('body').classList.contains('path-mod-page')) {
	var url_mdl_arquivos = 'https://www.educacaoadistancia.camara.leg.br/ead_cfd/pluginfile.php/' + codigo_pasta_arquivos + '/mod_folder/content/0/';

	let response_promise = fetch(url_mdl_arquivos + 'html-confirma-presenca.html');

	let seminario_promise = fetch(url_mdl_arquivos + 'seminario.json', {
		headers: {
			'Accept': 'application/json'
		}
	});

	var elemento_conteudo_seletor = '#seminario-de-educacao-legislativa-confirma-presenca';
	var elemento_alvo_seletor = '.path-mod-page #region-main > [role=main] > .box';
	var data_periodo_seletor = '#page-header ul.breadcrumb > li.breadcrumb-item:last-child > a';
	var botao_cta_seletor = elemento_conteudo_seletor + ' > .conteudo > .botao-cta';

	document.addEventListener("DOMContentLoaded", function () {
		response_promise.then(response => {
			return response.text();
		}).then(responseHTMLtext => {
			// This is the HTML from our response as a text string
			var parser = new DOMParser();
			var docHTML = parser.parseFromString(responseHTMLtext, 'text/html');
			
			var elemento_conteudo = docHTML.querySelector(elemento_conteudo_seletor);
			var elemento_alvo = document.querySelector(elemento_alvo_seletor);
			
			elemento_alvo.innerHTML = elemento_conteudo.outerHTML;

			let data_periodo = document.querySelector(data_periodo_seletor).textContent.trim();

			let regex_data_periodo = /([0-9]{2}[\-/ \.][0-9]{2})\s*-\s*(.+)/;
			var data_periodo_result = data_periodo.match(regex_data_periodo);

			document.querySelector(botao_cta_seletor).addEventListener("click", function (event) {
				if (this.getAttribute("data-link") != null) {
					window.open(this.getAttribute("data-link"));
					return false;
				}
			});
			
			seminario_promise.then(response => {
				return response.json();
			}).then(seminarioJSON => {
				let evento = seminarioJSON.eventos.find(evento => evento.data === data_periodo_result[1] && evento.periodo.toLowerCase() === data_periodo_result[2].toLowerCase());

				document.querySelector(botao_cta_seletor).dataset.link = urlVideoYouTube + evento.idYoutube;
			}).catch(error => {
				console.log("ERRO: " + error);
			});
		}).catch(function (erro) {
			console.warn('ERRO: ', erro);
		});

		document.querySelector(botao_cta_seletor).addEventListener("click", function (event) {
			if (this.getAttribute("data-link") != null) {
				window.open(this.getAttribute("data-link"));
				return false;
			}
		});
	}, false);
}