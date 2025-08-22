// barcode.service.ts
import { Injectable } from '@nestjs/common';
import * as bwipjs from 'bwip-js';

@Injectable()
export class BarcodeService {
  async generateBarcode(code: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: 'code128',       // Barcode type
          text: code,            // Text to encode
          scale: 3,              // 3x scaling
          height: 10,            // Bar height in mm
          includetext: true,     // Show human-readable text
          textxalign: 'center',  // Align text
        },
        (err, png) => {
          if (err) {
            reject(err);
          } else {
            resolve(png);
          }
        },
      );
    });
  }
}
