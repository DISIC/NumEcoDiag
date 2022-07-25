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
				id: e.detail.criterionId,
				state: e.detail.criterionState
			}        
			// If already defined, removes 1 to the previous associated state counter 
			try {
				let previousCriterionState = audits[index].byCriteria[criterion.id].state;
				if(previousCriterionState !== undefined) {
					switch (previousCriterionState) {
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
			}
			catch(e) { /* This criterion was not defined before */ }
			// In all cases, add 1 to the new associated state counter 
			finally {
				if(criterion.state !== undefined) {
					audits[index].byCriteria[criterion.id] = {
						state: criterion.state
					};
					switch (criterion.state) {
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
				else {
					delete audits[index].byCriteria[criterion.id];
				}
			}
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
			let exportCSV = 'conforme;rejeté;non applicable;id;thématique;critère;\n'; // CSV header part
			const assessedIds = Object.keys(audits[index].byCriteria);
			const assessedValues = Object.values(audits[index].byCriteria);
			for(const criterion of referential.criteres) {
				criterion.value = null;
				for(let i = 0, l = assessedIds.length; i < l; i++) {
					if(criterion.id === assessedIds[i]) { // Criterion assessed? Reports state!
						criterion.value = assessedValues[i].state;
						break;
					}
				}
				// CSV criterion state part
				switch(criterion.value) {
					case 'satisfied':
					   exportCSV += 'X;;;';
						break;
					case 'rejected':
						exportCSV += ';X;;';
						break;
					case 'not-applicable':
						exportCSV += ';;X;';
						break;
					default:
						exportCSV += ';;;';
						break;   
				}
				// CSV criterion info part
				exportCSV += `${criterion.id};${criterion.thematique};${criterion.critere};\n`
			}
			let exportedBlob = new Blob([exportCSV], {});
			let aElm = document.createElement('a');
			aElm.setAttribute('href', window.URL.createObjectURL(exportedBlob));
			aElm.setAttribute('download', 'checklist-rgesn.csv');
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
	<h1>Référentiel Général d'Écoconception de Services Numériques</h1>
	{#if referential}
		{#key render }
			<Results 
				bind:counters="{audits[index].byCounters}"
				bind:nbOfCriteria="{referential.criteres.length}" />
			<AuditForm 
				audit="{audits[index]}" 
				referential="{referential}" 
				on:updated="{updateAudit}" />
		{/key}
	{/if}
	<Options 
		on:changeVersion="{(e) => changeRGESN(e.detail.versionToApply)}"
		on:resetAudit="{(e) => resetAudit(undefined)}"
		on:exportAudit="{exportAudit}" />
	<About />
</main>

<style>
	:global(main) {
		--cl-black: #000;
		--cl-blue: #000091;
		--cl-darkgray: #444;
		--cl-green: green;
		--cl-lightgray: #ddd;
		--cl-red: #d11;
		--cl-white: #fff;
		font-family: sans-serif;
		font-size: 16px;
		width: 500px;
	}
	:global(h1) {
		margin-top: 3em;
	}
	:global(h2) {
		margin-top: 2em;
	}
	:global(.page-anchor) {
		padding-top: 60px;
		margin-top: -60px;
	}
	:global(a) {
		color: var(--cl-blue);
	}
</style>