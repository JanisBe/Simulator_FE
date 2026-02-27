import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConfigService } from './config.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ConfigService', () => {
  let service: ConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request config', () => {
    service.requestConfig();
    service.mapConfig({
      stompWebSocketBaseurl: '',
      distributors: [
        {
          environmentName: 'TEST',
          avaliableDistributors: ['ZIN70', 'ZIN02', 'testSender'],
        },
        {
          environmentName: 'BETA',
          avaliableDistributors: ['ZIN70', 'ZIN02', 'testSender'],
        },
        {
          environmentName: 'SIT',
          avaliableDistributors: ['ZIN70', 'ZIN02', 'testSender'],
        },
        {
          environmentName: 'PROD',
          avaliableDistributors: ['ZIN70', 'ZIN02', 'testSender'],
        },
      ],
      providers: ['EMX'],
      environments: ['BETA', 'SIT', 'PROD'],
      tbkdTemplates: [
        {
          name: 'TBKDTemplate1',
          payload: '8=FIX.4.1|9=2365|35=U1|34=6|49=ZIN73|52=20190320',
        },
        {
          name: 'TBKDFinalTemplate',
          payload:
            '8=FIX.4.1|9=940|35=U2|49=PROV|56=EMX|34=1696|128=INTR|57=EMXSV|129=Bloggsj|52=20210423-08:12:48|9426=TBKD|11=ORDRREF1|9490=PROV|9400=123456|9488=INTR|9494=AGN1234|9401=1|9455=GBP|67=1|9442=OEIC|22=2|48=GB1234567890|54=1|152=5000|68=1|37=7654321|9428=20210423-08:12:48|9481=20210423-08:12:48|10=109|',
        },
      ],
      ecniTemplates: [
        {
          name: 'ECNIFinalTemplate1',
          payload:
            '8=FIX.4.1|9=1108|35=U7|49=PROV|56=EMX|34=2795|128=INTR|57=EMXSV|129=Bloggsj|52=20210423-14:21:45|9426=ECNI|11=ORDRREF1|9490=PROV|9521=INTR|9400=123456|9488=INTR|9494=AGN1234|9455=GBP|9442=OEIC|22=2|48=GB1234567890|9462=5|54=1|152=5000|12=0|9431=0|9458=0|9518=0|9456=11223344|60=20210423-09:00:00|9478=5000|9526=1|9430=S|15=GBP|9525=N|9432=0|9433=0|9434=0|9519=0|9527=1|37=7654321|9428=20210423-08:12:48|119=5000|63=3|64=20210428|10=198|',
        },
      ],
      merrTemplates: [
        {
          name: 'MERRFinalTemplate1',
          payload:
            '8=FIX.4.1|9=851|35=U4|49=PROV|56=EMX|34=1031|128=INTR|52=20210422-14:04:13|9426=MERR|9466=1347|9467=OINP|9472=ORDRREF2|9427=5999|58=canc as per email sent 22/04 @ 13:11|9481=20210422-14:04:13|10=222|',
        },
      ],
      oinpTemplates: [
        {
          name: 'OINPFinalTemplate1',
          payload:
            '8=FIX.4.1|9=0|35=U1|34=0|9426=OINP|52=20210423-07:49:41|128=PROV|115=INTR|116=Bloggsj|49=EMXSV|50=EMX UPLOAD|56=EMX|11=ORDRREF1|9490=PROV|9400=123456|9488=INTR|9494=AGN1234|9401=1|9455=GBP|67=1|9442=OEIC|22=4|48=GB1234567890|54=1|152=5000.00|68=1|10=0|9491=12345678|9481=20210423-07:49:41|',
        },
        {
          name: 'OINPTemplate2',
          payload: '8=FIX.4.1|9=2365|35=U1|34=6|49=ZIN73|52=20190320',
        },
        {
          name: 'OINPTemplate3',
          payload:
            '8=FIX.4.1|9=2693|35=U1|34=11|52=20190710-14:28:52|49=EMX|56=ZPR07|9426=OINP|115=ZPR07|128=ZPR07|11=FIX.2.FIX.001|1=Lobortis Quis, Pede.|9400=Et malesuada fames01|9444=Proin sed turpis nec mauris blandit matt|9488=ZIN70|9401=1|9494=Morbi sit amet massa|9455=EUR|9422=O|9490=ZPR07|67=1|9442=Product001|22=4|48=GBPROD001OO1|9449=Vivamus nibh dolor, nonummy ac, feugiat,|9416=C|9462=D|9443=2|54=1|9495=999999999.999999|9420=1234|121=N|9418=USD|9419=98.1234|9474=E|9471=98.1234|9475=N|68=1|9403=4|9404=I~ Monsieur~Albert Daniel Ferdinand~ Charpentier- Grosjean~ Ph.D. , D.Phil.|9405=N~ Pellentesque Tincidunt Incorporated|9406=C~ Felis Ullamcorper Viverra, Nunc Ullamcorper Corporation|9407=T~ Pede Cum Foundation~ Sydney M. Dunlap, Justin A. Terry, Elijah E. Mullen|9408=58 Vitae St.~Saint-Die-des-Vosges~Brussels~Hoofdstedelijk~Gewest~JG5 9HD~ZA|9409=P.O. Box 149, 2318 Natoque Avenue~Siquirres~Mazowieckie~Zl~TAS~73149-076~CZ|9410=Ap #549-5950 Justo St.~ Vienna Zonal~ Saint Martin~Zulum~ Vienna~ 149050~HK|9411=2597 Aenean Rd.~ Bishops Storts~ East Herts~Hertfordshire~ SE~ XI5N 3KI ~UK|9412=Ap #599-8681~Suspendisse Rd.~ Metairie~Bergen op Zoom~Hamburg NE~ 149050~CH|9423=N|9424=P.O. Box , 7149 Ullamcorper. St., Greenock, N9W 0S5, Bosnia and Herzegovina|9435=20150225|9436=AB123489Z|9413=N|9441=3|9437=Monsieur Remedios F. Walters|9438=372456211176231|9439=0816|9492=0715|9440=95|182=Rutrum Magna Bank~ Ap #599-8681~Suspendisse Rd.~ Asso~Leo CAM~SE~ 149050~NZ|183=AbC123|184=AbC123yZ9|185=Felis Ullamcorper Viverra|9415=MT09UVOB97891007069777030|9414=GBP|173=GB04QJLL57439881|174=BE49910622290304|9482=Per Conubia Bank~ POBox 202~1532 Ridiculus St.~ Veere~ Banchory~SE~ 4141~CZ|9483=aB19Yz|9484=GB77AC657|9489=Macaulay M. Watkins|9485=LB0358722425395159ZAPLGB4331ESHJKE511031|9417=USD|58=Lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque u|9425=20190312-10:48:29|9452=20190312-10:48:30',
        },
        {
          name: 'OINPWorkingFinalTermplate',
          payload:
            '8=FIX.4.1|9=0|35=U1|34=0|52=20250317-10:37:00|49=EMXSV|50=EMXWEB|56=EMX|115=EBFS2|116=TestUser|128=1U1C|9426=OINP|11=FS 17.03.03|9400=00054886|9488=EBFS2|9401=1|9494=C3552|9455=GBP|9490=1U1C|67=1|9442=MONEYMKT|22=4|48=XS1597534566|9462=5|9443=1|54=1|9495=100|68=1|10=0',
        },
      ],
      hints: [],
    });

    expect(service.oinpTemplates.length).toEqual(4);
    expect(service.merrTemplates.length).toEqual(1);
    expect(service.ecniTemplates.length).toEqual(1);
    expect(service.tbkdTemplates.length).toEqual(2);
    expect(service.tbkdTemplates[0].name).toEqual('TBKDTemplate1');
  });

  it('should request config with empty values', () => {
    service.requestConfig();

    //@ts-expect-error covering case when empty object is parsed
    service.mapConfig({});

    expect(service.oinpTemplates.length).toEqual(0);
    expect(service.merrTemplates.length).toEqual(0);
    expect(service.ecniTemplates.length).toEqual(0);
    expect(service.tbkdTemplates.length).toEqual(0);
  });
});
