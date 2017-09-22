import React, { Component } from 'react';
import without from 'lodash/without';
import indexOf from 'lodash/indexOf';
import validate from '../../utils/validation';
import accessibleModules from '../../utils/constants/accesibleModules';
import AddIconText from './AddIconText/AddIconText';
import ColorsDialog from '../../dialogs/ColorsDialog/ColorsDialog';
import ReorderDialog from '../../dialogs/ReorderDialog/ReorderDialog';
import { renderActionButtons, renderTextField } from '../../utils/renderHelpers';
import { EditDialog } from '../../utils/globalStyles';
import { Container, ElementsList, Card, Content, Title, Description, Icons, Icon, AddElement, IconImageWrapper, IconImage } from './IconTextDialog_styles';

export default class IconTextDialog extends Component {
  constructor(props) {
    super(props);
    const { id, content, title, color } = this.props.data;
    this.state = {
      content: content || [],
      title: title || undefined,
      color: color || 2,
      dialog: false,
      dialogData: null,
      errors: {},
    };
    this.isEditModal = !!id;
    this.moduleName = accessibleModules.find(m => m.kind === 'IconText').name;
    this.toValidate = {
      title: { required: true },
      content: { noEmptyArr: true },
    };
    this.values = ['content', 'title', 'color'];
    this.actions = renderActionButtons(this.props.closeDialog, this.handleSubmit);
  }

  componentWillMount() {
    const { closeDialog, data: { id }, setModalFunctions } = this.props;
    const { handleSubmit, remove, openColorsDialog, openReorderDialog } = this;
    setModalFunctions(id, handleSubmit, closeDialog, remove, openColorsDialog, openReorderDialog);
  }

  handleSubmit = () => { validate(this, this.submit); }

  submit = (values) => {
    const { data, kind, submit } = this.props;
    const id = data.id ? { id: data.id } : {};
    const extendValues = { ...values, ...id, kind };
    submit(extendValues);
  }

  remove = () => {
    this.props.remove(this.props.data.id);
    this.props.closeDialog();
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

  openReorderDialog = () => {
    this.setState({ dialog: 'reorder', dialogData: this.state.content });
  }

  reorderIconText = (values) => {
    this.setState({ content: values }, () => { this.closeDialog(); });
  }

  renderElement = (el, index) => (
    <Card key={index}>
      <IconImageWrapper>
        <IconImage className={`fa fa-${el.icon}`} aria-hidden="true" />
      </IconImageWrapper>
      <Content>
        <Title>{el.title}</Title>
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
    const { closeDialog, open, sidebar, colors } = this.props;
    const { dialog, dialogData, content } = this.state;
    const dialogAttrs = {
      sidebar,
      open: true,
      closeDialog: this.closeDialog,
      data: dialogData,
    };

    return (
      <EditDialog
        open={open}
        onRequestClose={closeDialog}
        actions={this.actions}
        title={`${this.isEditModal ? 'Edytuj' : 'Dodaj'} moduł „${this.moduleName}”`}
        autoScrollBodyContent
        repositionOnUpdate={false}
        isSidebar={sidebar}
      >
        <Container>
          {renderTextField(this, 'Tytuł (nagłówek modułu)', 'title')}
          <ElementsList>
            {content && content.map(this.renderElement)}
          </ElementsList>
          <AddElement onClick={() => { this.setState({ dialog: 'element' }); }}>
            + Dodaj nowy element
          </AddElement>
        </Container>
        {dialog === 'element' &&
          <AddIconText
            submit={(el) => { this.changeList(el, dialogData); }}
            {...dialogAttrs}
          />
        }
        {dialog === 'colors' &&
          <ColorsDialog
            submit={(newColors) => { this.setState({ color: newColors[0] }); }}
            names={['Kolor ikony']}
            mainColors={colors}
            {...dialogAttrs}
          />
        }
        {dialog === 'reorder' &&
          <ReorderDialog
            {...dialogAttrs}
            submitFunction={this.reorderIconText}
            title="Zmień kolejność kolumn"
            displayBy="title"
          />
        }
      </EditDialog>
    );
  }
}
