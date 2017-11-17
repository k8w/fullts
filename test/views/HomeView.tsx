import * as React from 'react';
import FullTsComponent from '../../src/FullTsComponent';
import Layout from './Layout';
import FullTsView from '../../src/FullTsView';

export default class HomeView extends FullTsView{
    componentWillMount() {
        this.app.setTitle('HomeView');
        this.app.setSeoMeta({
            keywords: ['Home', 'View'],
            description: 'Home is home'
        })
    }
    
    render() {
        return (
            <div>HomeView</div>
        )
    }
}