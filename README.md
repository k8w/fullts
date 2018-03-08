FullTS&nbsp;&nbsp;&nbsp;&nbsp;[![557045673](http://pub.idqqimg.com/wpa/images/group.png)](http://shang.qq.com/wpa/qunwpa?idkey=77c812b8bbe1f5b037b1c98409aee92f893881fc38afb001d401b399673e2eae)
===

**EN** / [中文](https://github.com/k8w/fullts/blob/master/README_cn.md)

Full-stack framework in TypeScript, based on [TSRPC](https://github.com/k8w/tsrpc) and React.

**Still under developing, feel free to log a issue.**

## Features
### Quick development
Extremly efficient in development, everything in TypeScript.
Share code between frontend and backend, remote function call just like local

### High performance
Delay load, pack and chunk, tested online over 2 years

### Easy to learn
Get best practise of project instantly, without learning many tools (etc. webpack, react-router...)

## Usage

```ts
import * as React from 'react';
import {FulltsApp} from 'fullts';

new FulltsApp({
    serverUrl: '',
    routes: [
        { path: '/', component: () => import('./views/HomeView') },
        { path: '/posts', component: () => import('./views/ArticleListView') },
        { path: '/post/:id', component: () => import('./views/SingleArticleView') },
        { path: '*', component: () => import('./views/Page404') }   //404 Page
    ]
}).renderTo(document.getElementById('app-root')!)
```