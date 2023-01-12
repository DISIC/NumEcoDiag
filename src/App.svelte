<script>

	/* ### IMPORTS ### */

		// Shared code
		import { getLocalData, setLocalData, getAudits, getRGESN } from './modules/helpers.mjs';

		// Svelte components
		import Navigation from './components/Navigation.svelte';
		import Results from './components/Results.svelte';
		import AuditForm from './components/AuditForm.svelte';
		import About from './components/About.svelte';
  		import Header from './components/Header.svelte';

	/* ### VARIABLES ### */

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

	/* ### FUNCTIONS ### */

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

	/* ### PROCEDURAL ### */

		getAudits()
			.then((data) => audits = JSON.parse(data))
			.catch((warning) => console.warn(warning))
				.finally(() => getRGESN(audits[index].selectedVersion)
                    .then((data) => {
						referential = data;
						window.onscroll = () => setLocalData('scrollPosY', window.scrollY);
						getLocalData('scrollPosY').then(scrollPosY => window.scroll(0, (scrollPosY || 0)));
					}))
                    .catch((error) => console.error(error));

</script>

<main>
	<Navigation />
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
