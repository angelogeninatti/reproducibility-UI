This is the repository for the web application through which we conducted the user study.
Its deployed version may be found at https://ir.ontomap.eu/?assigned_condition=X . X is an integer representing the system to test, following the map below:
- 0: {'b': 0.5, 'k1': 0.8},
- 1: {'b': 0.2, 'k1': 0.5},
- 2: {'b': 0.25, 'k1': 0.6},
- 3: {'b': 0.65, 'k1': 1.1},
- 4: {'b': 0.75, 'k1': 0.85},
- 5: {'b': 0.8, 'k1': 0.95},
- 7: {'b': 0.2, 'k1': 0.85}

To run the application locally, follow the instructions below.

## Project Setup
- Install node and npm if you have not already. During development, node version 20.17.0 was used.
- Run the following command in the project directory for the first time to install all required dependencies:
```sh
npm install
```

### Compile and Hot-Reload for Development
Run the following command:
```sh
npm run dev
```
The application will be available at the address which is displayed in the terminal.