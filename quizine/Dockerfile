# Node.js avec Alpine comme image de base (plus légère)
FROM node:23-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration npm
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du projet
COPY . .

# Exposition du port utilisé par Angular (par défaut 4200)
EXPOSE 4200

# Commande pour démarrer l'application en mode développement
# L'option --host 0.0.0.0 permet d'accéder à l'application depuis l'extérieur du conteneur
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--disable-host-check"]
