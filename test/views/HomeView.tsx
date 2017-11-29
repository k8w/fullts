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

        setTimeout(() => {
            this.isShow = true;
            this.forceUpdate();
        }, 500)
    }
    
    private isShow = false;
    render() {
        if (!this.isShow) {
            return null
        }

        return (
            <div style={{ background: '#999', height: 2000 }}>
                {Array.from({ length: 4000 }, (v, i) => <div key={i} id={i.toString()}><a href={'#'+ (i+100)}>{i}</a></div>)}
            </div>
        )
    }

    componentWillUnmount() {
        console.log('homeview unmount')
    }
}