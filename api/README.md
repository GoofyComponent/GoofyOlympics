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
  id     Int      @id @default(autoincrement())
  name   String?  @db.VarChar(255)
  sex    String?  @db.VarChar(255)
  age    Int?
  height Float?
  weight Float?
  team   String?  @db.VarChar(255)
  noc    String?  @db.VarChar(255)
  games  String?  @db.VarChar(255)
  year   Int?
  season String?  @db.VarChar(255)
  city   String?  @db.VarChar(255)
  sport  String?  @db.VarChar(255)
  event  String?  @db.VarChar(255)
  medal  String?  @db.VarChar(255)
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

### Utilisation dans le Code

Exemple d'utilisation du client Prisma :

```typescript
import { PrismaClient } from '@prisma/client'

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