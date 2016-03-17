import fetch from 'lib/fetch';
import * as models from 'models';

const initialState = {
  resource: null,
  resourceId: '',
  identifier: '',
  isRequesting: false,
  isLoaded: false,
  schema: null,
  fieldGroup: null,
  errorMessage: '',
};

const FIND_ONE_REQUEST = 'FIND_ONE_REQUEST';
const FIND_ONE_SUCCESS = 'FIND_ONE_SUCCESS';
const FIND_ONE_ERROR = 'FIND_ONE_ERROR';

const EDIT_RESOURCE = 'EDIT_RESOURCE';

const UPDATE_RESOURCE_REQUEST = 'UPDATE_RESOURCE_REQUEST';
const UPDATE_RESOURCE_SUCCESS = 'UPDATE_RESOURCE_SUCCESS';
const UPDATE_RESOURCE_ERROR = 'UPDATE_RESOURCE_ERROR';

const DELETE_RESOURCE_REQUEST = 'DELETE_RESOURCE_REQUEST';
const DELETE_RESOURCE_SUCCESS = 'DELETE_RESOURCE_SUCCESS';
const DELETE_RESOURCE_ERROR = 'DELETE_RESOURCE_ERROR';

export default function reducer(state = initialState, action = {}) {
  const {
    resource,
    fieldGroup,
    error,
    schema,
    field,
    updateValue,
    identifier,
    resourceId,
  } = action.payload || {};
  switch (action.type) {
    case FIND_ONE_REQUEST:
      return {
        ...state,
        isRequesting: true,
        errorMessage: '',
        identifier: null,
        resourceId: null,
        resource: null,
        fieldGroup: null,
        schema: null,
        isLoaded: false,
      };
    case FIND_ONE_SUCCESS:
      return {
        ...state,
        isRequesting: false,
        identifier,
        resourceId,
        resource,
        fieldGroup,
        schema,
        isLoaded: true,
      };
    case FIND_ONE_ERROR:
      console.log(error); // eslint-disable-line
      return {
        ...state,
        errorMessage: 'Error occurs',
      };
    case EDIT_RESOURCE:
      return {
        ...state,
        resource: {
          ...state.resource,
          [field]: updateValue,
        },
      };
    case UPDATE_RESOURCE_REQUEST:
      return {
        ...state,
        isRequesting: true,
      };
    case UPDATE_RESOURCE_SUCCESS:
      return {
        ...state,
        isRequesting: false,
      };
    case UPDATE_RESOURCE_ERROR:
      if (__DEV__) {
        console.log(error); // eslint-disable-line
      }
      return {
        ...state,
        isRequesting: false,
        errorMessage: 'Error occurs in during update',
      };
    case DELETE_RESOURCE_REQUEST:
      return {
        ...state,
        isRequesting: true,
      };
    case DELETE_RESOURCE_SUCCESS:
      return {
        ...state,
        isRequesting: false,
      };
    case DELETE_RESOURCE_ERROR:
      if (__DEV__) {
        console.log(error); // eslint-disable-line
      }
      return {
        ...state,
        isRequesting: false,
        errorMessage: 'Error occurs in during delete',
      };
    default:
      return state;
  }
}

export function loadResource({ identifier, resourceId }) {
  return async dispatch => {
    try {
      const model = models[resourceId];
      const {
        schema,
        fieldGroup,
      } = model;
      dispatch({
        type: FIND_ONE_REQUEST,
      });
      const res = await fetch.get(`/${resourceId}('${identifier}')`);
      dispatch({
        type: FIND_ONE_SUCCESS,
        payload: {
          resource: res.body,
          identifier,
          resourceId,
          fieldGroup,
          schema,
        },
      });
    } catch (error) {
      dispatch({
        type: FIND_ONE_ERROR,
      });
    }
  };
}

export function editResource({ field, value }) {
  return {
    type: EDIT_RESOURCE,
    payload: {
      field,
      updateValue: value,
    },
  };
}

export function updateResource({ resourceId, identifier, resource }) {
  return async dispatch => {
    try {
      dispatch({
        type: UPDATE_RESOURCE_REQUEST,
      });
      await fetch.patch(`/${resourceId}('${identifier}')`, {
        data: resource,
      });
      dispatch({
        type: UPDATE_RESOURCE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_RESOURCE_ERROR,
        payload: {
          error,
        },
      });
    }
  };
}

export function deleteResource({ resourceId, identifier }) {
  return async dispatch => {
    try {
      dispatch({
        type: UPDATE_RESOURCE_REQUEST,
      });
      await fetch.del(`/${resourceId}('${identifier}')`);
      dispatch({
        type: UPDATE_RESOURCE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_RESOURCE_ERROR,
        payload: {
          error,
        },
      });
    }
  };
}
