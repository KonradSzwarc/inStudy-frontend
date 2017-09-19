import React, { Component } from 'react';
import validate from '../../../js/validation';
import { renderActionButtons, renderTextField } from '../../../js/renderHelpers';
import { EditDialog } from '../../../js/globalStyles';
import { Container } from './AddCollapsible_styles';

export default class SocialsDialog extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      title: data ? data.title : undefined,
      description: data ? data.description : undefined,
      errors: {},
    };
    this.toValidate = {
      title: { required: true },
      description: { required: true },
    };
    this.values = ['title', 'description'];
    this.actions = renderActionButtons(this.props.closeDialog, this.handleSubmit);
  }

  handleSubmit = () => { validate(this, this.submit); }

  submit = (values) => {
    this.props.submit(values);
    this.props.closeDialog();
  }

  render() {
    const { closeDialog, open, sidebar, data } = this.props;
    const multilineAttrs = {
      multiLine: true,
      rows: 3,
    };
    const dialogTitle = data ? 'Edytuj element listy' : 'Dodaj element listy';

    return (
      <EditDialog
        open={open}
        onRequestClose={closeDialog}
        actions={this.actions}
        title={dialogTitle}
        autoScrollBodyContent
        repositionOnUpdate={false}
        isSidebar={sidebar}
      >
        <Container>
          {renderTextField(this, 'Nagłówek', 'title')}
          {renderTextField(this, 'Treść', 'description', true, multilineAttrs)}
        </Container>
      </EditDialog>
    );
  }
}
