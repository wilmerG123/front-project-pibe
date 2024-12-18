# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el proyecto al contenedor
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Establecer el puerto que se usará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
