<script>

	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
    
</script>

<button on:click="{() => dispatch('exportData')}">Exporter les données (JSON)</button>
<button on:click="{() => dispatch('exportResults')}">Exporter les résultats (CSV)</button>
<button on:click="{() => dispatch('buildBadge')}">Télécharger le badge HTML</button>
<button on:click="{() => dispatch('resetAudit')}">Réinitialiser le diagnostic</button>
<form on:submit|preventDefault="{(e) => dispatch('importData', { file: e.target.elements['file'].files[0] })}">
    <label for="file">
        Importer un diagnostic (JSON)
        <input 
            id="file" 
            name="numecodiag-data" 
            type="file" 
            accept="application/json" 
            required>
    </label>
    <button>Valider</button>
</form>

<style>
    form {
        margin-top: 2em;
    }
    button, input {
        display: block;
        margin-bottom: .5em;
    }
</style>