import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Nav from '../../components/Nav/Nav';
import './index.scss';
import '../../js/font_awesome/brands.min';
import '../../js/font_awesome/regular.min';
import '../../js/font_awesome/fontawesome';

class Index extends Component {
  render() {
    const bodyMargin = (this.props.location.pathname !== '/' && this.props.location.pathname !== '/rejestracja' && this.props.location.pathname !== '/logowanie' && this.props.location.pathname !== '/odzyskiwanie_hasla')
      ? { marginTop: 60, minHeight: 'calc(100vh - 60px)' }
      : { minHeight: '100vh' };

    return (
      <div className="index__container">
        <Nav />
        <div className="index__body" style={bodyMargin}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withRouter(Index);
