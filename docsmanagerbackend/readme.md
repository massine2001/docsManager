# docsManager — Back-end

Le back-end fournit une **API REST** au front-end et assure la **persistance des données** dans **MySQL** ainsi que le **stockage des fichiers** sur un **serveur SFTP**.  
L’architecture est **Dockerisée**.

## 💾 Gestion des fichiers

- Aucun fichier n’est stocké directement sur le serveur d’application.  
- Les fichiers sont transférés via **SFTP** vers un répertoire externe (`/annuaire/pool/...`) selon la structure **utilisateur/pool**.  
- Les **métadonnées** (nom, chemin, uploader, date, description, etc.) sont conservées dans différentes tables.

## 🔒 Sécurité et autorisations

- Authentification via un **serveur OAuth2 externe** : `auth.massine.org`  
  - Le back-end agit comme **Resource Server**, vérifiant le **token** à chaque requête.  
- Les autorisations sont contrôlées par `AccessService`.  
  - Un utilisateur ne peut **lire**, **modifier** ou **supprimer** un fichier que si son rôle le permet.  
- Les **pools publiques** (`public_access=true`) permettent l’accès sans authentification.  
- Le **CurrentUserProvider** identifie l’utilisateur courant à partir du token.

## 🔁 Communication via le BFF

Le **BFF (Back-For-Front)** sert de couche intermédiaire entre le **front-end** et le **back-end**.  
Cette architecture a été mise en place car **Spring Boot** impose une séparation stricte entre les domaines d’authentification et les ressources sécurisées.  
Le BFF gère donc la communication avec le serveur OAuth2, la validation des tokens, et relaie les requêtes au back-end selon les autorisations définies.  
Le front ne communique jamais directement avec le back-end, toutes les requêtes passent par le BFF.

## ⚙️ Technologies principales

- **Java 17+**
- **Spring Boot**
- **Spring Security / OAuth2**
- **Spring Data JPA / Hibernate**
- **MySQL**
- **SFTP**
- **Docker / Docker Compose**
