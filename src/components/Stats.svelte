<script>

    export let counters;
    export let nbOfCriteria;

    $: assessed = counters.satisfied + counters.rejected + counters.notApplicable;
    $: conformity = (counters.satisfied / ((assessed) - (counters.notApplicable)) * 100).toFixed(2);

</script>

<table>
    <tr>
      <th>Total critères</th>
      <td>{nbOfCriteria}</td>
    </tr>
    <tr>
      <th class="donut-ref notEvaluated">À évaluer</th>
      <td>{nbOfCriteria - (assessed)}</td>
    </tr>
    <tr>
        <th class="donut-ref satisfied">Conformes</th>
        <td>{counters.satisfied}</td>
    </tr>
    <tr>
        <th class="donut-ref rejected">Non conformes</th>
        <td>{counters.rejected}</td>
    </tr>
    <tr>
        <th class="donut-ref not-applicable">Non applicables</th>
        <td>{counters.notApplicable}</td>
    </tr>
    <tr>
        <th>Conformité sur {assessed} critère(s)</th>
        <td>{conformity !== 'NaN' ? conformity + ' %' : 'Indisponible'}</td>
    </tr>
</table>
  
<style>
    .donut-ref::before {
        content: "";
        display: inline-block;
        height: 9px;
        margin-right: .5em;
        vertical-align: middle;
        width: 9px;
    }
    .donut-ref.notEvaluated::before {
        background-color: var(--cl-lightgray);
    }
    .donut-ref.satisfied::before {
        background-color: var(--cl-green);
    }
    .donut-ref.rejected::before {
        background-color: var(--cl-red);
    }
    .donut-ref.not-applicable::before {
        background-color: var(--cl-blue);
    }
    table {
        border-collapse: collapse;
    }
    th, td {
        border-bottom: solid 1px;
        padding: 0.25em;
        text-align: left;
    }
    th {
        min-width: 200px;
        font-weight: normal;
    }
    td {
        text-align: right;
    }
</style>