<script>

	import { onMount } from 'svelte';
    
	export let counters;
	export let nbOfCriteria;

	/*
		Old calculation without unassessed criteria.
		$: assessed = counters.satisfied + counters.rejected + counters.notApplicable;
		$: satisfiedRate = ((counters.satisfied / assessed) * 100).toFixed(2); 
		$: rejectedRate = ((counters.rejected / assessed) * 100).toFixed(2); 
		$: notApplicableRate = ((counters.notApplicable / assessed) * 100).toFixed(2); 
	*/

	$: rates = [
		(((nbOfCriteria - (counters.satisfied + counters.rejected + counters.notApplicable)) / nbOfCriteria) * 100).toFixed(2), // not evaluated rate
		((counters.satisfied / nbOfCriteria) * 100).toFixed(2), // satisfied rate
		((counters.rejected / nbOfCriteria) * 100).toFixed(2), // rejected rate
		((counters.notApplicable / nbOfCriteria) * 100).toFixed(2), // not applicable rate
	];

	onMount(() => updateDonut(rates));

	$: { // Only if the component has been rendered (identical to afterUpdate ?)
		if(document.querySelector('.donut')) {
			updateDonut(rates);
		}
	}
	
	function updateDonut(rates) {
		let circleElms = document.querySelectorAll('.donut circle');
		const circumference = Math.PI * (50 * 2);
		let i  = 0;
		let spaceLeft = circumference;
		for(let rate of rates) {
			if(rate > 0) {
				circleElms[i].style.strokeDasharray = spaceLeft + ' ' + circumference;    
				spaceLeft -= (rate / 100) * circumference;
				circleElms[i].style.display = 'initial';
			}
			else {
				circleElms[i].style.display = 'none';
			}
			i++; 
		}
	}

</script>

<div class="donut" aria-hidden="true" focusable="false">
	<svg>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px; stroke: lightgray;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px; stroke: lightgreen;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px; stroke: lightcoral;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px; stroke: lightskyblue;"></circle>
	</svg>
</div>

<style>
	.donut {
		fill: none;
		stroke-width: 35px;
	}
</style>