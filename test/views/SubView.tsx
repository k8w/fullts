import * as React from 'react';
import FullTsComponent from '../../src/FullTsComponent';
import Layout from './Layout';

export default class SubView extends FullTsComponent{
    render() {
        return (
            <Layout>
                SubView
            </Layout>
        )
    }
}