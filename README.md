FullTS
===

**EN** / [中文](https://github.com/k8w/fullts/blob/master/README_cn.md)

Full-stack framework in TypeScript, based on [TSRPC](https://github.com/k8w/tsrpc) and React.

**Still under developing, feel free to log a issue.**

## Features
*//TODO*

## Usage

```ts
import * as React from 'react';
import {FullTsApp} from 'fullts';

new FullTsApp({
    serverUrl: '',
    routes: [
        { path: '/', component: () => import('./views/HomeView') },
        { path: '/posts', component: () => import('./views/ArticleListView') },
        { path: '/post/:id', component: () => import('./views/SingleArticleView') },
        { path: '*', component: () => import('./views/Page404') }   //404 Page
    ]
}).render(document.getElementById('app-root')!)
```