import AppDispatcher from '../AppDispatcher';
import {ActionTypes} from '../Constants';
import EventEmmiter from 'events';

let _links = [];
class LinkStore extends EventEmmiter {
  constructor(props) {
    super(props);

    AppDispatcher.register(action => {
      switch (action.actionType) {
        case ActionTypes.RECEIVE_LINKS:
          _links = action.links;
          this.emit('change');
          break;
        default:
        // do nothing
      }
    });
  }

  getAll() {
    return _links;
  }
}

export default new LinkStore();
