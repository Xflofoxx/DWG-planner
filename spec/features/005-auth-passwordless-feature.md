Title: Authentication – MVP
Slug: auth-feature
Intent: Definire il sistema di autenticazione con JWT e registrazione utente.

Stato: Implementato

Attori

- Utente registrato: effettua login
- Amministratore: gestisce utenti
- Sistema: validazione token

Requisiti chiave

- RQ1: Login con email e password
- RQ2: Registrazione utente (disabilitabile)
- RQ3: Validazione JWT token
- RQ4: Protezione route API
- RQ5: Ruoli utente (user, admin)

Criteri di accettazione

- AC1: Login restituisce token JWT valido
- AC2: Registrazione disabilitabile via configurazione
- AC3: Token scade dopo 7 giorni
- AC4: Password salvate con hash bcrypt

Edge cases

- Password errata
- Utente non esistente
- Token scaduto
- Registrazione disabilitata

Configurazione

- REGISTRATION_ENABLED=false (default)
- JWT_SECRET configurabile
- BCRYPT_ROUNDS=12
