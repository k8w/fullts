import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FullTsAppConfig from './FullTsAppConfig';
import { ITsRpcClient, TsRpcPtl } from 'tsrpc-protocol';
import SuperPromise from 'k8w-super-promise';
import { RpcClient } from 'tsrpc-browser';
import * as PropTypes from 'prop-types';
import { BrowserRouter, Switch } from 'react-router-dom';
import FullTsRoute from './FullTsRoute';

export default class FullTsApp implements ITsRpcClient {
    protected rpcClient: RpcClient;
    readonly config: FullTsAppConfig;

    constructor(config: FullTsAppConfig) {
        this.config = config;
        this.rpcClient = new RpcClient({
            serverUrl: this.config.serverUrl
        })
    }

    protected _apiRequests: { [sn: number]: SuperPromise<any> } = {};
    callApi<Req, Res>(ptl: TsRpcPtl<Req, Res>, req?: Req): SuperPromise<Res> {
        //TODO ADD TO CONN POOL AND DISPOSE
        let conn = this.rpcClient.callApi(ptl, req);
        let sn = RpcClient.getLastReqSn();
        this._apiRequests[sn] = conn;

        //pop when complete
        conn.always(() => {
            delete this._apiRequests[sn];
        }).onCancel(() => {
            delete this._apiRequests[sn];
        })

        return conn;
    }

    protected _domTarget: HTMLElement;
    render(domTarget: HTMLElement) {
        this._domTarget = domTarget;
        ReactDOM.render(<FullTsAppContainer app={this} />, domTarget);
    }

    dispose() {
        this._domTarget && ReactDOM.unmountComponentAtNode(this._domTarget);
        this._domTarget = undefined as any;
        this.cancelAllApiRequest();
    }

    cancelAllApiRequest() {
        for (let sn in this._apiRequests) {
            if (this._apiRequests.hasOwnProperty(sn)) {
                this._apiRequests[sn].cancel();
            }
        }
    }
}

class FullTsAppContainer extends React.Component<{ app: FullTsApp }> {
    static childContextTypes = {
        fullTsApp: PropTypes.instanceOf(FullTsApp)
    }
    getChildContext() {
        return {
            fullTsApp: this.props.app
        };
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {this.props.app.config.routes.map((v, i) =>
                        <FullTsRoute key={i} {...v} />
                    )}
                </Switch>
            </BrowserRouter>
        );
    }
}