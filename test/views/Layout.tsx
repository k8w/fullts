import * as React from 'react';
import { NavLink } from 'react-router-dom';

const style = {
    fontSize: 20,
    color: '#999',
    width: '100%',
    textAlign: 'center',
    background: '#ddd'
};

export default class Layout extends React.PureComponent {
    render() {
        return (
            <div>
                <header style={{ ...style, lineHeight: '30px', padding: '10px 0px' }}>
                    <p>Header</p>
                    <p>
                        <NavLink exact activeStyle={{color: 'red'}} to='/'>Home</NavLink>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <NavLink exact activeStyle={{ color: 'red' }} to='/sub'>SubView</NavLink>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <NavLink exact activeStyle={{ color: 'red' }} to='/sub/LA'>SubView/LA</NavLink>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <NavLink exact activeStyle={{ color: 'red' }} to='/sub/AB?id=CD'>SubView/AB?id=CD</NavLink>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <NavLink exact activeStyle={{ color: 'red' }} to={'/404'}>404</NavLink>
                    </p>
                </header>
                <section style={{ fontSize: 18, padding: 20 }}>{this.props.children}</section>
                <footer style={{ ...style, lineHeight: '50px' }}>Footer</footer>
            </div>
        )
    }
}