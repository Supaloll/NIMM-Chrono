# ARCHITECTURE.md — NIMM Chrono

État réel du code. À relire en début de chaque session avant toute modification.

## Vue d'ensemble

- **Un seul fichier** : `index.html` (HTML + CSS + JS, tout inline, pas de framework, pas de build)
- **Pas de backend, pas de base de données** : tout est stocké en `localStorage` du navigateur
- **Hébergement** : GitHub Pages, dépôt `nimm-chrono`, branche `main`
- **Mode hors-ligne** : `service-worker.js` met en cache les fichiers statiques (jamais les appels aux API de LLM)
- **Fichiers du projet** :
  - `index.html` — toute l'application
  - `service-worker.js` — cache PWA + cache-busting via `CACHE_VERSION`
  - `manifest.json` — métadonnées PWA (icônes, nom, couleurs)
  - `.clinerules` — règles de travail pour Cline (Windows, encodage, FIND/REPLACE)
  - `INSTRUCTIONS.md` — guide de déploiement initial (GitHub Pages, installation mobile)
  - `ARCHITECTURE.md` — ce fichier

## Clés localStorage utilisées

| Clé | Contenu |
|---|---|
| `nimm_chrono_sessions` | Tableau des sessions de travail terminées (tournées) |
| `nimm_chrono_current_session` | Session en cours (ou absente si aucun chrono actif) |
| `nimm_chrono_known_tours` | Liste des 12 derniers noms de tournée (autocomplétion) |
| `nimm_chrono_deepseek_key` | Clé API du provider LLM actif (nom historique, à généraliser lors du passage multi-provider) |
| `nimm_chrono_assistant_history_amandine` | Historique de conversation avec l'Assistant, contexte Amandine |
| `nimm_chrono_assistant_history_theo` | Historique de conversation avec l'Assistant, contexte Théo |
| `nimm_chrono_assistant_active_contact` | Dernier onglet actif (`amandine` ou `theo`) |

**Règle stricte** : ces clés ne doivent jamais être mélangées entre elles. Le calcul du quota (`getWeekTotalMs`) ne lit que `nimm_chrono_sessions` + `nimm_chrono_current_session`.

## Fonctionnalités principales

### 1. Chrono de tournée (cœur de l'app)
- Démarrer / Pause / Changer de tournée / Terminer
- Une session = `{ id, tourName, start, end, durationMs }`
- Gestion de la pause via `accumulatedPauseMs` + `pausedAt`
- Historique affiché par jour, sur la semaine en cours (lundi → aujourd'hui)
- Édition/suppression manuelle d'une session, ajout manuel (`buildEditForm`)

### 2. Quota hebdomadaire — bouton "💬 Quota semaine"
- `WEEKLY_QUOTA_MS = 28h` (tolérance de fait : alerte seulement au-delà, pas de blocage dur)
- `getWeekTotalMs()` = somme des sessions de la semaine + session en cours si applicable → **seule source de vérité**
- Génère un SMS via l'API du LLM actif, à partir du total réel (jamais estimé)
- Boutons "🔄 Régénérer" (relance l'appel) et "Fermer" (cache la zone, vide le texte) — ajoutés pour éviter de devoir fermer/rouvrir l'app

### 3. Assistant quota — bouton "🤖 Assistant"
- Modale plein écran (`#assistantModal`), chat avec historique persistant
- **Double historique séparé** : un onglet "Amandine", un onglet "Théo" — jamais mélangés, jamais de déduction automatique de répétition/récidive entre les deux
- Chaque message stocké : `{ role, content, ts }` (`ts` = timestamp ms)
- Fenêtre glissante : seuls les **20 derniers messages** de l'historique actif sont envoyés à l'API à chaque appel (`.slice(-20)`) ; l'historique complet reste stocké et affiché à l'écran
- Le timestamp de chaque message est injecté en clair (`[lundi 23 juin, 18h12]`) dans ce qui est envoyé à l'API, jamais affiché ainsi à l'écran (l'écran affiche une heure courte/discrète sous chaque bulle, via `formatAssistantMsgTime`)
- Prompt système = `ASSISTANT_BASE_PROMPT` (tronc commun : mission de garde-fou santé + administratif sur le quota 28h) + `ASSISTANT_CONTACT_PROMPTS[contact]` (ton diplomate + emojis pour Amandine, ton direct + emojis pour Théo) + le total d'heures réel de la semaine, recalculé à chaque envoi
- Le LLM ne doit jamais déduire seul une durée de tournée non précisée — il doit la demander
- Bouton "🗑️ Nouvelle conversation" : efface uniquement l'historique de l'onglet actif

### 4. Réglages (⚙)
- Clé API du LLM (actuellement Deepseek uniquement — multi-provider à venir)
- Stockage local uniquement, jamais transmis ailleurs qu'à l'API du provider

## Règles de comportement du LLM (rappel)

- Mission : garde-fou sur le quota 28h (±2h), au nom de la santé de Laurent ET de la pérennité de son temps partiel thérapeutique (risque de remboursement rétroactif sécurité sociale en cas de non-respect)
- Ne minimise jamais un dépassement réel
- Si Laurent semble vouloir accepter un dépassement : alerte une fois clairement, puis respecte sa décision sans insister
- Ne décide jamais à la place de Laurent — rédige le SMS final mais n'envoie jamais rien automatiquement
- Pas de comptage automatique de récidive — uniquement si Laurent le précise lui-même dans la conversation

## Cache-busting (PWA)

`service-worker.js` contient `CACHE_VERSION`, une chaîne de date (`AAAA-MM-JJ`, suffixée `-1`, `-2`... si plusieurs sessions le même jour). **Cline doit l'incrémenter en fin de session**, juste avant que Laurent fasse son commit/push, même si aucun fichier mis en cache n'a visiblement changé — cela force tous les téléphones à recharger la nouvelle version plutôt que de garder l'ancienne en cache.

## Workflow de mise à jour

1. Laurent travaille dans VSCode + Cline (API Deepseek) sur le dossier local du dépôt
2. Cline applique les modifications par blocs FIND/REPLACE, un par un, avec vérification d'encodage après chaque bloc
3. En fin de session, Cline met à jour `CACHE_VERSION`
4. Laurent commit + push via GitHub Desktop
5. GitHub Pages republie automatiquement
6. Le téléphone de Laurent récupère la mise à jour à la prochaine ouverture avec connexion (le nouveau `CACHE_VERSION` force le rechargement)

## Chantiers en cours / à venir

- **Multi-provider LLM** (Deepseek / Claude Anthropic / Gemini) : actuellement seul Deepseek est câblé. Prévoir une fonction unique d'appel (`callLLM`) qui adapte URL, format de requête et extraction de réponse selon le provider sélectionné dans les réglages.
- **Export/Import des données** : actuellement aucune sauvegarde externe possible ; un vidage du cache/données du navigateur peut faire perdre `localStorage` de façon irréversible. Prévoir un export JSON manuel (sessions + historiques Assistant) et un import correspondant.
