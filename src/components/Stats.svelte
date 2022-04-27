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
      <th>À évaluer</th>
      <td>{nbOfCriteria - (assessed)}</td>
    </tr>
    <tr>
      <th>Évalué(s)</th>
      <td>{assessed}</td>
    </tr>
    <tr>
        <th class="donut-ref satisfied">Validé(s)</th>
        <td>{counters.satisfied}</td>
    </tr>
    <tr>
        <th class="donut-ref rejected">Rejeté(s)</th>
        <td>{counters.rejected}</td>
    </tr>
    <tr>
        <th class="donut-ref not-applicable">Non applicable(s)</th>
        <td>{counters.notApplicable}</td>
    </tr>
    <tr>
        <th>Conformité</th>
        <td>{conformity !== 'NaN' ? conformity + '%' : 'Indisponible'}</td>
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
    .donut-ref.satisfied::before {
        background-color: green;
    }
    .donut-ref.rejected::before {
        background-color: red;
    }
    .donut-ref.not-applicable::before {
        background-color: gray;
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