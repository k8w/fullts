import * as React from 'react';
import FulltsComponent from '../../src/FulltsComponent';
import Layout from './Layout';

export default class Page404 extends FulltsComponent{
    render() {
        return (
            <Layout>
                <h1>404</h1>
                <p>Page Not Found.</p>
            </Layout>
        )
    }
}