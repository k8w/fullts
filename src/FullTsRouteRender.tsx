import * as React from 'react';
import { FullTsAppRoute } from './FullTsAppConfig';
import { RouteComponentProps } from 'react-router';
import FullTsApp from './FullTsApp';

export interface FullTsRouteRenderProps {
    app: FullTsApp,
    route: FullTsAppRoute,
    routeProps: RouteComponentProps<any>,
    thisIsLayout?: boolean
}

export interface FullTsRouteRenderState {
    componentClass?: React.ComponentClass;
}

export default class FullTsRouteRender extends React.Component<FullTsRouteRenderProps, FullTsRouteRenderState>{
    private renderId = 0;

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
        if (this.props.route.layout) {
            //Layout
            return (
                <FullTsRouteRender app={this.props.app}
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
                </FullTsRouteRender>
            )
        }
        else {
            //非Layout
            let key;
            if (this.props.thisIsLayout) {
                key = this.props.app.config.alwaysRemountLayout ? ++this.renderId : this.renderId
            }
            else {
                key = this.props.app.config.alwaysRemountLayout ? ++this.renderId : this.renderId
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