<nav>
    <ul>
        <li><a href="#resultats">Résultats</a></li>
        <li><a href="#referentiel">Référentiel</a></li>
        <li><a href="#options">Options</a></li>
        <li><a href="#a-propos">À propos</a></li>
    </ul>
</nav>

<style>
    nav {
        background-color: var(--cl-white);
        box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
        box-sizing: border-box;
        left: 0;
        padding: .25em .5em;
        position: fixed;
        right: 0;
        top: 0;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        list-style-type: none;
    }
    li+ li::before {
        margin-right: .5em;
        margin-left: .5em;
        content: '/';
        color: var(--cl-lightgray)
    }
    a {
        color: inherit;
    }
</style>