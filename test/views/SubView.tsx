import * as React from 'react';
import FullTsComponent from '../../src/FullTsComponent';
import Layout from './Layout';

export default class SubView extends FullTsComponent {
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
}