FROM apify/actor-node:20

# Fuerza la descarga de Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=false

# Copia archivos del proyecto
COPY . ./

# Instala dependencias y fuerza descarga
RUN npm install --omit=dev

# Ejecuta el script
CMD ["node", "main.js"]
