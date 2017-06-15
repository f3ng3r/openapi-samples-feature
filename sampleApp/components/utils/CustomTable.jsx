import React from 'react';
import { map, split, last, findIndex, forEach, isEmpty, isEqual, concat, isNull, isArray, isObject, forOwn} from 'lodash';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { flatten, noop } from 'flat';
import { bindHandlers } from 'react-bind-handlers';
import API from './API';
import refDataAPI from '../ref/refDataAPI';

class CustomTable extends React.Component {
  constructor() {
    super();
    this.data = [];
  }

  componentWillMount() {
    this.handleData(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.handleData(newProps)
  }

  handleData(props) {
    this.data = [];
    forEach(props.data, (object) => {
        this.data.push(object);
    });
  }

  handlePriceFormatter(cell, row, formatExtraData) {
    return API.formatPrice(cell, this.props.decimals || row[this.props.formatter]);
  }

  formatColumnData(cell, row, formatExtraData){
    switch(cell && cell.constructor.name) {
      //format cell data if cell is an Array
      case "Array" : {  
        if(!isObject(cell[0])) { //if cell is an array of values return enter separated values of array
          return cell.toString().replace(/,/g, '<br>');
        } 
        else{
          let keyValueArray = []; // if cell is an array of object, return enter separated value of keyValue pair of objects in array
          forEach(cell, (object) => {
            forOwn(object, (value,key) => {
              keyValueArray.push(key + ' : ' + value )
            });
            keyValueArray.push('<br>');
          })
          return keyValueArray.toString().replace(/,/g, '<br>');
        }
        break;
      }
      // format cell data if cell is an object
      case "Object" : { 
        let keyValueArray = [];
        forOwn(cell, (value, key) => {
          if(!isArray(value)) { //if cell is a simple object of key value, return key : value
            keyValueArray.push(key + ':' + value);
          } 
          else{
            let values = ''; // if cell is an object of Array, return key : [array values], eg for cell {Ask : [83.0,83.1]} return 'Ask : [ 83.0 83.1 ]'
            forEach(value, (val) => { values+=('  '+val) });
            keyValueArray.push(key + ': [' + values + ' ]');
          }
        });
        return keyValueArray.toString().replace(/,/g, '<br>');
        break; 
      }

      default : return cell;
    }
  }

  generateHeaders() {
    return map(this.data[0], (value, key) => {
      const dataSort = findIndex(this.props.dataSortFields, field => field === key) !== -1;
      const keyField = this.props.keyField === key;
      const hidden = findIndex(this.props.hidden, field => field === key) !== -1;
      const dataFormat = findIndex(this.props.priceFields, field => field === key) !== -1 ?  this.handlePriceFormatter : this.formatColumnData.bind(this);
      return (
        <TableHeaderColumn
          width={this.props.width}
          dataField={key}
          isKey={keyField}
          dataSort={dataSort}
          hidden={hidden}
          dataFormat={dataFormat}>
          {last(split(key, '.'))}
        </TableHeaderColumn>);
    });
  }

  render() {
    console.log("DATA",this.data);
    return (
      <div>
        {!isEmpty(this.data) && (<BootstrapTable data={this.data} striped condensed hover>
          {this.generateHeaders()}
        </BootstrapTable>)}
      </div>
    );
  }
}

CustomTable.propTypes = {
  keyField: React.PropTypes.string.isRequired,
  data: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]).isRequired,
  width: React.PropTypes.string,
  dataSortFields: React.PropTypes.array,
};

export default bindHandlers(CustomTable);
