<script>
    export let referential;
    let count = 1;
</script>

{#if referential}

    {#each referential.criteres as critere}
        
        <p>{critere.critere}</p>


    {/each}
    
{/if}
