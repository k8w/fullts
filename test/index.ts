import FulltsApp from '../src/FulltsApp';
import Layout from './views/Layout';

new FulltsApp({
    serverUrl: '',
    routes: [
        { path: '/', component: () => import('./views/HomeView'), layout: () => import('./views/Layout') },
        { path: '/sub', component: () => import('./views/SubView'), layout: () => import('./views/Layout') },
        { path: '/sub/:id', component: () => import('./views/SubView'), layout: Layout },
        { path: '*', component: () => import('./views/Page404') }
    ],
    onRouteChange: e => {
        console.log(e);
    }
}).renderTo(document.getElementById('app-root')!)