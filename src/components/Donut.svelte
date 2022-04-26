<script>

	import { onMount } from 'svelte';
	export let counters;

	$: assessed = counters.satisfied + counters.rejected + counters.notApplicable;
	$: satisfiedRate = (counters.satisfied / assessed) * 100; 
	$: rejectedRate = (counters.rejected / assessed) * 100; 
	$: notApplicableRate = (counters.notApplicable / assessed) * 100; 
	
	onMount(() => updateDonut([satisfiedRate, rejectedRate, notApplicableRate]));

	$: { // Only if the component has been rendered (identical to afterUpdate ?)
		if(document.querySelector('.donut')) {
			updateDonut([satisfiedRate, rejectedRate, notApplicableRate]);
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

<div class="donut">
	<svg>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px; stroke: green;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px; stroke: red;"></circle>
		<circle cx="75" cy="75" r="50" style="stroke-dasharray: 0px, 0px; stroke: gray;"></circle>
	</svg>
</div>

<style>
	.donut {
		fill: none;
		height: 100px;
		width: 100px;
		stroke-width: 35px;
	}
	circle {
		transition: stroke-dasharray 0.25s ease;
	}
</style>