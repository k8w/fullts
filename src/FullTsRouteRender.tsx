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
    constructor(props: FullTsRouteRenderProps, context?: any) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        if (typeof this.props.route.component == 'function') {
            this.loadComponentClass(this.props.route.component);
        }
        else {
            //not function
            this.setState({
                componentClass: this.props.route.component
            })
        }
    }

    componentWillUpdate(nextProps: FullTsRouteRenderProps, nextState: FullTsRouteRenderState) {
        if (this.props != nextProps) {
            if (typeof nextProps.route.component == 'function') {
                let cacheKey = nextProps.route.component.toString();
                let cache = this.loadedComponentClass[cacheKey];
                if (cache) {
                    nextState.componentClass = cache
                }
                else {
                    nextState.componentClass = undefined;
                    this.loadComponentClass(nextProps.route.component);
                }                
            }
            else {
                nextState.componentClass = nextProps.route.component
            }
        }        
    }

    private loadedComponentClass: { [key: string]: React.ComponentClass } = {};
    private loadComponentClass(func: Function) {
        let result: any = func();
        if (result.then) {
            result.then((v: any) => {
                this.loadedComponentClass[func.toString()] = v.default;
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

    render(): any {
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