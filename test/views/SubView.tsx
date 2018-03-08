import * as React from 'react';
import FulltsComponent from '../../src/FulltsComponent';
import Layout from './Layout';

export default class SubView extends FulltsComponent {
    componentWillMount() {
        
    }

    render() {
        this.app.setTitle('SubView' + this.app.params.id);
        this.app.setSeoMeta({
            keywords: ['Home', 'Sub'],
            description: 'sub'
        })
        
        return (
            <div style={{background: '#ccc', height: 2000}}>SubView {this.app.params.id} {this.app.query.id}</div>
        )
    }

    componentWillUnmount() {
        console.log('subview unmount')
    }
}