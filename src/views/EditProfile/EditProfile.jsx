import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import bindActionCreators from 'redux/lib/bindActionCreators';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import accessibleModules from '../../js/constants/accesibleModules';
import ProfileHeader from '../../modules/ProfileHeader/ProfileHeader';
import EditSidebar from '../../components/EditSidebar/EditSidebar';
import CardEditDialog from '../../dialogs/CardEditDialog/CardEditDialog';
import SocialsDialog from '../../dialogs/SocialsDialog/SocialsDialog';
import ImageDialog from '../../dialogs/ImageDialog/ImageDialog';
import ReorderDialog from '../../dialogs/ReorderDialog/ReorderDialog';
import { getActiveCircle, changeLogo } from '../../actions/circles';
import { MainContainer } from '../../js/globalStyles';
import { Container, Wrapper } from './EditProfile_styles';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: null,
      dialogData: {},
      sidebar: true,
      mode: 'Moduły', // Moduły, Dodaj moduł, Edycja modułu, Dodawanie modułu
      editingModule: null,
      modalFunctions: {
        submit: null,
        cancel: null,
        remove: null,
        changeColors: null,
      },
    };
  }

  componentWillMount() {
    this.props.getActiveCircle();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.header) {
      this.setState({
        header: omit(nextProps.activeCircle, ['modules']),
        modules: pick(nextProps.activeCircle, ['modules']).modules,
      });
    }
  }

  setModalFunctions = (id, submit, cancel, remove, changeColors) => {
    remove = id && remove;
    this.setState({ modalFunctions: { submit, cancel, remove, changeColors } });
  }

  openDialog = (name, data) => {
    this.setState({ dialog: name, dialogData: data });
  }

  closeDialog = () => {
    const mode = this.state.mode === 'Dodawanie modułu' ? 'Dodaj moduł' : 'Moduły';
    this.setState({
      dialog: null,
      editingModule: null,
      mode,
      modalFunctions: {
        submit: null,
        cancel: null,
        remove: null,
        changeColors: null,
      },
    });
  }

  changeSocials = (value) => {
    this.closeDialog();
  }

  changeLogo = (value) => {
    console.log(value);
    this.props.changeLogo(value);
    this.closeDialog();
  }

  changeBackground = (value) => {
    console.log(value);
    this.closeDialog();
  }

  reorderModules = (values) => {
    this.setState({ modules: values });
  }

  renderModule = (module, colors) => {
    const ModuleComponent = accessibleModules.find(el => el.kind === module.kind).component;
    return (
      <Wrapper key={module._id}>
        <ModuleComponent {...module} mainColors={colors} />
      </Wrapper>
    );
  }

  renderDialog = (dialog, data) => {
    let DialogComponent = accessibleModules.find(el => el.kind === dialog);
    if (DialogComponent) {
      DialogComponent = DialogComponent.dialog;
      return <DialogComponent kind={dialog} {...data} />;
    }
    return null;
  }

  render() {
    if (this.props.activeCircle._id) {
      const { dialog, sidebar, mode, dialogData, modalFunctions, editingModule, header, modules } = this.state;
      const { activeCircle } = this.props;
      const EditSidebarData = { sidebar, mode, editingModule, modalFunctions };
      const moduleData = {
        sidebar,
        open: true,
        closeDialog: this.closeDialog,
        data: dialogData,
        setModalFunctions: this.setModalFunctions,
        colors: this.props.activeCircle.colors,
      };

      return (
        <Container>
          <EditSidebar
            openDialog={this.openDialog}
            changeContent={(state) => { this.setState(state); }}
            toggleSidebar={() => { this.setState({ sidebar: !sidebar }); }}
            changeOrder={(toReorder) => { this.openDialog('reorder', toReorder); }}
            {...EditSidebarData}
            {...activeCircle}
          />
          <MainContainer>
            <ProfileHeader
              openDialog={this.openDialog}
              closeDialog={this.closeDialog}
              editable
              {...header}
            />
            {(modules) &&
              modules.map((module, index) =>
                this.renderModule(module, header.colors, index))
            }
          </MainContainer>
          {(dialog === 'card') &&
          <CardEditDialog
            fetchCircle={this.props.getActiveCircle}
            {...dialogData}
            {...moduleData}
          />
          }
          {dialog === 'socials' && <SocialsDialog submitFunction={this.changeSocials} {...moduleData} />}
          {dialog === 'logo' &&
            <ImageDialog
              submitFunction={this.changeLogo}
              width={310}
              height={310}
              maxSize={100000}
              title="Edytuj logo"
              {...moduleData}
            />
          }
          {dialog === 'background' &&
            <ImageDialog
              submitFunction={this.changeBackground}
              width={1920}
              height={540}
              maxSize={200000}
              title="Edytuj zdjęcie w tle"
              {...moduleData}
            />
          }
          {dialog === 'reorder' &&
            <ReorderDialog
              submitFunction={this.reorderModules}
              closeDialog={this.closeDialog}
              title="Zmień kolejność modułów"
              data={modules}
              displayBy="title"
              sidebar
            />
          }
          {(dialog) && this.renderDialog(dialog, moduleData)}
        </Container>
      );
    }
    return null;
  }
}

function mapStateToProps(state) {
  return {
    activeCircle: state.activeCircle,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getActiveCircle, changeLogo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
