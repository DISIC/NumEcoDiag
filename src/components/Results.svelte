<script>

    import Donut from './Donut.svelte';
    import Stats from './Stats.svelte';

    export let counters;
    export let nbOfCriteria;

</script>

<section id="resultats" class="page-anchor">
    <h2>Résultats</h2>
    <div>
        <Donut counters="{counters}" nbOfCriteria="{nbOfCriteria}" />
        <Stats counters="{counters}" nbOfCriteria="{nbOfCriteria}" />
    </div>
</section>

<style>
    section {
        margin-bottom: 2em;
    }
    div {
        align-items: center;
        display: grid;
        gap: 2em;
        grid-template-columns: 135px auto;
    }
</style>