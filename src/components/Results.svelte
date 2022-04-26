<script>

    import Donut from './Donut.svelte';
    import Stats from './Stats.svelte';

    export let counters;
    export let nbOfCriteria;

</script>

<section class="results">
    <h2>Résultats</h2>
    <div>
        <Donut counters="{counters}" />
        <Stats counters="{counters}" nbOfCriteria="{nbOfCriteria}" />
    </div>
</section>

<style>
    .results div {
        align-items: center;
        display: grid;
        gap: 2em;
        grid-template-columns: 135px auto;
    }
</style>