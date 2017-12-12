import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';
import * as ons from 'onsenui';

@Injectable()
export class DashboardDataUtilsService {

  constructor(private log: Logger) { }

  /**
   * Getting Number with fixed decimal and comma seperated.
   */
  getNumberWithFixedDecimalAndComma(number: number) {
    try {
      return this.getNumberWithComma(number.toFixed(3));
    } catch (e) {
      this.log.error('Error while converting number to decimal points.', e);
      return number;
    }
  }

  /** Getting number with comma separated. */
  getNumberWithComma(number: any) {
    try {
      let parts = number.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    } catch (e) {
      this.log.error('Error while trancating decimal number to specific digit.', e);
      return number;
    }
  }

  /*Method used to get the valid graph name for the use of aggregate data */
  getValidGraphNameForAgg(graphName: string, seprator: string) {
    try {
      if (graphName.indexOf('>') > -1) {
        let arrGraphNameLevel = graphName.split('>');
        return arrGraphNameLevel[arrGraphNameLevel.length - 1];
      }
      return graphName;
    } catch (error) {
      this.log.error('Error in getting Aggregrate Name', error);
    }
  }

  /*This method is mainly used for Meter and Dial chart.
  * It returns the value without comma, as Dial and Meter chart
  * automatically applies the comma.
  */
  getValueWithoutDecimal(value, uptoDecimal) {
    try {
      let aDigits = value.toFixed(uptoDecimal).split('.');
      if (aDigits[0] <= 10) {
        return value.toFixed(uptoDecimal);
      } else {
        return aDigits[0];
      }
    } catch (e) {
      console.error(e);
    }
  }

  /*Method used to get Unique Names in Graph To Display.*/
  getUniqueNamesOfGraphsToDisplay(arrGraphNameList, vectorSeperator) {
    try {
      if (arrGraphNameList === null || arrGraphNameList.length <= 1) {
        return arrGraphNameList;
      }
      let maxGraphTokenLength = 1;
      /*2D array for graph token column wise.*/
      let unqueGraphNameArray = new Array(arrGraphNameList.length);
      /*Array to storing if graphName is available with vector list.*/
      let vectorWithGraphNames = new Array();

      /*Step 1 - Find all Tokens column wise.*/
      /*Separting All Graph Name level by level and storing in 2D array.*/
      /*
       G1 - T1>S1>I1
       G2 - T2>S1>I1
       Stores Like -->
       [[G1, T1, S1, I1], [G2, T2, S1, I1]]
       */
      for (let i = 0; i < arrGraphNameList.length; i++) {
        /*Checking for Vector with Graph Names.*/
        /*Note(Case: 111) - This Case may be failed if vector also contain '-' special charecter. Need to handle.*/
        /*Need to keep this state for merging tokens as it is.*/
        if (arrGraphNameList[i].indexOf('-') > 0) {
          vectorWithGraphNames.push(true);
        } else {
          vectorWithGraphNames.push(false);
        }
        unqueGraphNameArray[i] = this.getTokenizeStringArray(arrGraphNameList[i], vectorSeperator);

        /*Finding Maximum Length String by Token.*/
        if (maxGraphTokenLength < unqueGraphNameArray[i].length) {
          maxGraphTokenLength = unqueGraphNameArray[i].length;
        }
      }

      /*Checking if only one level graphs are available.*/
      if (maxGraphTokenLength === 1) {
        console.warn('Maximum columns are 1. No Need to filter.');
        return arrGraphNameList;
      }

      /*Getting Column with Sample Values.*/
      let sameValuesCols = new Array();

      /*Step 2: check columns with same values.*/
      /*Checking and Filtering Elements of 2D array column Wise (Till Max Column Size).*/
      for (let i = 0; i < maxGraphTokenLength; i++) {
        if (this.checkArrayColumnWithSameValues(i, unqueGraphNameArray)) {
          sameValuesCols.push(i);
        }
      }

      let arrayWithUniqueGraphName = new Array();
      /*Merge graph token skipping same value column tokens.*/
      for (let i = 0; i < unqueGraphNameArray.length; i++) {
        let graphName = this.combineAndSkipGraphTokens(unqueGraphNameArray[i], sameValuesCols, vectorSeperator, vectorWithGraphNames[i]);
        if (graphName === null || graphName === '') {
          arrayWithUniqueGraphName.push(arrGraphNameList[i]);
        } else {
          arrayWithUniqueGraphName.push(graphName);
        }
      }
      return arrayWithUniqueGraphName;
    } catch (e) {
      console.error(e);
      return arrGraphNameList;
    }
  }

