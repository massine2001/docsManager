# docsManager — Global (Front + BFF + Back + AS)

**docsManager** est une plateforme de **gestion documentaire distribuée** :  
chaque fichier appartient à un **espace contrôlé (pool)**, chaque utilisateur agit sous un **rôle défini**.

## 🧱 Architecture globale

Le système repose sur trois modules principaux :

- **Front-end (React)** : offre une interface intuitive, réactive et unifiée pour toutes les opérations utilisateurs.  
- **BFF (Back-For-Front)** : couche intermédiaire introduite à cause des contraintes de **Spring Boot** en matière de sécurité OAuth2 et d’isolation des domaines.  
  - Le BFF gère la validation des tokens, l’orchestration des appels et l’adaptation des réponses pour le front.  
  - Il permet d’éviter les problèmes de CORS et de séparer les responsabilités entre présentation et logique métier.  
  - Il prend également en charge la gestion des **refresh tokens**, nécessaire pour les **clients confidentiels**, permettant le renouvellement des sessions sans exposer les secrets côté front.  
- **Back-end (Spring Boot)** : gère la sécurité, les utilisateurs, les droits, la persistance et la gestion des fichiers (via **SFTP**).

Un **Authorization Server** (Spring Authorization Server) complète l’ensemble pour l’émission/validation des tokens (OIDC, JWT, JWKS).

Le tout fonctionne dans un environnement **Dockerisé**.

## 🧩 Modèle conceptuel

Le modèle de données repose sur **quatre entités principales** :

- **User** — représente l’identité d’un utilisateur, liée à un rôle et à un ensemble de pools.  
- **Pool** — espace logique de stockage, défini par des permissions précises (lecture, écriture, gestion).  
- **File** — document enregistré, contenant ses métadonnées, son uploader, sa date de création, et ses compteurs (vues / téléchargements).  
- **Access** — définit la relation entre un utilisateur et une pool (rôle, autorisations).

## 🔁 Cycle de requête

Chaque requête suit ce flux :

1. Le **front-end** envoie une requête REST au **BFF**.  
2. Le **BFF** transmet la requête au **back-end** en joignant le **token OAuth2**.  
3. Le **back-end** vérifie le token, identifie le **contexte utilisateur**, puis applique la logique d’accès.  
4. Si l’action est autorisée :
   - Exécution de l’opération correspondante (interaction SFTP, mise à jour base).  
   - Renvoi d’un flux ou d’un JSON selon le contexte.  
5. En cas d’erreur, une **réponse HTTP explicite** est renvoyée (`403`, `404`, `500`, etc.).

## 💾 Stockage et SFTP

Le **SFTP** agit comme un **stockage unifié**.  
L’arborescence est structurée par **pool** et par **utilisateur** :  
`/annuaire/poolX/userY/nom_fichier`

## 📊 Statistiques et traçabilité

Le système de statistiques intègre plusieurs indicateurs clés :

- Activité quotidienne.  
- Top uploaders.  
- Distribution des formats.  
- Membres inactifs.  
- Taux d’activité global.  
- Vues et téléchargements cumulés.

Ces données sont calculées dynamiquement à partir des compteurs et des enregistrements en base.

## 🔄 CI/CD

Un pipeline **GitHub Actions** est en place (module back) pour builder et publier les images Docker sur **Docker Hub** :

- Déclencheurs : `push` et `pull_request` sur la branche `main`.  
- Build Java : `setup-java@v4` (**Temurin 21**), `mvn -DskipTests package`.  
- Secrets requis : `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.


## 🔗 Liens des modules

- **Front-end (React)** : https://github.com/massine2001/docsManager/tree/main/docsManagerfrontend  
- **Back-end (Spring Boot)** : https://github.com/massine2001/docsManager/tree/main/docsmanagerbackend  
- **BFF (Spring Boot, OIDC, refresh tokens pour clients confidentiels)** : https://github.com/massine2001/backend-for-frontend_OidcSpringAS  
- **Authorization Server (Spring Authorization Server)** : https://github.com/massine2001/auth_server
