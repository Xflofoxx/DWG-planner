Title: Authentication Passwordless – MVP
Slug: auth-passwordless-mvp
Intent: Definire il flusso passwordless per il cliente (visualizzazione) e i token

Requisiti chiave
- RQ1: Login passwordless per client via email token
- RQ2: Verifica token e creazione sessione per cliente
- RQ3: Sessività e logout

Acceptance Criteria
- AC1: Cliente può autenticarsi senza password e accedere alle viste di progetto
- AC2: I token hanno scadenza e meccanismo di rinnovo
- AC3: Audit del login (log dell’evento)
