import * as React from "react";
import { FullTsAppRoute } from './FullTsAppConfig';
import { withRouter, RouteComponentProps, matchPath } from "react-router";
import FullTsRouteRender from './FullTsRouteRender';
import FullTsApp from './FullTsApp';

export interface FSwitchProps{
    routes: FullTsAppRoute[],
    app: FullTsApp
}

class FSwitch extends React.Component<FSwitchProps>{
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

            return <FullTsRouteRender route={matched.route} routeProps={routeProps} />
        }
        else {
            return <h1>404 Page Not Found</h1>
        }
    }

    private getMatchedRoute(pathname: string, routes: FullTsAppRoute[]): { route: FullTsAppRoute, match: RouteComponentProps<any>['match']} | null {
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

const FullTsRouteSwitch = withRouter(FSwitch as any);
export default FullTsRouteSwitch;