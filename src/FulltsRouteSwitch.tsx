import * as React from "react";
import { FulltsAppRoute } from './FulltsAppConfig';
import { withRouter, RouteComponentProps, matchPath } from "react-router";
import FulltsRouteRender from './FulltsRouteRender';
import FulltsApp from './FulltsApp';

export interface FSwitchProps extends RouteComponentProps<any>{
    routes: FulltsAppRoute[],
    app: FulltsApp
}

class FSwitch extends React.Component<FSwitchProps & Partial<RouteComponentProps<any>>>{
    
    shouldComponentUpdate(nextProps: this['props'], nextState: this['state']) {
        //当path不变 切换hash的时候 是不需要update的
        if (this.props.location!.pathname === nextProps.location!.pathname && nextProps.location!.hash) {
            return false;
        }
        
        return true;
    }

    render() {
        let matched = this.getMatchedRoute((this.props as any).location.pathname, this.props.routes);

        if (matched) {
            let routeProps = {
                match: matched.match,
                location: (this.props as any).location,
                history: (this.props as any).history
            }

            let prevLocation = this.props.app.location;
            let prevParams = this.props.app.params;
            let prevQuery = this.props.app.query;
            this.props.app.history = routeProps.history;
            this.props.app.match = routeProps.match;
            this.props.app.location = routeProps.location;
            this.props.app.params = routeProps.match.params;
            this.props.app.query = this.parseQueryString(routeProps.location.search);

            //event
            this.props.app.config.onRouteChange && this.props.app.config.onRouteChange({
                target: this.props.app,
                prevLocation: prevLocation,
                prevParams: prevParams,
                prevQuery: prevQuery
            });

            return <FulltsRouteRender app={this.props.app} route={matched.route} routeProps={routeProps} />
        }
        else {
            return <h1>404 Page Not Found</h1>
        }
    }

    componentDidUpdate() {
        if (this.props.app.config.alwaysScrollTop) {
            window.scrollTo(0, 0);
        }
    }

    private getMatchedRoute(pathname: string, routes: FulltsAppRoute[]): { route: FulltsAppRoute, match: RouteComponentProps<any>['match']} | null {
        for (let route of routes) {
            let match = matchPath(pathname, {
                path: route.path,
                exact: true
            })
            if (match) {
                return {
                    route: route,
                    match: match
                }
            }
        }
        
        return null;
    }

    private parseQueryString(search: string): { [key: string]: string } {
        if (!search) {
            return {};
        }

        let paramStrs = search.replace(/^\?/, '').split('&');
        let output: any = {};
        for (let str of paramStrs) {
            let equalPos = str.indexOf('=');
            if (equalPos > -1) {
                output[str.slice(0, equalPos)] = decodeURIComponent(str.slice(equalPos + 1))
            }
            else {
                output[str] = '';
            }
        }

        return output;
    }
}

const FulltsRouteSwitch = withRouter(FSwitch);
export default FulltsRouteSwitch;