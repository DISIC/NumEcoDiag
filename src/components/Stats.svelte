<script>

    export let counters;
    export let nbOfCriteria;

    $: assessed = counters.satisfied + counters.rejected + counters.notApplicable;
    $: conformity = counters.satisfied / ((assessed) - (counters.notApplicable)) * 100;
    $: satisfiedRate = (counters.satisfied / assessed) * 100; 
	$: rejectedRate = (counters.rejected / assessed) * 100; 
	$: notApplicableRate = (counters.notApplicable / assessed) * 100; 

</script>

<table>
    <caption>Critères</caption>
    <thead>
        <tr>
            <th>Total</th>
            <th>Évalué(s)</th>
            <th>À évaluer</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{nbOfCriteria}</td>
            <td>{assessed}</td>
            <td>{nbOfCriteria - (assessed)}</td>
        </tr>
    </tbody>
</table>
<table>
    <caption>Résultats</caption>
    <thead>
        <tr>
            <th>Validé(s)</th>
            <th>Rejeté(s)</th>
            <th>Non applicable(s)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{counters.satisfied} <span>(soit {satisfiedRate} %)</span></td>
            <td>{counters.rejected} <span>(soit {rejectedRate} %)</span></td>
            <td>{counters.notApplicable} <span>(soit {notApplicableRate} %)</span></td>
        </tr>
    </tbody>
</table>

<style>
    table {
        border-collapse: collapse;
        max-width: 65ch;
        text-align: center;
        width: 100%;
    }
    table + table {
        margin-top: 1em;
    }
    caption {
        font-weight: bold; 
        margin-bottom: 0.25em;
        text-align: left;
    }
    th, td {
        border: solid 1px;
        min-width: 150px;
        padding: 0.5em;
    }
    th {
        font-weight: normal;
    }
    span {
        font-size: 0.75em;
    }
</style>