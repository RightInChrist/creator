FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npx expo install react-native-web@~0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1

COPY . .

EXPOSE 19000 19001 19002 19006

# Start with explicit web platform and host binding
CMD ["sh", "-c", "export REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0 && npx expo start --web --host=0.0.0.0"] 