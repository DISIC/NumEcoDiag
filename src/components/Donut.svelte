<script>

	import { onMount } from 'svelte';
    
	export let counters;
	export let nbOfCriteria;

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
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px;"></circle>
	</svg>
</div>

<style>
	.donut {
		fill: none;
		stroke-width: 35px;
	}
	.donut circle:first-of-type {
		stroke: var(--cl-lightgray);
	}
	.donut circle:nth-of-type(2) {
		stroke: var(--cl-green);
	}
	.donut circle:nth-of-type(3) {
		stroke: var(--cl-red);
	}
	.donut circle:last-of-type {
		stroke: var(--cl-blue);
	}
</style>