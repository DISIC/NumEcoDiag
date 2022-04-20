<script>
	export let referential;
</script>

{#if referential}
	<div class="criteria">
		{#each referential.criteres as critere}
			<div class="criterion">
				<p class="criterion__title">{critere.id } : {critere.critere}</p>
				<div class="criterion__status">
					<label>
						<input name="criterion-{critere.id}" type="radio" value="valid" />
						<span>Conforme</span>
					</label>
					<label>
						<input name="criterion-{critere.id}" type="radio" value="invalid" />
						<span>Rejeté</span>
					</label>
					<label>
						<input name="criterion-{critere.id}" type="radio" value="not-applicable" />
						<span>Non applicable</span>
					</label>   
				</div>
			</div>
		{/each}
	</div>
{/if}


<style>
	.criteria {
		max-width: 40ch;
	}
	.criterion + .criterion {
		margin-top: 3rem;
	}
	.criterion__title::before {
		content: "\2014";
		margin-right: 0.5em;
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
</style>