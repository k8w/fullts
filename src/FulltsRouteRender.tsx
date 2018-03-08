import * as React from 'react';
import { FulltsAppRoute } from './FulltsAppConfig';
import { RouteComponentProps } from 'react-router';
import FulltsApp from './FulltsApp';

export interface FulltsRouteRenderProps {
    app: FulltsApp,
    route: FulltsAppRoute,
    routeProps: RouteComponentProps<any>,
    thisIsLayout?: boolean
}

export interface FulltsRouteRenderState {
    componentClass?: React.ComponentClass;
}

export default class FulltsRouteRender extends React.Component<FulltsRouteRenderProps, FulltsRouteRenderState>{
    private renderId = 0;

    constructor(props: FulltsRouteRenderProps, context?: any) {
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

    componentWillUpdate(nextProps: FulltsRouteRenderProps, nextState: FulltsRouteRenderState) {
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

    private isDynamicImport(component: FulltsAppRoute['component']): boolean {
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
        if (this.props.route.layout) {
            //Layout
            return (
                <FulltsRouteRender app={this.props.app}
                    route={{
                        path: this.props.route.path,
                        component: this.props.route.layout
                    }}
                    routeProps={this.props.routeProps}
                    thisIsLayout
                >
                    {this.state.componentClass ?
                        <this.state.componentClass
                            key={this.props.app.config.alwaysRemount ? ++this.renderId : this.renderId}
                            {...this.props.routeProps}
                        >{this.props.children}</this.state.componentClass>
                        : null
                    }
                </FulltsRouteRender>
            )
        }
        else {
            //非Layout
            let key;
            if (this.props.thisIsLayout) {
                key = this.props.app.config.alwaysRemountLayout ? ++this.renderId : this.renderId
            }
            else {
                key = this.props.app.config.alwaysRemount ? ++this.renderId : this.renderId
            }

            return this.state.componentClass ?
                <this.state.componentClass
                    key={key}
                    {...this.props.routeProps}
                >{this.props.children}</this.state.componentClass>
                : null;
        }
    }
}