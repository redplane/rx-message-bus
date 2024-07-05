# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:18.14.2-alpine as build

# Set the working directory
WORKDIR /app

## Copy application
COPY ./projects/demo /app/projects/demo

## Copy libraries
COPY ./.git /app/.git
COPY ./projects/core /app/projects/core

COPY ./*.json /app/
COPY ./projects/demo/nginx/default.conf /app

# Install all the dependencies
RUN npm install --legacy-peer-deps

# Generate the build of the application
RUN npm run build
RUN npm run build:lib

## Build the version file
RUN apk update
RUN apk add git
RUN apk add jq
RUN jq -n '$ARGS.named'   --arg branchName $(git rev-parse --abbrev-ref HEAD)   --arg commitHash $(git rev-parse --verify HEAD) > ./dist/demo/assets/version.json

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/demo/ /usr/share/nginx/html
COPY --from=build /app/dist/@message-bus/ /app/libs/@message-bus

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/appsettings.json > /usr/share/nginx/html/assets/appsettings.production.json && exec nginx -g 'daemon off;'"]

# Expose port 80
EXPOSE 80

