import * as React from 'react';
import FullTsApp from '../src/FullTsApp';

const HomeLayout = (props: any) => (
    <div>
        <h1>HomeView</h1>
        {props.children}
    </div>
)

const IndexView = () => (
    <HomeLayout>
        <h2>Index</h2>
        <hr />
        <p>Here is my home.</p>
    </HomeLayout>
)

new FullTsApp({
    serverUrl: '',
    routes: [
        { path: '/', component: IndexView },
        { path: '/sub', component: () => import('./views/SubView') },
        { path: '*', render: () => <h1>404 allal</h1> }
    ]
}).render(document.getElementById('app-root')!)