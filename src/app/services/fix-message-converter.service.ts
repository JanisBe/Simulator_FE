import { Injectable } from '@angular/core';
import { FixFieldKey, Property } from '../models/fix-models';
import { commonFixMessageFields } from '../models/fix-fields';

@Injectable({
  providedIn: 'root',
})
export class FixMessageConverterService {
  private mandatoryFields = ['128', '115'];

  validateFixFieldNumber(field: number): FixFieldKey[] {
    if (!field) {
      return [];
    }

    const description = this.getFixDescriptionFromMessageKey(field);
    if (!description) {
      return [];
    }

    return [{ id: field, description: description }];
  }

  convertParamsListToSerializedPayload(properties: Property[]): string {
    return properties.map(prop => prop.propertyKey + '=' + prop.propertyValue).join('|') + '|';
  }

  convertTemplateToParamsList(
    template: string,
    selectedDistributor: string,
    selectedProvider: string,
    overrideMessage: boolean,
    separator = '|',
  ): Property[] {
    return this.formatTemplateForSplitting(template)
      .split(separator)
      .map(property =>
        this.convertToKeyValuePair(
          property,
          selectedDistributor,
          selectedProvider,
          overrideMessage,
        ),
      );
  }

  convertToKeyValuePair(
    property: string,
    selectedDistributor: string,
    selectedProvider: string,
    isOINP: boolean,
  ): Property {
    const splittedProperty = property.split('=');
    const fixMessageKey = splittedProperty[0];
    let propertyValue = splittedProperty[1];
    let isTemplateKeyValid = true;
    const messages = [];

    if (!this.hasOnlyNumbers(fixMessageKey)) {
      messages.push('Message key must be integer number.');
      isTemplateKeyValid = false;
    }

    if (fixMessageKey === '56') {
      messages.push('value from this field is hardcoded to EMX.');
      propertyValue = 'EMX';
    }

    // 49 = sendersCompanyId
    if (fixMessageKey === '49') {
      const value = isOINP ? (selectedDistributor ?? '') : (selectedProvider ?? '');
      if (value) {
        propertyValue = value;
        messages.push(
          `value is overriden by value from ${isOINP ? 'distributor' : 'provider'} field`,
        );
      }
    }
    //previous it wasset only to oinp
    // if (fixMessageKey === '128' || fixMessageKey === '9490') {
    //     messages.push('value from this field should be equal as provider value.');
    //     propertyValue = selectedProvider;
    //   }

    //handle 128 delivertocompid

    //
    // if (fixMessageKey === '128' || fixMessageKey === '9490') {
    //   if (isOINP) {
    //     messages.push('value from this field should be equal as provider value.');
    //     propertyValue = selectedProvider ?? '';
    //   }
    //   // else {
    //   //   messages.push('value from this field should be equal as distributor value.');
    //   //   propertyValue = selectedDistributor ?? '';
    //   // }
    // }

    //

    return {
      propertyKey: parseInt(fixMessageKey),
      propertyValue: propertyValue,
      rowId: this.generateNumericID(),
      description: commonFixMessageFields.get(parseInt(fixMessageKey)) ?? '',
      messages: messages,
      isTemplateKeyValid: isTemplateKeyValid,
    };
  }

  formatTemplateForSplitting(template: string) {
    if (template.slice(-1) === '|') {
      return template.slice(0, -1);
    }

    return template;
  }

  getFixDescriptionFromMessageKey(key: number) {
    return commonFixMessageFields.get(key) ?? '';
  }

  generateNumericID() {
    const timestamp = Date.now();
    // @ts-expect-error depends on the browser can be msCrypto
    const crypto = window.crypto || window.msCrypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomNum = array[0] % 1e6;
    return timestamp * 1e6 + randomNum;
  }

  private hasOnlyNumbers(str: string) {
    if (!str) {
      return false;
    }
    // eslint-disable-next-line
    for (let i = 0; i < str.length; i++) {
      if (isNaN(Number(str[i])) || str[i] === ' ') {
        return false;
      }
    }
    return true;
  }
}
