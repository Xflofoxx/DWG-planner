Codice, stile e standard di sviluppo – OpenCode Spec

Scelta linguistica e stile
- Linguaggi preferiti: TypeScript per backend/ frontend dove possibile; JavaScript altrimenti.
- Standard di codifica: ESLint (airbnb o equivalente), Prettier per formattazione, TypeScript per tipizzazione quando possibile.
- naming: camelCase per variabili e metodi, PascalCase per classi, kebab-case per file/cartelle.
- Commenti: commenti essenziali solo dove non ovvi; evitare commenti superflui.

Gestione progetti e codice
- Branching: per ogni feature creare branch descrittivo (es. feature/dwg-ingestion)
- Patch/commit: messaggi chiari che spiegano il perché; preferire commit atomici.
- Tests: unit e integration tests; naming coerente; hook di CI previsto.
- Documentation: ogni feature ha spec.md/plan.md cazzo; link tra requisiti e test.

Struttura dei file nelle feature
- spec.md: descrizione obiettivi, attori, user stories, AC, edge cases
- plan.md: architettura, componenti, test di integrazione, gates
- data-model.md: modello dati concettuale e payload campi principali
- contracts-api.md: contratti API ad alto livello (endpoints, payload, risposte)
- ui.md: linee guida UI/UX MVP
- tests.md: strategy di testing e mapping requisiti-test
- mvp-scenarios.md: scenari end-to-end MVP

Processo di revisione e quality
- Verifiche: check di consistenza tra requisiti e test; check di completamento per AC
- Audit: mantenere un registro delle modifiche principali alle specifiche
- Sicurezza: considerare RBAC e passwordless come parte dell’infrastruttura di base
