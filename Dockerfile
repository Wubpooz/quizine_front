# Utilise une image Node officielle comme image de base
FROM node:20-alpine as build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances et installer les dépendances
COPY quizine/package.json quizine/package-lock.json ./quizine/
WORKDIR /app/quizine
RUN npm install

# Copier le reste du code source de l'application
COPY quizine/ ./

# Construire l'application Angular
RUN npm run build -- --configuration production

# Étape de production NGINX
FROM nginx:alpine

# Copier le build Angular dans le dossier de distribution NGINX
COPY --from=build /app/quizine/dist/quizine/browser /usr/share/nginx/html

# Copier la configuration NGINX personnalisée si besoin (optionnel)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
