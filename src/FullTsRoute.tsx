import * as React from 'react';
import { Route, RouteComponentProps} from 'react-router';

/**
 * Likely with React Router, but is async
 */
export interface FullTsRouteProps {
    path: string;
    component?: React.ComponentType | (() => PromiseLike<{ default: React.ComponentType }>);
    render?: ((props: RouteComponentProps<any>) => (React.ReactNode | PromiseLike<React.ReactNode>));
}; 

interface FullTsRouteState {
    componentClass?: React.ComponentClass;
    node?: React.ReactNode;
}

export default class FullTsRoute extends React.Component<FullTsRouteProps, FullTsRouteState>{
    //<Switch></Switch>的BUG 如果不指定这个则会全部变成exact false
    static defaultProps = {
        exact: true
    } as any;

    constructor(props?: FullTsRouteProps, context?: any) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        if (this.props.render) {
            let result = this.props.render({
                match: (this.props as any).match,
                location: (this.props as any).location,
                history: (this.props as any).history
            });
            if (result && (result as PromiseLike<React.ReactNode>).then) {
                //is Promise
                (result as PromiseLike<React.ReactNode>).then(v => {
                    this.setState({
                        node: v
                    })
                })
            }
            else {
                //not Promise
                this.setState({
                    node: result as React.ReactNode
                })
            }
        }
        else if (this.props.component) {
            if (typeof this.props.component == 'function') {
                //function
                let result: any = (this.props.component as Function)();
                if (result.then) {
                    result.then((v: any) => {
                        this.setState({
                            componentClass: v.default
                        })
                    })
                }
                else {
                    //pure component function
                    this.setState({
                        componentClass: this.props.component as any
                    })
                }
            }
            else {
                //not function
                this.setState({
                    componentClass: this.props.component
                })
            }
        }
    }

    render() {
        if (this.state.node) {
            //render
            return <Route path={this.props.path} exact>{this.state.node}</Route>;
        }
        else if (this.state.componentClass) {
            //component
            return <Route path={this.props.path} exact component={this.state.componentClass} />;
        }
        else {
            //loading
            return <Route path={this.props.path} exact />;
        }
    }
}