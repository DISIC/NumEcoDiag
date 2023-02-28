<script>

	/* ### VARIABLES ### */

		import Navigation from './components/Navigation.svelte';
		import Results from './components/Results.svelte';
		import AuditForm from './components/AuditForm.svelte';
		import Options from './components/Options.svelte';
		import About from './components/About.svelte';
  		import Header from './components/Header.svelte';
		
		// const versions = ['v1']; // Available versions (stored in /public/rgesn)
		let defaultVersion = 'v1';
		let referential; // RGESN content
		let index = 0; // Current audit index identifier
		let audits = [ // Audits progression
			{  
				byCriteria: {},
				byCounters: {
					satisfied: 0,
					rejected: 0,
					notApplicable: 0
				},
				selectedVersion: defaultVersion, // By default.
			}
		];
		let render = false; // Makes Results & AuditForm components reactives
		const env = window.browser === undefined ? window.chrome : window.browser; // Makes extension cross platform

	/* ### FUNCTIONS ### */

		function getRGESN(versionToLoad) {
			return new Promise((resolve, reject) => {
				fetch(`./rgesn/${versionToLoad}.json`)
					.then((resp) => { 
						if(resp.ok) {
							resp.text()
								.then((data) => {
									try {
										resolve(JSON.parse(data));
									}
									catch(e) {
										reject('Lecture du référentiel impossible');
									}	
								}	
							)
						}
						else {
							reject('Ouverture du référentiel impossible');
						}
					}
				)
			})
			.then((data) => referential = data)
			.catch((error) => console.error(error));	
		}

		function changeRGESN(versionToApply) {
			if(versionToApply !== audits[index].selectedVersion) {
				if(resetAudit(versionToApply)) {
					getRGESN(versionToApply);
				}
			}
			else {
				alert("Vous utilisez déjà cette version du référentiel");
			}
		}

		function resetAudit(currentVersion = defaultVersion) {
			if(confirm("Attention : cette action entraîne la perte de toutes les données non exportées saisies jusqu'à présent. Souhaitez-vous poursuivre ?")) {
				// Udpates runtime values
				audits[index].byCriteria = {};
				audits[index].byCounters.satisfied = 0;
				audits[index].byCounters.rejected = 0;
				audits[index].byCounters.notApplicable = 0;
				audits[index].selectedVersion = currentVersion;
				// Udpates storage
				env.storage.local.set({'audits': JSON.stringify(audits)});
				 // Updates view
				render = !render;
				return true;
			}
			return false
		}

		function updateAudit(e) { 
			const criterion = {
				prop: e.detail.prop,
				id: e.detail.criterionId,
				value: e.detail.value
			}
			// If needed, inits values for criterion
			if(!audits[index].byCriteria[criterion.id]) {
				audits[index].byCriteria[criterion.id] = {
					status: "undefined",
					analysis: ''
				}
			}
			// If status has changed, updates counters
			if(criterion.prop === 'status') {
				const oldStatus = audits[index].byCriteria[criterion.id].status;
				const newStatus = criterion.value;
				if(oldStatus !== "undefined") {
					switch(oldStatus) {
						case 'satisfied':
							audits[index].byCounters.satisfied--;
							break;
						case 'rejected':
							audits[index].byCounters.rejected--;
							break;
						case 'not-applicable':
							audits[index].byCounters.notApplicable--;
							break;
					}
				}
				if(newStatus !== "undefined") {
					switch(newStatus) {
						case 'satisfied':
							audits[index].byCounters.satisfied++;
							break;
						case 'rejected':
							audits[index].byCounters.rejected++;
							break;
						case 'not-applicable':
							audits[index].byCounters.notApplicable++;
							break;
					}
				}
			}
			// Sets the new value and saves updated audit
			audits[index].byCriteria[criterion.id][criterion.prop] = criterion.value;
			env.storage.local.set({'audits': JSON.stringify(audits)});
		}

		function getAudits() {
			return new Promise((resolve ,reject) => {
				env.storage.local.get(['audits']).then((data) =>
					data.audits !== undefined ? resolve(data) : reject('Absence d\'historique')                        
				);
			});
		}

		function exportAudit() {
			let csv = 'ID;Thématique;Libellé du critère;Évaluation;Commentaire;\n';
			for(const criterion of referential.criteres) {
				csv += `${criterion.id};${criterion.thematique};${criterion.critere};`;
				const assessed = audits[index].byCriteria[criterion.id];
				if(assessed !== undefined) {
					switch(assessed.status) {
						case 'satisfied':
							csv += 'conforme;';
								break;
						case 'rejected':
							csv += 'non conforme;';
							break;
						case 'not-applicable':
							csv += 'non applicable;';
							break;
						default:
							csv += 'à évaluer;';
							break;
					}
				}
				else {
					csv += 'à évaluer;';
				}
				if(assessed !== undefined) {
					if(assessed.analysis !== undefined) {
						csv += `"${assessed.analysis}"`;
					}
					else {
						csv += ';';
					}
				}
				else {
					csv += ';';
				}
				csv += ';\n';
			}
			let blob = new Blob([csv], {});
			let aElm = document.createElement('a');
			aElm.setAttribute('href', window.URL.createObjectURL(blob));
			aElm.setAttribute('download', 'NumÉcoDiag.csv');
			aElm.click();
			aElm.remove();
		}

		function buildBadge() {
			alert(`Retrouvez votre badge en HTML dans votre dossier téléchargement. Vous pouvez afficher ce badge dans vos communications losque 100% des critères sont évalués.`);

			const nbOfCriteria= referential.criteres.length;
			const counters = audits[index].byCounters;
			const assessed = counters.satisfied + counters.rejected + counters.notApplicable;
			const assessedPercent = (assessed/nbOfCriteria * 100).toFixed(0);
			const score = (counters.satisfied / (nbOfCriteria - counters.notApplicable) * 100).toFixed(0);
			const html = `<div class="numecodiag-badge" style="display:flex; align-items: center; gap: 1em; max-width: 60ch; padding: 1em"><img src=" data:image/png;base64,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" alt="Logo MiNum_Eco"><p>Après auto-évaluation, ce service numérique a un taux de conformité de ${score}% pour ${assessedPercent}% des critères évalués selon le <a href="https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/" target="_blank">Référentiel Général d'Écoconception de Services Numériques</a> (RGESN). </p></div>`;
			let blob = new Blob([html], {});
			let aElm = document.createElement('a');
			aElm.setAttribute('href', window.URL.createObjectURL(blob));
			aElm.setAttribute('download', 'badge.html');
			aElm.click();
			aElm.remove();
		}

	/* ### PROCEDURAL ### */

		getAudits()
			.then(data => audits = JSON.parse(data.audits))
			.catch((warning) => console.warn(warning))
				.finally(() => getRGESN(audits[index].selectedVersion).then(() => {
					window.onscroll = () => env.storage.local.set({'scrollPosY': window.scrollY});
					env.storage.local.get('scrollPosY').then(data => window.scroll(0, (data.scrollPosY || 0)));
				}		
			)
		);	

