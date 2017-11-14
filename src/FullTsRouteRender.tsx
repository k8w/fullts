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
        if (this.isDynamicImport(this.props.route.component)) {
            this.loadComponentClass(this.props.route.component);
        }
        else {
            //not function
            this.setState({
                componentClass: this.props.route.component as any
            })
        }
    }

    componentWillUpdate(nextProps: FullTsRouteRenderProps, nextState: FullTsRouteRenderState) {
        if (this.props != nextProps) {
            if (this.isDynamicImport(nextProps.route.component)) {
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
                nextState.componentClass = nextProps.route.component as any
            }
        }        
    }

    private loadedComponentClass: { [key: string]: React.ComponentClass } = {};
    private loadComponentClass(func: Function) {
        func().then((v: any) => {
            this.loadedComponentClass[func.toString()] = v.default;
            this.setState({
                componentClass: v.default
            })
        })
    }

    private isDynamicImport(component: FullTsAppRoute['component']): boolean {
        let result: any;
        try {
            result = (component as any)()
        }
        catch{
            return false;
        }

        if (result && result.then) {
            return true;
        }
        else {
            return false;
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