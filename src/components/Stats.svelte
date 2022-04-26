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
      <th>Évalué(s)</th>
      <td>{assessed}</td>
    </tr>
    <tr>
      <th>À évaluer</th>
      <td>{nbOfCriteria - (assessed)}</td>
    </tr>
    <tr>
        <th>Validé(s)</th>
        <td>{counters.satisfied}</td>
    </tr>
    <tr>
        <th>Rejeté(s)</th>
        <td>{counters.rejected}</td>
    </tr>
    <tr>
        <th>Non applicable(s)</th>
        <td>{counters.notApplicable}</td>
    </tr>
    <tr>
        <th>Conformité</th>
        <td>{conformity} %</td>
    </tr>
</table>
  
<style>
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