FROM apify/actor-node:20

# Fuerza la descarga de Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=false

# Copia todo el proyecto
COPY . ./

# Instala dependencias (incluye Puppeteer)
RUN npm install --omit=dev

# Comando por defecto
CMD ["node", "main.js"]
