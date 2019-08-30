# Typescript API Framework
This is Typescript API Framework which apply ExpressJS

## Technologies:
- NodeJS
- Typescript
- Swagger UI
- OpenAPI Validation

## Dependencies:
- Node version: `v10.15.3`
- NPM version: `v6.4.1`
- Python: `v2.x`
- `node-gyp`
- Windows users will need the options for c# and c++ installed with their visual studio instance.
- PostgreSQL 11

## Usage:
### Configuration
- `server.host` in `config.ts` file (**not recommended**)
- `server.port` in `config.ts` file (running port)
- `server.public` in `config.ts` file (public IP or Domain)
- `env` in `config.ts` file (Environment variable)
- `pepper` in  `config.ts` file (static string to hash password)

### Running
#### Install
```
$ cd <path_of_project>
$ npm install --global node-gyp
$ npm install
```

#### API Service
Please follow my bellow progress:
```
$ cd <path_of_project>
$ npm start
```

#### CLI
Show command helper. Backup old logs in background process.
```
$ cd <path_of_project>
$ ./cli command
```

#### TypeORM
Use TypeORM CLI. Backup old logs in background process.
```
$ cd <path_of_project>
$ ./cli typeorm
```

#### Watching
To watch changed file and re-run server
```
$ cd <path_of_project>
$ npm run watch
```

### Server address
Server will be run on: `<schema>://<host_or_address>:<port>/<version>/`
> By default: [`http://127.0.0.1:8080/v1.0/`](http://127.0.0.1:8080/v1.0/)

### Document site
Document will be run on: `<schema>://<host_or_address>:<port>/<version>/docs/`
> By default: [`http://127.0.0.1:8080/v1.0/docs/`](http://127.0.0.1:8080/v1.0/docs/)

## Contact:
Powered by [Daniel Huynh](https://www.linkedin.com/in/huynh-nhat-truong/) - [sir.truonghuynh@gmail.com](mailto:sir.truonghuynh@gmail.com)