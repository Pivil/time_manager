FROM node:12

ADD classes ./classes 
ADD controllers ./controllers 
ADD utils ./utils 

COPY config.js ./config.js 
COPY index.js ./index.js 
COPY process.yml ./process.yml 
COPY package.json ./package.json 

RUN npm install 
RUN npm instal pm2 -g

CMD ["pm2-runtime", "process.yml"]