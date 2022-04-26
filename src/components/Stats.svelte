<script>
    export let counters;
    export let nbOfCriteria;
    $: assessed = counters.satisfied + counters.rejected + counters.notApplicable;
    $: conformity = counters.satisfied / ((assessed) - (counters.notApplicable)) * 100;
</script>

<div>
    <div>
        <h2>Critères RGESN</h2>
        <dl>
            <dt>Total</dt> 
            <dd>{nbOfCriteria}</dd>
            <dt>Évalué(s)</dt> 
            <dd>{assessed}</dd>
            <dt>À évaluer</dt> 
            <dd>{nbOfCriteria - (assessed)}</dd>
        </dl>
    </div>
    {#if !Number.isNaN(conformity)}
        <dl>
            <h2>Conformité RGESN globale</h2>
            <p>{conformity} %</p>
        </dl>
        <dl>
            <h2>Conformité RGESN par critère</h2>
            <dt>Satisfait(s)</dt> 
            <dd>{counters.satisfied}</dd>
            <dt>Rejeté(s)</dt> 
            <dd>{counters.rejected}</dd>
            <dt>Non applicable(s)</dt> 
            <dd>{counters.notApplicable}</dd>
        </dl>
    {/if}
</div>