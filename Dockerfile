FROM ubuntu

#Install curl
RUN apt-get update
RUN apt-get install sudo
RUN apt-get upgrade -y
RUN apt-get update
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

#Install NodeJS
RUN apt-get install nodejs -y

#Install the MongoDB client in linux
RUN apt-get install mongodb-clients -y

#Install Angular
RUN npm install npm@latest -g
RUN npm install -g @angular/cli

#NodeJS
WORKDIR /avocado/users-client
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN npm update
COPY . .
#EXPOSE 4200
EXPOSE 80
CMD ./how2Start