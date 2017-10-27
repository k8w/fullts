import * as React from 'react';
import FullTsApp from '../src/FullTsApp';

new FullTsApp({
    serverUrl: '',
    routes: [
        { path: '/', component: () => import('./views/HomeView') },
        { path: '/sub', component: () => import('./views/SubView') },
        { path: '*', component: () => import('./views/Page404') }
    ]
}).render(document.getElementById('app-root')!)