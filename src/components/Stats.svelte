<script>

    import { onMount } from 'svelte';

    export let counters;
    export let nbOfCriteria;
    $: assessed = counters.satisfied + counters.rejected + counters.notApplicable;
    $: conformity = counters.satisfied / ((assessed) - (counters.notApplicable)) * 100;
    $: ratios = [
        {
            color: 'green',
            name: 'satisfied',
            value:  (counters.satisfied / assessed) * 100
        },
        {
            color: 'red',
            name: 'rejected',
            value:  (counters.rejected / assessed) * 100
        },
        {
            color: 'gray',
            name: 'not applicable',
            value:  (counters.notApplicable / assessed) * 100
        }
    ];

    onMount(() => { 
       
        
        let donutElm = document.createElement('svg');    
        const radius = 50;
        const circumference = Math.PI * (radius * 2);
        let spaceLeft = circumference;
    
        for (let i = 0; i < 3; i++) {
            if(ratios[i].value > 0) {
                let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');                
                circle.setAttribute('cx', radius * 1.5);
                circle.setAttribute('cy', radius * 1.5);
                circle.setAttribute('r', radius);
                circle.style.strokeDasharray = spaceLeft + ' ' + circumference;    
                circle.style.stroke = ratios[i].color;
                donutElm.appendChild(circle);					
                spaceLeft -= (ratios[i].value / 100) * circumference; 
            }
        }


        document.querySelector('.target').innerHTML = donutElm.outerHTML;


    });


        



    




</script>

<div class="target"></div>

<div class="stats">
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

<style>


    .target {
        fill: none;
        height: 100px;
        width: 100px;
        stroke-width: 35px;
    }

</style>