  /**
   * Method checks if columns all values are same in 2D array.
   */
  checkArrayColumnWithSameValues(column, twoDArray) {
    try {
      let value = '';
      for (let i = 0; i < twoDArray.length; i++) {
        let innerArr = twoDArray[i];

        /*If column length mismatched then leaving it as it is.- Need to check case.*/
        if (column >= innerArr.length) {
          continue;
        }

        /*First Time value not available. - Need to check if array has single value.*/
        if (value === '') {
          value = innerArr[column];
          continue;
        }
        /*If value mismatched. return false as columns values are not matched.*/
        if (value !== innerArr[column]) {
          return false;
        }
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /** Function is used to concat array as string, skipping passed index.
   */
  combineAndSkipGraphTokens(arrTokens, arrSkipCols, vectorSeperator, isGraphNameAvailable) {
    try {
      let graphName = '';
      let isGraphNameAdded = false;
      for (let i = 0; i < arrTokens.length; i++) {
        /*If cols exist in skip list. tnen igonring it.*/
        if (arrSkipCols.indexOf(i) < 0) {
          if (graphName === '') {
            graphName = arrTokens[i];
          } else {
            if (arrSkipCols.indexOf(0) < 0 && !isGraphNameAdded && isGraphNameAvailable) {
              graphName = graphName + '-' + arrTokens[i];
              isGraphNameAdded = true;
            } else {
              graphName = graphName + vectorSeperator + arrTokens[i];
            }
          }
        }
      }
      return graphName;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /** Function Token graph Name and vector by vector seperator.
 */
  getTokenizeStringArray(graphName, tokenizer) {
    let tokenArray = new Array();
    try {
      let splitByGraphName = graphName.split('-');

      /*Checking for Graph with vector.*/
      if (splitByGraphName.length > 1) {
        tokenArray.push(splitByGraphName[0].trim());
        if (splitByGraphName.length > 2) {
          let tempVector = '';
          for (let vectorIdx = 1; vectorIdx < splitByGraphName.length; vectorIdx++) {
            if (tempVector !== '') {
              tempVector = tempVector + '-';
            }
            /*To add - separator in vector only if it is not blank.*/
            tempVector = tempVector + splitByGraphName[vectorIdx].trim();
          }
          graphName = tempVector;
        } else {
          graphName = splitByGraphName[1].trim();
        }
      }

      let vectorArr = graphName.split(tokenizer);

      if (vectorArr === null || vectorArr.length === 0) {
        return tokenArray;
      }
      for (let i = 0; i < vectorArr.length; i++) {
        if (vectorArr[i].trim() === 'Others') {
          continue;
        }
        tokenArray.push(vectorArr[i].trim());
      }
    } catch (e) {
      console.log(e);
      console.error(e);
    }
    return tokenArray;
  }

  /**
   * Getting Number with fixed decimal and comma seperated with greater than 10 condtion.
   */
  getNumberWithPrecisionAndComma(number: number) {
    try {

      if (number < 10) {
        return number.toFixed(3);
      } else {
        return this.getNumberWithComma(number.toFixed(0));
      }
    } catch (e) {
      this.log.error('Error while converting number to decimal points.', e);
      return number;
    }
  }

  /* returns the color and image for all three status in health widget type */
  getHealthWidgetInfo = function (status) {
    this.log.debug('status = ' + status);
    try {
      if (status === 'Critical') {
        return this.critical;
      } else if (status === 'Major') {
        return this.major;
      } else if (status === 'Normal') {
        return this.normal;
      } else {
        return [];
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  showNotification(message: String) {
      ons.notification.toast(message, {timeout: 2000});
  }

}
