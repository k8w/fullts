import * as React from 'react';
import FullTsComponent from '../../src/FullTsComponent';
import Layout from './Layout';

export default class HomeView extends FullTsComponent{
    componentWillMount() {
        this.app.setTitle('HomeView');
        this.app.setSeoMeta({
            keywords: ['Home', 'View'],
            description: 'Home is home'
        })
    }
    
    render() {
        return (
            <Layout>
                HomeView
            </Layout>
        )
    }
}