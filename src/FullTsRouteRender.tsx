import * as React from 'react';
import { FullTsAppRoute } from './FullTsAppConfig';
import { RouteComponentProps } from 'react-router';

export interface FullTsRouteRenderProps {
    route: FullTsAppRoute,
    routeProps: RouteComponentProps<any>
}

export interface FullTsRouteRenderState {
    componentClass?: React.ComponentClass;
}

export default class FullTsRouteRender extends React.Component<FullTsRouteRenderProps, FullTsRouteRenderState>{
    //<Switch></Switch>的BUG 如果不指定这个则会全部变成exact false
    static defaultProps = {
        exact: true
    } as any;

    constructor(props?: FullTsRouteRenderProps, context?: any) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        // if (this.props.route.render) {
        //     let result = this.props.route.render({
        //         match: (this.props as any).match,
        //         location: (this.props as any).location,
        //         history: (this.props as any).history
        //     });
        //     if (result && (result as PromiseLike<React.ReactNode>).then) {
        //         //is Promise
        //         (result as PromiseLike<React.ReactNode>).then(v => {
        //             this.setState({
        //                 node: v
        //             })
        //         })
        //     }
        //     else {
        //         //not Promise
        //         this.setState({
        //             node: result as React.ReactNode
        //         })
        //     }
        // }
        if (this.props.route.component) {
            if (typeof this.props.route.component == 'function') {
                //function
                let result: any = (this.props.route.component as Function)();
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
                        componentClass: this.props.route.component as any
                    })
                }
            }
            else {
                //not function
                this.setState({
                    componentClass: this.props.route.component
                })
            }
        }
    }

    render(): React.ReactNode {
        let output: React.ReactNode = null;
        if (this.state.componentClass) {
            //component
            let Comp = this.state.componentClass;
            output = <Comp {...this.props.routeProps} >{this.props.children}</Comp>;
        }

        if (this.props.route.layout) {
            //Layout
            return <FullTsRouteRender route={{
                path: this.props.route.path,
                component: this.props.route.layout
            }} routeProps={this.props.routeProps} >{output}</FullTsRouteRender>
        }
        else {
            return output;
        }
    }
}