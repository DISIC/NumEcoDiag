<script>
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	export let availableVersions;
	function updateVersion(e) {
		const newVersion = e.target.elements['version-selector'].value;
		dispatch('versionChanged', { versionToApply: newVersion });
	}
</script>

<form on:submit|preventDefault="{updateVersion}">
	<label>
		Version RGESN à utiliser :
		<select name="version-selector">
			{#each availableVersions as version}
				<option value="{version}">
					{version}
				</option>
			{/each}
		</select>
	</label>
	<button>Valider</button>
</form>