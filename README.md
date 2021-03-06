![Material for the spine](./docs/images/material-for-the-spine.png)

[![Build Status](https://img.shields.io/github/workflow/status/contredanse/mfts/CI/master?label=CI&logo=github&labelColor=000000)](https://github.com/contredanse/mfts/actions?query=workflow%3ACI)
[![codecov](https://codecov.io/gh/contredanse/mfts/branch/master/graph/badge.svg)](https://codecov.io/gh/contredanse/mfts)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# MFS 

A movement study webapp converted from [Contredanse](https://www.contredanse.org)'s "Material for the Spine" DVD-ROM 
originally written in flash/actionscript.


https://www.materialforthespine.com


## License

*Source code of this webapp is freely available under MIT license. 
Video material is subject to copyright to Contredanse editions, Brussels.
For support please register for a paid subscription.*

## Technologies

- React/Typescript/Webpack.

## Contributors

- [Sébastien Vanvelthem](https://github.com/belgattitude) - Webapp development, video/medias conversions.
- [Boblemarin](https://github.com/boblemarin) - Spiral menu development.
- [Contredanse](https://contredanse.org) - Design specs, texts, multimedia content.

## Notes for developers

### Install

```bash
$ git clone https://github.com/contredanse/mfts.git
$ cd mfts
$ yarn install
```

### Configure

> You don't have to but if you want for development to change
> some environment variables (links, assets url's...

Copy the [env.template](./env/env.template) file into `./env.development.local'.

```bash
$ cp ./env/env.template ./env.development.local
```

### Develop

```bash
$ yarn dev
```
*then open http://localhost:3001 in your browser.* 

### Check & test

```bash
$ yarn lint:fix
$ yarn prettier
$ yarn test
```

### Build

```bash
$ yarn build
```

> The build will be available in `/dist/public`

### Production

#### Server

To fully take advantage of brotli compression, Apache is recommended over Nginx.
Really be sure to not cache either `service-worker.js` and `index.html` 
to prevent PWA caching issues. 

*See [notes](./docs/deploy), [root .htaccess](./public/.htaccess.dist) and [static .htaccess](./public/static/.htaccess.dist). 
Note that apache support is build with the project. In other words, nothing to do for apache users.*

#### Deploy

For simple deployments scenarios have a look to the [deploy.sh.example](./deploy.sh.example). 
 

