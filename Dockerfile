FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PGHOST='ep-patient-voice-azynafbk-pooler.c-3.ap-southeast-1.aws.neon.tech'
ENV PGDATABASE='neondb'
ENV PGUSER='neondb_owner'
ENV PGPASSWORD='npg_VOAvXKjtM0r9'
ENV PGSSLMODE='require'
ENV PGCHANNELBINDING='require'

EXPOSE 3000

CMD ["node","index.js"]