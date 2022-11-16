<script>

	import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

	export let referential;
    export let audit;
	const thematiques = [
        'Stratégie', 
        'Spécifications', 
        'Architecture', 
        'UX/UI', 
        'Contenus', 
        'Frontend', 
        'Backend', 
        'Hébergement'
    ];

    let dispatch = createEventDispatcher();
    let lastTheme = '';

    function isAnotherTheme(currentTheme){
        if(currentTheme !== lastTheme) {
            lastTheme = currentTheme
            return true;
        }
        return false;
    }

	function updateAnswer(prop, criterionId, value = undefined) {
		dispatch(
			'updated', { 
				prop: prop,
				criterionId: criterionId,
				value: value
			}
		);
	}

    onMount(() => { // Check the corresponding radios for all the criteria that have already been evaluated
        const keys = Object.keys(audit.byCriteria);
        const values = Object.values(audit.byCriteria);
        for(let i = 0, l = keys.length; i < l; i++) {
            let criterionElm = document.getElementById(keys[i]);
			if(values[i].status) {
				criterionElm.querySelector(`input[value="${values[i].status}"]`).checked = true;
			}
			if(values[i].analysis) {
				criterionElm.querySelector('textarea').value = values[i].analysis;
			}
        }
    });

</script>

<form id="diagnostic" class="page-anchor">
    <h2>
        Auto-diagnostic <a href="https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/" target="_blank">RGESN</a> version {referential.version}<br/>
        {audit.byCounters.satisfied + audit.byCounters.rejected + audit.byCounters.notApplicable} critère(s) évalué(s) sur {referential.criteres.length}
    </h2>
	<h3>Accès rapide</h3>
	<ol>
		{#each thematiques as thematique}
			<li><a href="#{thematique}">{thematique}</a></li>
		{/each}
	</ol>
    {#each referential.criteres as critere}
        {#if isAnotherTheme(critere.thematique)}
            <h3 id="{critere.thematique}">{critere.thematique}</h3>
        {/if}
		<div class="criterion" id="{critere.id}">
			<h4 class="criterion__title">
				{critere.id} : {critere.critere}
				<a 
					href="{critere.url}" 
					target="_blank" 
					title="Ouvrir le permalien du critère dans un nouvel onglet pour en apprendre plus">
					<svg viewBox="0 0 24 24"><path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/></svg>
				</a>		
			</h4>
			<div class="criterion__status">
				<div>
					<label>
						<input
							on:change="{(e) => updateAnswer('status', critere.id, e.target.value)}"
							name="status-{critere.id}" 
							type="radio" 
							value="undefined"
							checked />
						<span>À évaluer</span>
					</label>
					<label>
						<input
							on:change="{(e) => updateAnswer('status', critere.id, e.target.value)}"
							name="status-{critere.id}" 
							type="radio" 
							value="satisfied" />
						<span>Conforme</span>
					</label>
					<label>
						<input
							on:change="{(e) => updateAnswer('status', critere.id, e.target.value)}"
							name="status-{critere.id}" 
							type="radio" 
							value="rejected" />
						<span>Non conforme</span>
					</label>
					<label>
						<input
							on:change="{(e) => updateAnswer('status', critere.id, e.target.value)}"
							name="status-{critere.id}" 
							type="radio" 
							value="not-applicable" />
						<span>Non applicable</span>
					</label>
				</div>
			</div>
			<div class="criterion__analysis">
				<h5>Commentaire</h5>
				<label for="analysis-{critere.id}">Votre commentaire</label>
				<textarea on:input="{(e) => updateAnswer('analysis', critere.id, e.target.value)}" name="analysis-{critere.id}"></textarea>
			</div>
		</div>
	{/each}
</form>

<style>
	.criterion {
		border: solid 1px var(--cl-blue);	
		padding: 2em;	
	}
	.criterion + .criterion {
		margin-top: .5rem;
	}
	.criterion__status > div {
		align-items: center;
		display: grid;
		gap: 1.5em;
		grid-template-columns: repeat(4, auto);
		justify-content: start;
	}
	h3 {
		background-color: var(--cl-blue);
		color: #fff;
		margin: 2em 0 .5em 0;
		padding: 1em;
		position: sticky;
		scroll-margin-top: 4em;
		top: 75px;
	}
	h4 {
		margin-top: 0;
	}
	h5 {
		font-size: 1em;
		margin-bottom: .5em;
	}
	label {
		color: var(--cl-darkgray);
		font-size: .9em;
	}
	.criterion__analysis label {
		left: -9999px;
		position: absolute;
	}
	label:nth-of-type(2) input:checked {
		accent-color: var(--cl-green);
	}
	label:nth-of-type(3) input:checked {
		accent-color: var(--cl-red);
	}
	label:last-of-type input:checked {
		accent-color: var(--cl-blue);
	}
	input {
		margin: .5em .25em auto auto;
	}
	input:checked + span {
		color: var(--cl-black);
	}
	textarea {
		box-sizing: border-box;
		display: block;
		min-height: 100px;
		padding: .5em;
		resize: vertical;
		width: 100%;
	}
	svg {
		fill: var(--cl-blue);
		height: 12px;
		margin-left: .25em;
		vertical-align: middle;
		width: 12px;
	}
</style>