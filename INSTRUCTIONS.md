# NIMM Chrono — Mise en ligne sur ton téléphone

Ce dossier contient ta version "appli installable" de NIMM Chrono.
Suis ces étapes dans l'ordre, une seule fois. Après ça, l'appli vivra sur ton téléphone pour toujours, même PC éteint.

---

## Étape 1 — Créer un compte GitHub (si tu n'en as pas déjà un)

1. Va sur https://github.com
2. Clique sur "Sign up" et crée un compte gratuit (email + mot de passe)

Si tu as déjà un compte GitHub, passe directement à l'étape 2.

---

## Étape 2 — Créer le dépôt (le "dossier en ligne")

1. Une fois connecté, clique sur le bouton **vert "New"** (ou le **+** en haut à droite puis "New repository")
2. Dans "Repository name", écris : `nimm-chrono`
3. Laisse "Public" sélectionné
4. Ne coche rien d'autre (pas de README, pas de licence)
5. Clique sur **"Create repository"**

---

## Étape 3 — Mettre les fichiers en ligne

Sur la page qui s'affiche, tu vas voir un lien qui dit quelque chose comme **"uploading an existing file"**.

1. Clique sur ce lien (ou cherche le bouton **"Add file" → "Upload files"**)
2. Ouvre le dossier `nimm-chrono-pwa` que je t'ai donné
3. Fais un glisser-déposer de **tout le contenu** du dossier (les fichiers `index.html`, `manifest.json`, `service-worker.js`, ET le dossier `icons` avec les 3 images dedans) dans la zone de la page GitHub

   ⚠️ Important : glisse le **contenu** du dossier, pas le dossier `nimm-chrono-pwa` lui-même. Sinon GitHub va créer un sous-dossier en trop et l'appli ne marchera pas.

4. En bas de la page, clique sur **"Commit changes"** (le bouton vert)

---

## Étape 4 — Activer l'hébergement (GitHub Pages)

1. En haut de la page de ton dépôt, clique sur l'onglet **"Settings"**
2. Dans le menu de gauche, clique sur **"Pages"**
3. Sous "Build and deployment" → "Source", sélectionne **"Deploy from a branch"**
4. Juste en dessous, dans "Branch", choisis **"main"** et laisse le dossier sur **"/ (root)"**
5. Clique sur **"Save"**

Attends 1 à 2 minutes. Rafraîchis la page : une bannière verte va apparaître avec ton adresse, du type :

```
https://TON-NOM-UTILISATEUR.github.io/nimm-chrono/
```

---

## Étape 5 — Installer sur ton téléphone

1. Sur ton téléphone, ouvre cette adresse dans ton navigateur (Chrome ou Safari)
2. Vérifie que l'appli s'affiche correctement (le chrono, les boutons, etc.)
3. Selon ton téléphone :
   - **Android (Chrome)** : un menu (3 petits points en haut à droite) → "Ajouter à l'écran d'accueil" ou "Installer l'application"
   - **iPhone (Safari)** : bouton de partage (carré avec flèche vers le haut) → "Sur l'écran d'accueil"
4. L'icône NIMM Chrono apparaît sur ton écran d'accueil, comme une vraie appli

À partir de là, tu n'as plus besoin du navigateur : tu touches l'icône, ça s'ouvre en plein écran, et ça marche même sans connexion (tes données restent sur ton téléphone comme avant).

---

## Et pour les mises à jour futures ?

Si un jour on modifie encore `index.html` avec Cline, il suffira de revenir sur la page GitHub de ton dépôt et de remplacer le fichier (bouton "Add file" → "Upload files" → glisser le nouveau fichier par-dessus). L'appli sur ton téléphone se mettra à jour automatiquement la prochaine fois que tu l'ouvres avec une connexion internet active.

---

## En cas de souci

- **L'icône ne s'affiche pas bien** : vérifie que le dossier `icons` a bien été uploadé en entier (les 3 images dedans)
- **"Ajouter à l'écran d'accueil" n'apparaît pas** : assure-toi que l'adresse commence bien par `https://` (pas `http://`) — GitHub Pages le fait automatiquement, donc ça ne devrait pas arriver
- **Tes anciennes heures (du PC) n'apparaissent pas sur le téléphone** : c'est normal, voir la note ci-dessous
