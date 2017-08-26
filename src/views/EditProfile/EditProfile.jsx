import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import bindActionCreators from 'redux/lib/bindActionCreators';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import ProfileHeader from '../../modules/ProfileHeader/ProfileHeader';
import SimpleText from '../../modules/SimpleText/SimpleText';
import ProjectsTiles from '../../modules/ProjectsTiles/ProjectsTiles';
import IconText from '../../modules/IconText/IconText';
import Numbers from '../../modules/Numbers/Numbers';
import Collapsible from '../../modules/Collapsible/Collapsible';
import LinkImages from '../../modules/LinkImages/LinkImages';
import MembersTiles from '../../modules/MembersTiles/MembersTiles';
import EditSidebar from '../../components/EditSidebar/EditSidebar';
import CardEditDialog from '../../dialogs/CardEditDialog/CardEditDialog';
import SocialsDialog from '../../dialogs/SocialsDialog/SocialsDialog';
import { getActiveCircle } from '../../actions/circles';
import './editProfile.scss';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: null,
      dialogData: {},
      sidebar: true,
    };
  }

  componentWillMount() {
    this.props.getActiveCircle('knwd');
  }

  openDialog = (id, data) => {
    this.setState({ dialog: id, dialogData: data });
  }

  closeDialog = () => {
    this.setState({ dialog: null });
  }

  changeSocials = (values) => {
    console.log(values);
    this.closeDialog();
  }

  renderModule = (module, colors, index) => {
    let newComponent;
    switch (module.kind) {
      case 'SimpleText': newComponent = <SimpleText {...module} />; break;
      case 'ProjectsTiles': newComponent = <ProjectsTiles {...module} mainColors={colors} />; break;
      case 'IconText': newComponent = <IconText {...module} mainColors={colors} />; break;
      case 'Numbers': newComponent = <Numbers {...module} mainColors={colors} />; break;
      case 'Collapsible': newComponent = <Collapsible {...module} mainColors={colors} />; break;
      case 'MembersTiles': newComponent = <MembersTiles {...module} mainColors={colors} />; break;
      case 'LinkImages': newComponent = <LinkImages {...module} mainColors={colors} />; break;
      default: newComponent = null;
    }
    return (
      <div className="editProfile__wrapper" key={index}>
        {newComponent}
      </div>
    );
  }

  render() {
    console.log(this.props);
    if (this.props.activeCircle._id) {
      const header = omit(this.props.activeCircle, 'modules');
      const modules = pick(this.props.activeCircle, 'modules');

      return (
        <div className="editProfile__container">
          <div className="body__container">
            <ProfileHeader
              openDialog={this.openDialog}
              closeDialog={this.closeDialog}
              editable
              {...header}
            />
            {(modules.modules) &&
              modules.modules.map((module, index) => this.renderModule(module, header.colors, index))
            }
          </div>
          <EditSidebar sidebar={this.state.sidebar} toggleSidebar={() => { this.setState({ sidebar: !this.state.sidebar }); }} />
          <CardEditDialog
            closeDialog={this.closeDialog}
            open={this.state.dialog === 'card'}
            sidebar={this.state.sidebar}
            {...this.state.dialogData}
          />
          <SocialsDialog
            closeDialog={this.closeDialog}
            open={this.state.dialog === 'socials'}
            sidebar={this.state.sidebar}
            submitFunction={this.changeSocials}
            data={this.state.dialogData}
          />
        </div>
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
  return bindActionCreators({ getActiveCircle }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
