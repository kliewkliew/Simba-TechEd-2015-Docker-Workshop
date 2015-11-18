# Creates Node server for GearInn
#
# docker build -t gearinn/node:0.12.4 .
# docker build -t gearinn/node:latest .

FROM node:latest
MAINTAINER Jude Zhu <judezhu.hust@gmail.com>

USER root

# Install software
RUN npm i -g ionic@1.4.5 bower grunt-cli gulp nodemon mocha

COPY bootstrap.sh /etc/bootstrap.sh
RUN chmod 700 /etc/bootstrap.sh

EXPOSE 8888 8080
