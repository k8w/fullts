import * as React from 'react';
import FulltsComponent from '../../src/FulltsComponent';
import Layout from './Layout';
import FulltsView from '../../src/FulltsView';
import { Link } from 'react-router-dom';

export default class HomeView extends FulltsView{
    componentWillMount() {
        this.app.setTitle('HomeView');
        this.app.setSeoMeta({
            keywords: ['Home', 'View'],
            description: 'Home is home'
        })

        setTimeout(() => {
            this.isShow = true;
            this.forceUpdate();
        }, 100)
    }
    
    private isShow = false;
    render() {
        if (!this.isShow) {
            return <div>Loading...</div>
        }

        return (
            <div style={{ background: '#999', height: 2000 }}>
                {Array.from({ length: 4000 }, (v, i) => <div key={i} id={i.toString()}><Link to={'/sub/' + (i + 100)}>{i}</Link></div>)}
            </div>
        )
    }

    componentWillUnmount() {
        console.log('homeview unmount')
    }
}