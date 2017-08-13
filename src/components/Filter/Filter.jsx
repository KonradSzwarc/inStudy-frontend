import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { updateFilter } from '../../actions/filters';
import './filter.scss';

class Filter extends Component {
  render() {
    const { label, items } = this.props;
    const filterValue = this.props.filters[this.props.id];

    return (
      <SelectField
        floatingLabelText={label}
        floatingLabelStyle={(filterValue && filterValue.length > 0)
          ? { fontWeight: '500', color: '#303F9F' }
          : null
        }
        onChange={(event, index, value) => { this.props.updateFilter(this.props.id, value); }}
        value={filterValue}
        multiple
        style={{ minWidth: 200, margin: '0 20px 20px' }}
        underlineStyle={(filterValue && filterValue.length > 0)
          ? { borderBottomWidth: '2px', borderBottomColor: '#303F9F' }
          : { borderBottomWidth: '1px', borderBottomColor: '#bbbbbb' }
        }
      >
        {items.map(item => <MenuItem key={item.id} value={item.id} primaryText={item.text} />)}
      </SelectField>
    );
  }
}

function mapStateToProps(state) {
  return {
    filters: state.filters,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateFilter }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
