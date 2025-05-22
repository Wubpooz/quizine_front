# Étape de build
FROM node:23-alpine AS build

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration npm
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du projet
COPY . .

# Build de l'application Angular
RUN npm run build

# Étape finale avec Nginx
FROM nginx:alpine

# Copie des fichiers de l'application construite depuis l'étape de build
COPY --from=build /app/dist/quizine/browser /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# La commande par défaut de l'image Nginx démarre automatiquement le serveur
