FROM node:latest

WORKDIR /app
COPY . .
RUN npm install
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/* 
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN apt-get install -y python3-pip
RUN pip install -r public/scripts/requirements.txt --break-system-packages


EXPOSE 3000
CMD ["npm", "run","dev"]