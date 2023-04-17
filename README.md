# dast

## Vulnerable Apps

### `node`

``` sh
cd apps/node
npm i
node index.js
```

http://localhost:3000/

### `gql-api`

Based on https://github.com/metlo-labs/metlo/tree/develop/sample-service/sample-graphql

``` sh
cd apps/gql-api
yarn
node index.js
```

http://localhost:3001/

## Module Prototypes

- [dast/nuclei](scanners/dast/nuclei/module.yaml)
- [dast/zap](scanners/dast/zap/module.yaml)
