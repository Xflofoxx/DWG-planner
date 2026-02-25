Title: Access Control – MVP (feature-wise)
Slug: access-control-mvp
Intent: Definire ruoli, permessi e flussi passwordless per cliente, risorse e planner (mappato alle feature).

Ruoli
- client: view-only access alle viste progetto
- resource: modifica task e stato; gestione assegnazioni (in MVP con permessi limitati)
- planner/admin: gestione mapping, risorse, contratti, audit

Permessi chiave
- client: GET only su viste/board/list/calendar/gantt
- resource: create/update task, assign resources
- planner/admin: full control su mapping, tasks, resources, auditting

Passwordless client flow
- login via email link; token a breve scadenza; sessione utente per client
