# Depósito Evidências

## WebUI Annotations

-   Expo Docs: https://docs.expo.dev/router/installation/ - https://expo.dev/
-   Nativewind Docs: https://www.nativewind.dev/quick-starts/expo
-   Nativewind to run on web: https://github.com/marklawlor/nativewind/issues/470

To create the environment, run:

```
npx create-expo-app
npx expo installt expo-router reac-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
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

qrcode generator

```
https://snack.expo.dev/@duascaras/ffb3af
```

dropdown picker

```
npx expo install @react-native-picker/picker
```

file structure

```
  app
  |- (auth)
  |   |- _layout.jsx
  |   |- sign-in.jsx
  |- (tabs)
  |   |- admin
  |   |   |- [id].jsx
  |   |   |- index.jsx
  |   |   |- sign-up.jsx
  |   |- analysis
  |   |   |- [id].jsx
  |   |   |- index.jsx
  |   |   |- new_analysis.jsx
  |   |- items
  |   |   |- [id].jsx
  |   |   |- index.jsx
  |   |   |- new_items.jsx
  |   |- pending
  |   |   |- index.jsx
  |   |- _layout.jsx
  |   |- home.jsx
  |- search
  |   |- [query].jsx
  |- _layout.jsx
  |- index.jsx
  assets
  |- fonts
  |- icons
  |- images
  components
  constants
  context
  |- AuthContext.js
```

we use this to log on the web

```
npx expo install @react-native-async-storage/async-storage
```
