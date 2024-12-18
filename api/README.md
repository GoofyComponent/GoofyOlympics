# GoofyOlympics API

## Configuration Prisma

### Installation

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### Configuration de la Base de Données

1. Créez un fichier `.env` à la racine du projet avec vos informations de connexion :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/goofy_olympics"
```

2. Le schéma Prisma se trouve dans `prisma/schema.prisma` et définit vos modèles de données :

```prisma
model athlete_events {
  id     Int     @id @default(autoincrement())
  name   String? @db.VarChar(255)
  sex    String? @db.VarChar(255)
  age    Int?    
  height Float?  
  weight Float?  
  team   String? @db.VarChar(255)
  noc    String? @db.VarChar(255)
  games  String? @db.VarChar(255)
  year   Int?    
  season String? @db.VarChar(255)
  city   String? @db.VarChar(255)
  sport  String? @db.VarChar(255)
  event  String? @db.VarChar(255)
  medal  String? @db.VarChar(255)
}
```

### Commandes Prisma Utiles

1. **Synchroniser le schéma avec la base de données existante** :

```bash
npx prisma db pull
```

2. **Générer le client Prisma** :

```bash
npx prisma generate
```

3. **Créer une migration** :

```bash
npx prisma migrate dev --name nom_de_la_migration
```

4. **Visualiser vos données** :

```bash
npx prisma studio
```

### Import des Données CSV

Pour importer les données des athlètes et des régions NOC :

```bash
npm run convert-csv
```

Ce script :

- Lit les fichiers CSV depuis le dossier `data/`
- Vérifie les doublons avant l'insertion
- Affiche la progression de l'import
- Gère les erreurs et les valeurs manquantes

### Docker et Initialisation des Données

### Structure de l'Initialisation

Le processus d'initialisation est géré par le script `docker-entrypoint.sh` qui s'exécute au démarrage du conteneur API.
Ce script :

1. Exécute les migrations Prisma
2. Génère le client Prisma
3. Importe les données CSV (uniquement à la première initialisation)

### Gestion de l'Import CSV

Pour éviter d'importer les données CSV à chaque redémarrage du conteneur, nous utilisons un système de flag :

```bash
INIT_FLAG="/app/data/.init_done"
if [ ! -f "$INIT_FLAG" ]; then
    echo " Première initialisation - Importing CSV data..."
    npm run convert-csv
    mkdir -p /app/data
    touch "$INIT_FLAG"
else
    echo " Les données ont déjà été importées, skip de l'import CSV"
fi
```

Le fichier `.init_done` est stocké dans un volume Docker persistant (`api_data`), ce qui permet de :

- Garder la trace de l'initialisation entre les redémarrages
- Éviter les imports redondants
- Préserver l'état même si l'image est reconstruite

### Configuration Docker

Le `docker-compose.yml` inclut :

```yaml
services:
  api:
    volumes:
      - api_data:/app/data    # Volume pour le flag d'initialisation
    depends_on:
      postgres_goofy_olympics:
        condition: service_healthy    # Attend que la BDD soit prête

  postgres_goofy_olympics:
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s

volumes:
  api_data:    # Volume persistant pour les données d'initialisation
```

### Healthcheck et Dépendances

#### Pourquoi `service_healthy` au lieu de `started` ?

Docker propose deux conditions principales pour les dépendances :

1. **`condition: service_started`** :
    - Attend simplement que le conteneur soit démarré
    - Ne garantit PAS que le service à l'intérieur est prêt
    - Exemple : Le conteneur PostgreSQL peut être démarré, mais PostgreSQL lui-même n'est pas encore prêt à accepter des
      connexions

2. **`condition: service_healthy`** :
    - Attend que le service passe les tests de santé définis
    - Garantit que le service est réellement opérationnel
    - Plus fiable pour les dépendances critiques comme les bases de données

#### Configuration du Healthcheck

Notre healthcheck PostgreSQL :

```yaml
healthcheck:
  test: [ "CMD-SHELL", "pg_isready -U postgres" ]  # Vérifie si PostgreSQL accepte les connexions
  interval: 5s    # Vérifie toutes les 5 secondes
  timeout: 5s     # Abandonne si le test prend plus de 5 secondes
  retries: 5      # Réessaie 5 fois avant de marquer comme unhealthy
  start_period: 10s   # Donne 10s au démarrage avant de commencer les tests
