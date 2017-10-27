import * as React from 'react';
import FullTsComponent from '../../src/FullTsComponent';
import Layout from './Layout';

export default class Page404 extends FullTsComponent{
    render() {
        return (
            <Layout>
                <h1>404</h1>
                <p>Page Not Found.</p>
            </Layout>
        )
    }
}