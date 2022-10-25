<script>

	/* ### VARIABLES ### */

		import Navigation from './components/Navigation.svelte';
		import Results from './components/Results.svelte';
		import AuditForm from './components/AuditForm.svelte';
		import Options from './components/Options.svelte';
		import About from './components/About.svelte';
		
		const versions = ['beta']; // Available versions (stored in /public/rgesn)
		let defaultVersion = 'beta';
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
			let csv = 'Conforme;Non conforme;Non applicable;ID;Thématique;Libellé du critère;Commentaire;\n';
			for(const criterion of referential.criteres) {
				let assessed = audits[index].byCriteria[criterion.id];
				if(assessed !== undefined) {
					switch(assessed.status) {
						case 'satisfied':
						csv += 'X;;;';
							break;
						case 'rejected':
							csv += ';X;;';
							break;
						case 'not-applicable':
							csv += ';;X;';
							break;
						default:
							csv += ';;;';
							break; 
					}
				}
				else {
					csv += ';;;';
				}
				csv += `${criterion.id};${criterion.thematique};${criterion.critere};`;
				if(assessed !== undefined) {
					if(assessed.analysis !== undefined) {
						csv += `${assessed.analysis.replace(/(\r\n|\n|\r)/gm, ' / ')};`;
					}
					else {
						csv += ';';
					}
				}
				csv += ';\n';
			}
			let exportedBlob = new Blob([csv], {});
			let aElm = document.createElement('a');
			aElm.setAttribute('href', window.URL.createObjectURL(exportedBlob));
			aElm.setAttribute('download', 'NumÉcoDiag.csv');
			aElm.click();
			aElm.remove();
		}

	/* ### PROCEDURAL ### */

		getAudits()
			.then(data => audits = JSON.parse(data.audits))
			.catch((warning) => console.warn(warning))
				.finally(() => getRGESN(audits[index].selectedVersion));
   
</script>

<main>
	<Navigation />
	{#if referential}
		{#key render }
			<Results 
				bind:counters="{audits[index].byCounters}"
				bind:nbOfCriteria="{referential.criteres.length}" />
			<Options 
				on:changeVersion="{(e) => changeRGESN(e.detail.versionToApply)}"
				on:resetAudit="{(e) => resetAudit(undefined)}"
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
		width: 600px
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