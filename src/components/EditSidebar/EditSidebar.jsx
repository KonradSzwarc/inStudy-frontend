import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ChangeTagsDialog from '../../dialogs/ChangeTagsDialog/ChangeTagsDialog';
import MainColorsDialog from '../../dialogs/MainColorsDialog/MainColorsDialog';
import ChangePasswordDialog from '../../dialogs/ChangePasswordDialog/ChangePasswordDialog';
import { getRandomInt } from '../../js/utils';
import accesibleModules from '../../js/constants/accesibleModules';
import { Container, ContainerArrow, Wrapper, Title, Modules, IconWrapper, SidebarIcon, BottomIcons, StyledReactTooltip, SpecialBtn, Icon, Filler, EditIconSet, ShadowTop, ShadowBottom } from './EditSidebar_styles';

export default class EditSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: null,
      shadows: {},
    };
  }

  changeOrder = () => {
    this.props.changeContent({ mode: 'Ustawienia' });
    this.props.changeOrder(this.props.modules);
  }

  closeDialog = () => {
    this.setState({ dialog: null });
  }

  handleScroll = (values) => {
    const shadows = {};

    if (values.clientHeight !== values.scrollHeight && this.props.sidebar) {
      shadows.top = (values.top !== 0);
      shadows.bottom = (values.top !== 1);
    }

    if (!isEqual(shadows, this.state.shadows)) {
      this.setState({ shadows });
    }
  }

  renderIcon = (module) => {
    const key = Date.now() + getRandomInt(1000, 9999);
    const IconComponent = (module.icon)
      ? module.icon // Add new module
      : accesibleModules.filter(m => (m.kind === module.kind))[0].icon; // Edit existing module
    const moduleData = (module.icon) ? {} : module;
    const handleClick = () => {
      this.props.openDialog(module.kind, moduleData);
      this.props.changeContent({ mode: (module.icon) ? 'Dodawanie modułu' : 'Edycja modułu', editingModule: IconComponent });
    };
    const dataTip = (module.icon) ? module.name : module.title;
    return (
      <IconWrapper key={key} data-tip={dataTip} onClick={handleClick}>
        <SidebarIcon>
          <IconComponent />
        </SidebarIcon>
        <StyledReactTooltip place="right" effect="solid" />
      </IconWrapper>
    );
  }

  renderModules = (mode) => {
    const { submit, cancel, remove, changeColors } = this.props.modalFunctions;
    const attrs = {
      onUpdate: this.handleScroll,
    };

    switch (mode) {
      case 'Moduły':
        return (
          <Modules {...attrs}>
            {this.state.shadows.top && <ShadowTop />}
            {this.props.modules.map(module => this.renderIcon(module))}
            {this.state.shadows.bottom && <ShadowBottom />}
          </Modules>
        );

      case 'Dodaj moduł':
        return (
          <Modules {...attrs}>
            {this.state.shadows.top && <ShadowTop />}
            {accesibleModules.map(module => this.renderIcon(module))}
            {this.state.shadows.bottom && <ShadowBottom />}
          </Modules>
        );
      case 'Edycja modułu':
        return (
          <Modules {...attrs}>
            <IconWrapper>
              <SidebarIcon>
                <this.props.editingModule />
              </SidebarIcon>
            </IconWrapper>
            <EditIconSet>
              <Icon className="fa fa-check" aria-hidden="true" onClick={submit} />
              <Icon className="fa fa-ban" aria-hidden="true" onClick={cancel} />
              <Icon className="fa fa-trash-o" aria-hidden="true" onClick={remove} />
            </EditIconSet>
            <EditIconSet>
              {changeColors &&
                <Icon className="fa fa-paint-brush" aria-hidden="true" onClick={changeColors} />
              }
            </EditIconSet>
          </Modules>
        );
      case 'Dodawanie modułu':
        return (
          <Modules {...attrs}>
            <IconWrapper>
              <SidebarIcon>
                <this.props.editingModule />
              </SidebarIcon>
            </IconWrapper>
            <EditIconSet>
              <Icon className="fa fa-check" aria-hidden="true" onClick={submit} />
              <Icon className="fa fa-ban" aria-hidden="true" onClick={cancel} />
            </EditIconSet>
            <EditIconSet>
              {changeColors &&
                <Icon className="fa fa-paint-brush" aria-hidden="true" onClick={changeColors} />
              }
            </EditIconSet>
          </Modules>
        );
      default: return null;
    }
  }

  renderSpecialBtn = (mode) => {
    switch (mode) {
      case 'Moduły':
        return (
          <div>
            <SpecialBtn className="fa fa-plus" aria-hidden="true" onClick={() => { this.props.changeContent({ mode: 'Dodaj moduł' }); }} />
          </div>
        );

      case 'Dodaj moduł':
        return (
          <div>
            <SpecialBtn className="fa fa-arrow-left" aria-hidden="true" onClick={() => { this.props.changeContent({ mode: 'Moduły' }); }} />
          </div>
        );

      case 'Ustawienia':
        return (
          <div>
            <SpecialBtn
              className="fa fa-arrow-left"
              aria-hidden="true"
              onClick={() => { this.props.changeContent({ mode: 'Moduły' }); this.props.closeDialog(); }}
            />
          </div>
        );
      default: return null;
    }
  }

  enterSettings = (dialogName) => {
    this.props.changeContent({ mode: 'Ustawienia' });
    this.setState({ dialog: dialogName });
  }

  render() {
    const { sidebar, toggleSidebar, modules, logout, colors, tags } = this.props;
    const { dialog } = this.state;
    const mode = this.props.mode;
    const arrowDirection = sidebar ? 'left' : 'right';

    return (
      <div>
        <Container open={sidebar}>
          <ContainerArrow onClick={toggleSidebar}>
            <i className={`fa fa-chevron-${arrowDirection}`} aria-hidden="true" />
          </ContainerArrow>
          <Wrapper>
            <Title>{mode}</Title>
            {this.renderModules(mode)}
            <BottomIcons>
              {this.renderSpecialBtn(mode)}
              <IconMenu
                iconButtonElement={<IconButton><Icon className="fa fa-cog" aria-hidden="true" /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              >
                {(modules.length > 1) &&
                  <MenuItem primaryText="Zmień kolejność modułów" onClick={this.changeOrder} />
                }
                <MenuItem primaryText="Edytuj tagi" onClick={() => { this.enterSettings('tags'); }} />
                <MenuItem primaryText="Edytuj kolory" onClick={() => { this.enterSettings('colors'); }} />
                <MenuItem primaryText="Zmień hasło" onClick={() => { this.enterSettings('password'); }} />
                <MenuItem primaryText="Wyloguj" onClick={logout} />
              </IconMenu>
            </BottomIcons>
          </Wrapper>
        </Container>
        <Filler open={sidebar} onClick={toggleSidebar} />
        {(dialog === 'colors') &&
          <MainColorsDialog
            sidebar={sidebar}
            closeDialog={this.closeDialog}
            data={colors}
          />
        }
        {(dialog === 'password') &&
          <ChangePasswordDialog
            sidebar={sidebar}
            closeDialog={this.closeDialog}
          />
        }
        {(dialog === 'tags') &&
          <ChangeTagsDialog
            sidebar={sidebar}
            closeDialog={this.closeDialog}
            data={tags}
          />
        }
      </div>
    );
  }
}
