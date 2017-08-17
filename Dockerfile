########################################################
# Dockerfile to build Kuroneko-chan
########################################################
FROM alpine:3.6

RUN apk --update add git nodejs nodejs-npm && node -v && npm -v

RUN git clone https://github.com/SaintKyo/Kuroneko-chan.git

ENV PROJECT_ROOT Kuroneko-chan
ENV CONFIG settings.json
ENV DB botData.db

RUN cd ${PROJECT_ROOT} && npm install

COPY ${CONFIG} ${PROJECT_ROOT}
COPY ${DB} /

ENTRYPOINT node ${PROJECT_ROOT}/app.js
