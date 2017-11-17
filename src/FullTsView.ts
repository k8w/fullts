import FullTsComponent from "./FullTsComponent";
import { RouteComponentProps } from "react-router";

/**
 * `FullTSView` is `FullTsComponent` which is assigned as route component.
 * Its props would have `react-router` props, like `history`, `location`, and `match`.
 */
export default class FullTsView<P={}, S={}> extends FullTsComponent<P & RouteComponentProps<any>, S> {

}