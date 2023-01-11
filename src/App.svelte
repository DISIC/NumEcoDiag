<script>

	/* ### VARIABLES ### */

		import Navigation from './components/Navigation.svelte';
		import Results from './components/Results.svelte';
		import AuditForm from './components/AuditForm.svelte';
		
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
		const webAppMode = false; // Makes NumÉcoDiag able to be served as webApp and makes debugging easier (entry point: /public/index.html) 
		const env = window.browser === undefined ? window.chrome : window.browser; // Makes NumÉcoDiag cross browser as webExtension

		const setLocalData = (name, value) => {
			return new Promise(
				(resolve) => {
					if(!webAppMode) { // Asynchronous
						env.storage.local.set({[name]: value})
							.then(resolve());
					}
					else { // Synchronous
						localStorage.setItem(name, value);
						resolve();
					}
				}
			)
		}

		const getLocalData = name => {
			return new Promise(
				(resolve) => { // Asynchronous
					if(!webAppMode) {
						env.storage.local.get(name)
							.then(data => resolve(data[name]));
					}
					else { // Synchronous
						resolve(localStorage.getItem(name));
					}
				}
			)		
		}

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

		function setAudit(e) { 
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
			setLocalData('audits', JSON.stringify(audits));
		}

		function getAudits() {
			return new Promise((resolve ,reject) => {
				getLocalData('audits').then((data) =>
					(data !== null && data !== undefined) ? resolve(data): reject('Absence d\'historique')
				);
			});
		}

		function openOptions() {
			env.tabs.create({url: "/options.html"});
		}

	/* ### PROCEDURAL ### */

		getAudits()
			.then(data => audits = JSON.parse(data))
			.catch((warning) => console.warn(warning))
				.finally(() => getRGESN(audits[index].selectedVersion).then(() => {
					window.onscroll = () => setLocalData('scrollPosY', window.scrollY);
					getLocalData('scrollPosY').then(scrollPosY => window.scroll(0, (scrollPosY || 0)));
				}		
			)
		);	

</script>

<main>
	<Navigation on:configure="{() => openOptions()}" />
	<Header />
	{#if referential}
		{#key render }
			<Results 
				bind:counters="{audits[index].byCounters}"
				bind:nbOfCriteria="{referential.criteres.length}" />
			<AuditForm 
				audit="{audits[index]}" 
				referential="{referential}" 
				on:updated="{setAudit}" />
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
