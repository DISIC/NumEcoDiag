<script>

	import { createEventDispatcher } from 'svelte';
	export let versions;

	let dispatch = createEventDispatcher();

	function updateVersion(e) {
		const newVersion = e.target.elements['version-selector'].value;
		dispatch('changed', { versionToApply: newVersion });
        e.preventDefault();
	}
    
</script>

<form on:submit="{updateVersion}">
	<label>
		Version RGESN à utiliser :
		<select name="version-selector">
			{#each versions as version}
				<option value="{version}">
					{version}
				</option>
			{/each}
		</select>
	</label>
	<button>Valider</button>
</form>