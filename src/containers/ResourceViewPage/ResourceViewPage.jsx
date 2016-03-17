import React, { Component, PropTypes } from 'react';
import { setTitle } from 'lib/context';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  loadResource,
  editResource,
  updateResource,
  deleteResource,
} from 'reducers/viewer';
import {
  showLoading,
  hideLoading,
  showSnackbarMessage,
} from 'reducers/display';

import Divider from 'material-ui/lib/divider';
import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';
import Paper from 'material-ui/lib/paper';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ActionDelete from 'material-ui/lib/svg-icons/action/delete';
import ModeEdit from 'material-ui/lib/svg-icons/editor/mode-edit';

function mapStateToProps({ viewer }) {
  return {
    ...viewer,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadResource,
    editResource,
    updateResource,
    deleteResource,
    showLoading,
    hideLoading,
    showSnackbarMessage,
  }, dispatch);
}

class ResourceViewPage extends Component {
  static needs = [
    loadResource,
  ];

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    resource: PropTypes.object,
    isRequesting: PropTypes.bool,
    isLoaded: PropTypes.bool,
    resourceId: PropTypes.string,
    identifier: PropTypes.string,
    loadResource: PropTypes.func,
    editResource: PropTypes.func,
    updateResource: PropTypes.func,
    deleteResource: PropTypes.func,
    params: PropTypes.object,
    schema: PropTypes.object,
    fieldGroup: PropTypes.array,
    showLoading: PropTypes.func,
    hideLoading: PropTypes.func,
    showSnackbarMessage: PropTypes.func,
  };

  constructor() {
    super();
    this.renderField = this.renderField.bind(this);
    this.renderGroup = this.renderGroup.bind(this);
    this.handleClickModeEdit = this.handleClickModeEdit.bind(this);
    this.handleClickActionDelete = this.handleClickActionDelete.bind(this);
    this.handleChangeInputBound = {};
    this.handleToggleSwitchBound = {};
  }

  componentWillMount() {
    setTitle('CloudBread Inspector');
  }

  async componentDidMount() {
    const { resourceId, identifier } = this.props.params;
    this.props.showLoading();
    await this.props.loadResource({
      resourceId,
      identifier,
    });
    this.props.hideLoading();
    const { schema } = this.props;
    for (const key in schema) { // eslint-disable-line
      const field = schema[key];
      if (field.boolean) {
        this.handleToggleSwitchBound[field.name] = this.handleToggleSwitch(field.name);
      } else {
        this.handleChangeInputBound[field.name] = this.handleChangeInput(field.name);
      }
    }
    this.forceUpdate();
  }

  render() {
    const {
      fieldGroup,
      isLoaded,
      identifier,
      resourceId,
    } = this.props;
    if (!isLoaded) {
      return <p>Loading target resource...</p>;
    }
    return (
      <div>
        <div
          style={{
            maxWidth: '640px',
          }}
        >
          <div
            style={{
              marginBottom: '20px',
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                margin: '6px 0',
                fontWeight: 400,
              }}
            >
              {identifier} of {resourceId}
            </h1>
            <Divider />
          </div>
          {fieldGroup.map(this.renderGroup)}
        </div>
        <FloatingActionButton
          secondary
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '94px',
          }}
          onClick={this.handleClickModeEdit}
        >
          <ModeEdit />
        </FloatingActionButton>
        <FloatingActionButton
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
          }}
          onClick={this.handleClickActionDelete}
        >
          <ActionDelete />
        </FloatingActionButton>
      </div>
    );
  }

  renderGroup(group, key) {
    const { fields, name, description } = group;
    return (
      <Paper
        key={key}
        style={{
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            margin: '0px',
            fontWeight: 400,
            fontSize: '24px',
          }}
        >
          {name}
        </h1>
        <p>{description}</p>
        {fields.map(this.renderField)}
      </Paper>
    );
  }

  renderField(name, key) {
    const { resource, isRequesting, schema } = this.props;
    const field = schema[name];
    let result;
    if (field.boolean) {
      result = (
        <div>
          <div
            style={{
              maxWidth: '240px',
            }}
          >
            <Toggle
              defaultToggled={resource[field.name] === 'Y'}
              label={field.name}
              labelPosition="left"
              disabled={field.readonly || isRequesting}
              onToggle={this.handleToggleSwitchBound[field.name]}
            />
          </div>
        </div>
      );
    } else {
      result = (
        <TextField
          ref={field.name}
          floatingLabelText={field.name}
          hintText={field.description}
          defaultValue={resource[name]}
          disabled={field.readonly || isRequesting}
          onBlur={this.handleChangeInputBound[field.name]}
          fullWidth
        />
      );
    }
    return (
      <div
        key={key}
      >
        {result}
      </div>
    );
  }

  async handleClickModeEdit() {
    this.props.showLoading();
    try {
      const params = this.props.params;
      const resource = this.props.resource;
      const { identifier, resourceId } = params;
      await this.props.updateResource({
        resource,
        identifier,
        resourceId,
      });
      this.props.showSnackbarMessage({
        snackbarMessage: 'Succeed to update',
      });
    } catch (error) {
      this.props.showSnackbarMessage({
        snackbarMessage: 'Failed to update',
      });
    }
    this.props.hideLoading();
  }

  async handleClickActionDelete() {
    this.props.showLoading();
    try {
      const params = this.props.params;
      const { identifier, resourceId } = params;
      await this.props.deleteResource({
        identifier,
        resourceId,
      });
      this.props.showSnackbarMessage({
        snackbarMessage: 'Succeed to delete',
      });
      this.context.router.goBack();
    } catch (error) {
      this.props.showSnackbarMessage({
        snackbarMessage: 'Failed to delete',
      });
    }
    this.props.hideLoading();
  }

  handleChangeInput(field) {
    return (event) => {
      this.props.editResource({
        field,
        value: event.target.value,
      });
    };
  }

  handleToggleSwitch(field) {
    return () => {
      const resource = this.props.resource;
      this.props.editResource({
        field,
        value: resource[field] === 'Y' ? 'N' : 'Y',
      });
    };
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceViewPage);
