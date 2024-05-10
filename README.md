# Depósito Evidências

## WebUI Annotations

-   Expo Docs: https://docs.expo.dev/router/installation/
-   Nativewind Docs: https://www.nativewind.dev/quick-starts/expo
-   Nativewind to run on web: https://github.com/marklawlor/nativewind/issues/470

To create the environment, run:

```
npx create-expo-app
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo install react-native-web react-dom
npm install
```

package.json configuration:

```
"main": "expo-router/entry",
```

app.json configuration:

```
"name": "Deposito-Evidencias",
"slug": "Deposito-Evidencias",
"scheme": "deposito-evidencias",
"web": {
    "bundler": "metro",
```

nativewind configuration:

```
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init <!-- to create tailwind.config.js file -->

<!-- tailwind.config.js -->
+ content: ["./app/**/*.{js,jsx,ts,tsx}", "./<components>/**/*.{js,jsx,ts,tsx}"],

<!-- babel.config.js -->
plugins: ["nativewind/babel"],
```

axios installation

```
npm install axios
```

expo-secure-store: Package that we use to store the JWT after getting from the API.

```
npx expo install expo-secure-store

<!-- app.json -->
"plugins": [
  ...
  "expo-secure-store"
]
```
