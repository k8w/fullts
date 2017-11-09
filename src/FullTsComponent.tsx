import * as React from "react";
import { ITsRpcClient, TsRpcPtl } from "tsrpc-protocol";
import SuperPromise from "k8w-super-promise";
import FullTsApp from './FullTsApp';
import { RpcClient } from "tsrpc-browser";
import * as PropTypes from 'prop-types';

export default class FullTsComponent<P={}, S={}> extends React.Component<P, S> implements ITsRpcClient {
    static contextTypes = {
        fullTsApp: PropTypes.instanceOf(FullTsApp)
    }

    constructor(props: P, context?: any) {
        super(props, context);

        //componentWillUnmount cancel all api requests
        if (this.componentWillUnmount) {
            let originalFunc = this.componentWillUnmount;
            this.componentWillUnmount = () => {
                this._componentWillUnmount();
                originalFunc();
            }
        }
        else {
            this.componentWillUnmount = this._componentWillUnmount;
        }
    }

    protected _apiRequests: { [sn: number]: SuperPromise<any> } = {};
    callApi<Req, Res>(ptl: TsRpcPtl<Req, Res>, req?: Req): SuperPromise<Res> {
        //ADD TO CONN POOL AND POP WHEN DISPOSE
        let conn = this.app.callApi(ptl, req);
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

    /**
     * Current FullTSApp Instance
     */
    get app(): FullTsApp {
        return this.context.fullTsApp;
    }

    //TODO
    history: any;   //ref
    location: any;  //ref
    params: any;    
    query: {[key: string]: string}; //ref

    private _componentWillUnmount() {
        this._cancelAllApiRequest();
    }

    private _cancelAllApiRequest() {
        for (let sn in this._apiRequests) {
            if (this._apiRequests.hasOwnProperty(sn)) {
                this._apiRequests[sn].cancel();
            }
        }
    }

    /**
     * 同原生setTimeout 但uncomponent时会自动清除
     * @param handler 
     * @param ms 
     */
    
    
    setTimeout(handler: () => void, ms: number) {
        
    }
}