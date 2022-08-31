import { Body, Controller, Get, HttpStatus, Logger, Post, Query, Res } from '@nestjs/common';
import { Response } from "express";


@Controller('ussd')
export class UssdController {

    private logger = new Logger('UssdController');
    
    @Get('callbackurl')
    public async primaryCallback(
      @Res() res: Response,
      @Query() qr
    ): Promise<any> {
      const pc = await qr;
      this.logger.log(`TRANSACTION RESPONSE URL => ${JSON.stringify(pc)}`);
      res.status(HttpStatus.OK).json(pc);
    }

    @Post('responseurl')
    public async callbackResponse(
        @Res() res: Response,
        @Body() mdata
    ): Promise<any> {

        const mRequest = await mdata;
        this.logger.log(`MOBILE CALLBACK URL => ${JSON.stringify(mRequest)}`);

        res.status(HttpStatus.OK).json(mRequest);
    }


  
}
