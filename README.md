# dast

## Vulnerable Apps

### `node`

``` sh
cd apps/node
npm i
node index.js
```

The application should be available at http://localhost:3000/

### `gql-api`

Based on https://github.com/metlo-labs/metlo/tree/develop/sample-service/sample-graphql

``` sh
cd apps/gql-api
yarn
node index.js
```

The application should be available at http://localhost:3001/graphql

## Module Prototypes

- [dast/nuclei](scanners/dast/nuclei/)
- [dast/zap](scanners/dast/zap/)
