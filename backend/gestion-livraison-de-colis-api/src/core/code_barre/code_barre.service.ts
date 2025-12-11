// barcode.service.ts
import { Injectable } from '@nestjs/common';
import * as bwipjs from 'bwip-js';
import { Canvas, createCanvas } from 'canvas';

const JsBarcode = require('jsbarcode');

@Injectable()
export class BarcodeService {
  static generateBarcodeImage(value: string, options?: any): Buffer {
    const canvas = createCanvas(400, 200); // set width/height
    JsBarcode(canvas, value, {
      format: 'CODE128', // default format
      displayValue: true,
      fontSize: 18,
      ...options,
    });
    return canvas.toBuffer('image/png');
  }

  static async generateBarcode(code: string): Promise<Buffer> {
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

  static async generateBarcodeBase64(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: 'code128',
          text: code,
          scale: 3,
          height: 15,       // increase height for visibility
          includetext: true,
          textxalign: 'center',
        },
        (err, png) => {
          if (err) reject(err);
          else {
            const base64 = `data:image/png;base64,${png.toString('base64')}`;
            resolve(base64);
          }
        },
      );
    });
  }

}
