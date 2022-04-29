<script>

	import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

	export let referential;
    export let audit;

    let dispatch = createEventDispatcher();
    let lastTheme = '';

    function isAnotherTheme(currentTheme){
        if(currentTheme !== lastTheme) {
            lastTheme = currentTheme
            return true;
        }
        return false;
    }

	function updateAnswer(criterionId, criterionValue = undefined) {
		dispatch(
			'updated', { 
				criterionId: criterionId,
				criterionState: criterionValue
			}
		);
	}

	function resetAnswer(e) {
		let checkedRadioElm = e.target.parentNode.querySelector(':checked');
		if(checkedRadioElm !== null) {
			checkedRadioElm.checked = false; // Front updating
			updateAnswer(checkedRadioElm.name); // Back updating
		}
		e.preventDefault();
	}

    onMount(() => { // Check the corresponding radios for all the criteria that have already been evaluated
        const keys = Object.keys(audit.byCriteria);
        const values = Object.values(audit.byCriteria);
        for(let i = 0, l = keys.length; i < l; i++) {
            let criterionElm = document.getElementById(keys[i]);
            let criterionInputElm = criterionElm.querySelector(`input[value="${values[i].state}"]`);
            criterionInputElm.checked = true;
        }
    });

</script>

<form class="criteria">
    <h2>
        Référentiel version {referential.version}<br/>
        {audit.byCounters.satisfied + audit.byCounters.rejected + audit.byCounters.notApplicable} critère(s) évalué(s) sur {referential.criteres.length}
    </h2>
    {#each referential.criteres as critere}
        {#if isAnotherTheme(critere.thematique)}
            <h3>{critere.thematique}</h3>
        {/if}
		<div class="criterion" id="{critere.id}">
			<p class="criterion__title"><span>{critere.id}</span> : {critere.critere}</p>
			<div class="criterion__status">
				<label>
					<input
						on:change="{(e) => updateAnswer(critere.id, e.target.value)}"
						name="{critere.id}" 
						type="radio" 
						value="satisfied" />
					<span>Conforme</span>
				</label>
				<label>
					<input
						on:change="{(e) => updateAnswer(critere.id, e.target.value)}"
						name="{critere.id}" 
						type="radio" 
						value="rejected" />
					<span>Rejeté</span>
				</label>
				<label>
					<input
						on:change="{(e) => updateAnswer(critere.id, e.target.value)}"
						name="{critere.id}" 
						type="radio" 
						value="not-applicable" />
					<span>Non applicable</span>
				</label>   
			</div>
			<button on:click="{resetAnswer}">Effacer la réponse</button>
		</div>
	{/each}
</form>

<style>
	.criterion + .criterion {
		margin-top: 3rem;
	}
	.criterion__title::before {
		content: "\2014";
		margin-right: 0.5em;
	}
    .criterion__title span {
        font-weight: bold;
    }
	.criterion__status {
		align-items: center;
		display: grid;
		gap: 2em;
		grid-template-columns: repeat(3, auto);
		justify-content: start;
	}
	label {
		font-size: 0.9em;
		color: var(--cl-gray);
	}
	input {
		margin: 0.5em auto auto auto;
	}
	input:checked + span {
		color: var(--cl-black);
	}
	label:first-of-type input:checked {
		accent-color: var(--cl-green);
	}
	label:nth-of-type(2) input:checked {
		accent-color: var(--cl-red);
	}
	label:last-of-type input:checked {
		accent-color: var(--cl-gray);
	}
	button {
		margin-top: 1.5em;
	}
</style>