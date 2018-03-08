import * as React from 'react';
import { NavLink } from 'react-router-dom';
import FulltsComponent from '../../src/FulltsComponent';

const style = {
    fontSize: 20,
    color: '#999',
    width: '100%',
    textAlign: 'center',
    background: '#ddd'
};

export default class Layout extends FulltsComponent {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }

    componentWillUnmount() {
        console.log('layout unmount')
    }
}