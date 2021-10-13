
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import pdfMake from "../../assets/pdfmake/build/pdfmake";
import pdfFonts from "../../assets/pdfmake/build/vfs_fonts";
import { DatePipe, UpperCasePipe } from "@angular/common";
import etDate from "../../assets/js/getEthiopianDate.js";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  amharic: {
    normal: "amharic.ttf",
    bold: "amharic.ttf",
    italics: "amharic.ttf",
    bolditalics: "amharic.ttf",
  },
};

@Injectable({
  providedIn: 'root',
})
export class PassengerTicketPrintService {
  constructor(private http: HttpClient, private datePipe: DatePipe) {
  }

  convertDateFormat(dateString) {
    let date = new Date(dateString);
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  generatePdfticketList(response, bodyData) {
    var docDefinition = {
      content: [
        {
          style: 'tableExample',
          headerRows: 1,
          widths: ['*', 'auto', 100, '*'],
          table: {
            body: bodyData,
          },
        },
      ],
      defaultStyle: {
        font: 'amharic',
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }

  generatePDF(bookResponse) {
    let docDefinition = {
      pageSize: 'A5',
      background: {
        text: 'powered by ezi bus Technology',
        fontSize: 7,
        alignment: 'center',
      },
      watermark: {
        text: 'EZI BUS Technology',
        color: 'black',
        opacity: 0.3,
        bold: true,
        fontSize: 20,
      },
      content: [
        {
          text: 'EZI BUS Technology',
          fontSize: 18,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
        },
        {
          text: 'ለመንገደኛ የሚሰጥ ደረሰኝ',
          fontSize: 16,
          alignment: 'center',
        },
        {
          text: ' PASSENGER\'S RECEIPT',
          fontSize: 18,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
        },
        {
          text: `${bookResponse.schedule.operator}`,
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
        },

        {
          columns: [
            [
              {
                text: `የደንበኛ ስም `,
                bold: true,
              },
              {
                text: `Name: ${bookResponse.passenger.fullName}`,
                bold: true,
              },
              {
                text: `ስልክ ቁጥር`,
                bold: true,
              },
              {text: `Phone Number: ${bookResponse.passenger.phoneNumber}`},
              {text: `የጎን ቁጥር`},
              {text: `Bus Number: ${bookResponse.schedule.busPlateNumber}`},
              {text: `የወንበር ቁጥር`},
              {text: `Seat number:${bookResponse.seatNumber}`},
              {text: `የከፈሉት ብር`},
              {text: `Amount Paid :${bookResponse.charges}`},
              {text: `የትኬት ቁጥር`},
              {
                text: `TicketId : ${bookResponse.serial.serialCode} `,
              },
            ],

            [
              {text: `የጉዞ መስመር/ Route `},
              {
                text: `${bookResponse.schedule.departureLocation} To ${bookResponse.schedule.arrivalLocation}`,
                bold: true,
              },

              {
                text: `የጉዞ ቀን  ${etDate(
                  new Date(bookResponse.schedule.tripDate).toLocaleString()
                )}`,
              },
              {
                text: `Trip Date : ${this.convertDateFormat(
                  bookResponse.schedule.tripDate
                )} `,
                alignment: 'left',
              },
              {text: `የመሳፈርያ ስዓት`},
              {
                text: `Checkin Time : ${new Date(
                  bookResponse.schedule.checkinTime
                ).getHours()} : ${new Date(
                  bookResponse.schedule.checkinTime
                ).getMinutes()} `,
                alignment: 'left',
              },
              {text: `የመነሻ ሰዓት`},
              {
                text: `Departure Time : ${new Date(
                  bookResponse.schedule.departureTime
                ).getHours()}: ${new Date(
                  bookResponse.schedule.departureTime
                ).getMinutes()} `,
                alignment: 'left',
              },
              {text: `ትኬት የተሸ.ቀን ${etDate(new Date())}`},
              {
                text: `Issued on: ${this.convertDateFormat(new Date())}`,
              }
            ],
          ],
        },
        {
          qr: `${bookResponse.passenger.fullName} \n ${bookResponse.schedule.tripDate} \n ${bookResponse.schedule.busSideNumber}\n ${bookResponse.ticketId} `,
          alignment: 'center',
          fit: '80',
          eccLevel: 'l',
        },
        {
          text: '\n powered by EZI Bus Technology ',
          alignment: 'left',
        },


      ],

      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
        qrcode: {
          margin: [0, 2, 0, -10],
        },
      },
      defaultStyle: {
        font: 'amharic',
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }

  public getBase64Image(img: any) {
    // Create an empty canvas element
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL('image/png');

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
}