```

#### Exemple Concret

Sans healthcheck :

1. PostgreSQL démarre (conteneur running)
2. L'API démarre immédiatement
3. L'API échoue car PostgreSQL n'est pas prêt

Avec healthcheck :

1. PostgreSQL démarre (conteneur running)
2. Docker vérifie si PostgreSQL accepte les connexions
3. L'API attend que PostgreSQL soit vraiment prêt
4. L'API démarre une fois que PostgreSQL est opérationnel

#### Commandes de Test

Pour vérifier l'état de santé des services :

```bash
# Voir l'état de santé de tous les conteneurs
docker ps --format "table {{.Names}}\t{{.Status}}"

# Voir les logs du healthcheck
docker inspect --format "{{json .State.Health }}" postgres_goofy_olympics | jq
```

#### Bonnes Pratiques

1. **Toujours utiliser des healthchecks** pour les services critiques comme :
    - Bases de données
    - Cache (Redis)
    - Message brokers (RabbitMQ, Kafka)

2. **Ajuster les paramètres** selon vos besoins :
    - `start_period` : Plus long pour les services lourds
    - `interval` : Plus fréquent pour les services critiques
    - `retries` : Plus élevé pour les services instables

3. **Tests de santé appropriés** :
    - PostgreSQL : `pg_isready`
    - MySQL : `mysqladmin ping`
    - Redis : `redis-cli ping`
    - API : Endpoint `/health`

### Réinitialisation des Données

Si vous avez besoin de réimporter les données :

1. Supprimez le volume contenant le flag :

```bash
docker volume rm goofy_olympics_api_data
```

2. Ou supprimez tous les volumes (attention, cela supprimera aussi les données de la BDD) :

```bash
docker-compose down -v
```

3. Redémarrez les conteneurs :

```bash
docker-compose up --build
```

### Bonnes Pratiques

1. **Migrations** : Sont toujours exécutées au démarrage pour assurer la cohérence du schéma
2. **Import CSV** : N'est exécuté qu'une seule fois pour éviter la duplication des données
3. **Healthcheck** : Garantit que la base de données est prête avant de démarrer l'API

### Utilisation dans le Code

Exemple d'utilisation du client Prisma :

```typescript
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

// Récupérer des athlètes
const athletes = await prisma.athlete_events.findMany({
    where: {
        noc: 'FRA',
        medal: 'Gold'
    },
    take: 10
})

// Créer un nouvel enregistrement
const newAthlete = await prisma.athlete_events.create({
    data: {
        name: 'John Doe',
        noc: 'USA',
        sport: 'Swimming'
    }
})
```

### Bonnes Pratiques

1. **Gestion des Connexions** :
    - Créez une seule instance de PrismaClient
    - Réutilisez-la dans toute votre application

2. **Transactions** :
    - Utilisez `prisma.$transaction` pour les opérations multiples
    - Assurez l'intégrité des données

3. **Performances** :
    - Utilisez `select` pour limiter les champs retournés
    - Ajoutez des index pour les requêtes fréquentes

4. **Migrations** :
    - Testez les migrations en développement
    - Utilisez `prisma migrate deploy` en production

### Dépannage

1. **Erreur de connexion** :
    - Vérifiez votre DATABASE_URL dans .env
    - Assurez-vous que PostgreSQL est en cours d'exécution

2. **Erreurs de type** :
    - Exécutez `prisma generate` après modification du schéma
    - Vérifiez la correspondance des types TypeScript

3. **Problèmes de migration** :
    - Utilisez `prisma migrate reset` pour réinitialiser en développement
    - Sauvegardez vos données avant les migrations en production