<script>

	import { createEventDispatcher } from 'svelte';
	export let versions;

	let dispatch = createEventDispatcher();

</script>

<section id="options" class="page-anchor">
    <h2>Options</h2>
    <!-- FEATURE DISABLED: uncomment this block when there are at least two versions of the repository.
    {#if versions.length > 1}
        <form on:submit|preventDefault="{(e) => dispatch('changeVersion', { versionToApply: e.target.elements['version-selector'].value })}">
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
    {/if}
    -->
    <button on:click="{() => dispatch('exportAudit')}">Exporter la progression (CSV)</button>
    <button on:click="{() => dispatch('resetAudit')}">Réinitialiser l'audit</button>
</section>

<style>
    button {
        display: block;
        margin-bottom: .5em;
    }
</style>