</script>

<main>
	<Navigation />
	<Header />
	{#if referential}
		{#key render }
			<Results 
				bind:counters="{audits[index].byCounters}"
				bind:nbOfCriteria="{referential.criteres.length}" />
			<Options 
				on:changeVersion="{(e) => changeRGESN(e.detail.versionToApply)}"
				on:resetAudit="{() => resetAudit(undefined)}"
				on:buildBadge="{() => buildBadge()}"
				on:exportAudit="{exportAudit}" />
			<AuditForm 
				audit="{audits[index]}" 
				referential="{referential}" 
				on:updated="{updateAudit}" />
		{/key}
	{/if}
	<About />
</main>

<style>
	@font-face {
		font-display: swap;
		font-family: "Marianne";
		src: url("../static/marianne-regular.woff2") format("woff2");
	}
	@font-face {
		font-display: swap;
		font-family: "Marianne";
		src: url("../static/marianne-bold.woff2") format("woff2");
		font-weight: bold;
	}
	:global(main) {
		--cl-black: #000;
		--cl-blue: #000091;
		--cl-darkgray: #444;
		--cl-green: green;
		--cl-lightgray: #ddd;
		--cl-red: #d11;
		--cl-white: #fff;
		font-family: "Marianne", sans-serif;
		font-size: 16px;
		min-width: 600px;
	}
	:global(h2) {
		margin-top: 2.5em;
	}
	:global(.page-anchor) {
		padding-top: 2.5em;
		margin-top: -2.5em;
	}
	:global(a) {
		color: inherit;
	}
	:global(button, textarea) {
		font-family: "Marianne", sans-serif;
	}
</style>
