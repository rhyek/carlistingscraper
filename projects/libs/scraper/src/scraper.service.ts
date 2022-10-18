import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';

@Injectable()
export class ScraperService {
  async run() {
    const { default: ky } = await import(
      /* webpackIgnore: true */ 'ky-universal'
    );
    // https://github.com/microsoft/TypeScript/issues/43329#issuecomment-1276000768
    const html = await ky
      .get('https://www.motores502.com/vehiculos/publicados')
      .text();
    const dom = new JSDOM(html);
    const carBlocks = dom.window.document.querySelectorAll('.car-block');
    for (const carBlock of carBlocks) {
      const href = carBlock
        .querySelector('.inner-box .image a')
        .getAttribute('href');

      const slug = href.split(
        'https://www.motores502.com/vehiculo_inventario/',
      )[1];

      const title = carBlock
        .querySelector('h3')
        .textContent.trim()
        .replace(/\s{2,}/, ' ');

      const price = carBlock.querySelector('.price').textContent;

      const carInfoItems = carBlock.querySelectorAll('.car-info li');

      const kms = carInfoItems[0].textContent;
      const fuel = carInfoItems[1].textContent;
      const year = carInfoItems[2].textContent;
      const driveTrain = carInfoItems[3].textContent;
      const availability = carInfoItems[4].textContent;

      console.log(
        slug,
        title,
        price,
        `${kms}kms`,
        fuel,
        year,
        driveTrain,
        availability,
      );
    }
    console.log('hey');
  }
}
