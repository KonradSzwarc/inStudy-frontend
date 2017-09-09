import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import without from 'lodash/without';
import indexOf from 'lodash/indexOf';
import pick from 'lodash/pick';
import keys from 'lodash/keys';
import validation from '../../js/validation';
import NewNumber from './NewNumber/NewNumber';
import ColorsDialog from '../../dialogs/ColorsDialog/ColorsDialog';
import { inputStyle } from '../../js/constants/styles';
import { EditDialog } from '../../js/globalStyles';
import { Container, StyledTextField, ElementsList, Card, Content, Title, Description, Icons, Icon, AddElement } from './NumbersDialog_styles';

export default class SocialsDialog extends Component {
  constructor(props) {
    super(props);
    const { _id, content, title, color } = this.props.data;
    this.state = {
      content: content || [],
      title: title || undefined,
      color: color || 2,
      dialog: false,
      dialogData: null,
      errors: {},
    };
    this.isEditModal = !!_id;
    this.validate = {
      title: { required: true },
      content: { noEmptyArr: true },
    };
  }

  componentWillMount() {
    const { closeDialog, data: { _id }, setModalFunctions } = this.props;
    const { submit, remove, openColorsDialog } = this;
    setModalFunctions(_id, submit, closeDialog, remove, openColorsDialog);
  }

  submit = () => {
    const validateValues = pick(this.state, keys(this.validate));
    validation(
      this.validate,
      validateValues,
      (errors) => { this.setState({ errors }); },
      () => {
        const values = pick(this.state, ['content', 'title', 'color']);
        console.log(values);
        this.props.closeDialog();
      },
    );
  }

  remove = () => {
    console.log('removed!');
  }

  closeDialog = () => {
    this.setState({ dialog: false, dialogData: null });
  }

  deleteElement = (el) => {
    const content = without(this.state.content, el);
    this.setState({ content });
  }

  changeList = (el, dialogData) => {
    let content;
    const actualContent = this.state.content;
    if (dialogData) {
      const index = indexOf(actualContent, dialogData);
      content = actualContent.map((item, i) => {
        if (i === index) item = el;
        return item;
      });
    } else {
      content = [...actualContent, el];
    }
    this.setState({ content });
  }

  openColorsDialog = () => {
    this.setState({ dialog: 'colors', dialogData: [this.state.color] });
  }

  renderElement = (el, index) => (
    <Card key={index}>
      <Content>
        <Title>{el.number}</Title>
        <Description>
          {`${el.description.length > 100
            ? `${el.description.substring(0, 100)} ...`
            : el.description}`}
        </Description>
      </Content>
      <Icons>
        <Icon
          className="fa fa-pencil-square-o"
          aria-hidden="true"
          onClick={() => { this.setState({ dialog: 'element', dialogData: el }); }}
        />
        <Icon
          className="fa fa-trash-o"
          aria-hidden="true"
          onClick={() => { this.deleteElement(el); }}
        />
      </Icons>
    </Card>
  );

  render() {
    const { closeDialog, open, sidebar } = this.props;
    const { dialog, dialogData } = this.state;
    const dialogAttrs = {
      sidebar,
      open: true,
      closeDialog: this.closeDialog,
      data: dialogData,
    };
    const actions = [
      <FlatButton
        label="Anuluj"
        onTouchTap={closeDialog}
      />,
      <FlatButton
        label="Zapisz zmiany"
        onTouchTap={this.submit}
        primary
      />,
    ];

    return (
      <EditDialog
        open={open}
        onRequestClose={closeDialog}
        actions={actions}
        title={this.isEditModal ? 'Edytuj moduł „Liczby”' : 'Dodaj moduł „Liczby”'}
        autoScrollBodyContent
        repositionOnUpdate={false}
        isSidebar={sidebar}
      >
        <Container>
          <StyledTextField
            value={this.state.title}
            onChange={(e) => { this.setState({ title: e.target.value }); }}
            floatingLabelText="Tytuł (nagłówek modułu)"
            errorText={this.state.errors.title}
            {...inputStyle}
          />
          <ElementsList>
            {this.state.content && this.state.content.map(this.renderElement)}
          </ElementsList>
          <AddElement onClick={() => { this.setState({ dialog: 'element' }); }}>
            + Dodaj nowy element
          </AddElement>
        </Container>
        {dialog === 'element' &&
          <NewNumber
            submit={(el) => { this.changeList(el, dialogData); }}
            {...dialogAttrs}
          />
        }
        {dialog === 'colors' &&
          <ColorsDialog
            submit={(colors) => { this.setState({ color: colors[0] }); }}
            names={['Kolor liczby']}
            mainColors={this.props.colors}
            {...dialogAttrs}
          />
        }
      </EditDialog>
    );
  }
}
