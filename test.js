import { Selector } from 'testcafe';
import {
  checkLiquidErrors,
  getResultElement,
  getResultText,
  getBtAlertElement,
  getBtAlertText,
  getPerformanceMetrics
} from './index';

const url = 'https://examples.staging.oregon.platform-os.com/multilanguage';
const forceAlertsQuery =
  'flash[notice]=Flash%20notice&flash[error]=Flash%20error&flash[alert]=Flash%20alert&flash[info]=Flash%20info';

fixture('Test helpers').page(url);

test('checkLiquidErrors', async t => {
  await checkLiquidErrors({ t, Selector });
});

test('getResultElement', async t => {
  const resultElement = await getResultElement({ name: 1, Selector });
  const attr = resultElement.getAttribute('data-result');

  await t.expect(attr).eql('1');
});

test('getResultText', async t => {
  const resultText = await getResultText({ name: 1, Selector });

  await t.expect(resultText).contains('Hello world');
});

test('getBtAlertElement', async t => {
  await t.navigateTo(`${url}?${forceAlertsQuery}`);

  const dangerElement = await getBtAlertElement({ type: 'danger', Selector });
  const warningElement = await getBtAlertElement({ type: 'warning', Selector });
  const successElement = await getBtAlertElement({ type: 'success', Selector });
  const infoElement = await getBtAlertElement({ type: 'info', Selector });
  const noTypeElement = await getBtAlertElement({ type: 'success', Selector });

  const dangerText = await dangerElement.innerText;
  const warningText = await warningElement.innerText;
  const successText = await successElement.innerText;
  const infoText = await infoElement.innerText;
  const noTypeText = await noTypeElement.innerText;

  await t.expect(dangerText).contains('Flash error');
  await t.expect(warningText).contains('Flash alert');
  await t.expect(successText).contains('Flash notice');
  await t.expect(infoText).contains('Flash info');
  await t.expect(noTypeText).contains('Flash notice');
});

test('getBtAlertText', async t => {
  await t.navigateTo(`${url}?${forceAlertsQuery}`);

  const danger = await getBtAlertText({ type: 'danger', Selector });
  const warning = await getBtAlertText({ type: 'warning', Selector });
  const success = await getBtAlertText({ type: 'success', Selector });
  const info = await getBtAlertText({ type: 'info', Selector });
  const noType = await getBtAlertText({ type: 'success', Selector });

  await t.expect(danger).contains('Flash error');
  await t.expect(warning).contains('Flash alert');
  await t.expect(success).contains('Flash notice');
  await t.expect(info).contains('Flash info');
  await t.expect(noType).contains('Flash notice');
});

test('getPerformanceMetrics', async t => {
  await t.navigateTo(`${url}`);

  const perf = await getPerformanceMetrics({ t });

  const { raw, computed } = perf;

  await t.expect(raw).typeOf('object');
  await t.expect(computed).typeOf('object');

  for (let r in raw) {
    await t.expect(raw[r]).typeOf('number');
  }

  for (let c in computed) {
    await t.expect(computed[c]).typeOf('number');
  }
});
