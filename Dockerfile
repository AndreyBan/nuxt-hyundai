FROM node:16

ENV APP_ROOT /hyundai

WORKDIR ${APP_ROOT}

COPY package.json ${APP_ROOT}

COPY package-lock.json ${APP_ROOT}

RUN npm ci

COPY . ${APP_ROOT}

RUN npm run build

CMD ["npm", "run", "start"]
