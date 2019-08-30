import { Request, Response } from 'express';

import { Injectable } from 'Core/Injectable';
import { IHandler } from 'Core/Interface';
import { DataType, FormatType } from 'Core/Enum';
import * as RE from 'Core/RegularExpression';

@Injectable
export class ReportController {
    constructor() {}

    importExcel: IHandler = {
        method: async (req: Request, res: Response) => {
            return res.status(200).send('WIP');
        },
        validation: {
            path: {
                id: {
                    type: DataType.Number,
                    required: true
                }
            },
            formData: {
                file: {
                    type: DataType.File,
                    required: true
                }
            }
        },
        document: {
            tags: ['Report Excel'],
            summary: 'Import excel for report',
            security: true
        }
    };

    exportReport: IHandler = {
        method: async (req: Request, res: Response) => {
            return res.status(200).send('WIP');
        },
        validation: {
            path: {
                id: {
                    type: DataType.Number,
                    required: true
                }
            }
        },
        document: {
            tags: ['Report Excel'],
            summary: 'Export excel for report',
            security: true
        }
    };
}
