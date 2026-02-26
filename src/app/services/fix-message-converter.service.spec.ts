import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Property } from '../models/fix-models';
import { FixMessageConverterService } from './fix-message-converter.service';

describe('FixMessageConverterService', () => {
  let service: FixMessageConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixMessageConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should properly convert parameters list to serialized payload 1', () => {
    const seriailizedPrams = service.convertParamsListToSerializedPayload([
      generateProperty(4, 'test'),
      generateProperty(5, 'test2'),
    ]);
    expect(seriailizedPrams).toEqual('4=test|5=test2|');
  });

  it('should properly convert parameters list to serialized payload 1', () => {
    const seriailizedPrams = service.convertParamsListToSerializedPayload([
      generateProperty(4, 'test test'),
      generateProperty(5, 'test2'),
    ]);
    expect(seriailizedPrams).toEqual('4=test test|5=test2|');
  });

  it('should properly convert templates to params list', () => {
    const paramsList = service.convertTemplateToParamsList(
      '4=test|49=ZIN73|5=test2|',
      'ZIN02',
      'ZIN70',
      true,
    );

    expect(paramsList[0].propertyKey).toEqual(4);
    expect(paramsList[0].propertyValue).toEqual('test');

    expect(paramsList[1].propertyKey).toEqual(49);
    expect(paramsList[1].propertyValue).toEqual('ZIN02');
  });

  it('should properly convert parameters list to key value pairs', () => {
    const seriailizedPrams = service.convertToKeyValuePair('4=test', 'ZIN02', 'ZIN70', true);
    expect(seriailizedPrams.propertyValue).toEqual('test');
  });

  it('should properly convert parameters list to key value pairs 2', () => {
    const seriailizedPrams = service.convertToKeyValuePair('4=test', 'ZIN02', 'ZIN70', true);

    expect(seriailizedPrams.propertyValue).toEqual('test');
  });

  // it('should properly convert parameters list to key value pairs and override default distributor', () => {
  //   const seriailizedPrams = service.convertToKeyValuePair('128=test', 'ZIN02', 'ZIN70', true);
  //   expect(seriailizedPrams.propertyValue).toEqual('ZIN70');
  // });

  it('should properly convert parameters list to key value pairs and override default provider', () => {
    const seriailizedPrams = service.convertToKeyValuePair('49=test', 'ZIN02', 'ZIN70', true);

    expect(seriailizedPrams.propertyValue).toEqual('ZIN02');
  });

  it('should properly convert parameters list to key value pairs with invalid result', () => {
    const seriailizedPrams = service.convertToKeyValuePair('115s=test', 'ZIN02', 'ZIN70', true);
    expect(seriailizedPrams.isTemplateKeyValid).toEqual(false);
  });

  it('should properly convert templates to params list', () => {
    const paramsList = service.convertTemplateToParamsList(
      '4=test|49=ZIN73|5=test2|',
      'ZIN02',
      'ZIN70',
      true,
    );

    expect(paramsList[0].propertyKey).toEqual(4);
    expect(paramsList[0].propertyValue).toEqual('test');

    expect(paramsList[1].propertyKey).toEqual(49);
    expect(paramsList[1].propertyValue).toEqual('ZIN02');
  });

  it('should properly convert parameters list to key value pairs', () => {
    const seriailizedPrams = service.convertToKeyValuePair('4=test', 'ZIN02', 'ZIN70', false);
    expect(seriailizedPrams.propertyValue).toEqual('test');
  });

  it('should properly convert parameters list to key value pairs 2', () => {
    const seriailizedPrams = service.convertToKeyValuePair('4=test', 'ZIN02', 'ZIN70', false);

    expect(seriailizedPrams.propertyValue).toEqual('test');
  });

  it('should properly convert parameters list to key value pairs and not override default distributor', () => {
    const seriailizedPrams = service.convertToKeyValuePair('128=test', 'ZIN02', 'ZIN70', false);
    expect(seriailizedPrams.propertyValue).toEqual('test');
  });

  it('should properly convert parameters list to key value pairs and override default provider', () => {
    const seriailizedPrams = service.convertToKeyValuePair('49=test', 'ZIN02', 'ZIN70', false);

    expect(seriailizedPrams.propertyValue).toEqual('ZIN70');
  });

  it('should properly convert parameters list to key value pairs with invalid result', () => {
    const seriailizedPrams = service.convertToKeyValuePair('115s=test', 'ZIN02', 'ZIN70', false);
    expect(seriailizedPrams.isTemplateKeyValid).toEqual(false);
  });

  it('should validate known fix field number', () => {
    const res = service.validateFixFieldNumber(8);
    expect(res[0].description).toEqual('MessageHeader');
  });

  it('should validate unknown fix field number', () => {
    const res = service.validateFixFieldNumber(10000);
    expect(res.length).toEqual(0);
  });

  it('should validate unknown fix field number', () => {
    const res = service.validateFixFieldNumber(0);
    expect(res.length).toEqual(0);
  });

  it('should validate unknown negative fix field number', () => {
    const res = service.validateFixFieldNumber(-4000);
    expect(res.length).toEqual(0);
  });

  // it('should properly convert template', () => {
  //   //service.connectionDetailsStore.updateSelectedDistributor('ZIN70');
  //   //service.connectionDetailsStore.updateSelectedProvider('ZIN02');
  //   const convertedTemplate = service.convertTemplateToParamsList2(
  //     '8=FIX.4.1|9=2365|35=U1|34=6|49=ZIN73|52=20190320',
  //     'ZIN70',
  //     'ZIN02',
  //     true,
  //   );

  //   //service.getMessageForEdit('MERR');
  //   expect(convertedTemplate[0].propertyKey).toEqual(8);
  // });
});

export function generateProperty(propertyKey = 0, propertyValue = ''): Property {
  return {
    propertyKey: propertyKey,
    propertyValue: propertyValue,
    isTemplateKeyValid: false,
    messages: [],
    rowId: Date.now(),
    description: '',
  };
}
