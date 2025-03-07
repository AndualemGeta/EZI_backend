export function processSeatChart(map_data: any[], seatChartConfig: any, seatmap: any[]) {
    if (map_data.length > 0) {
      let seatNoCounter = 1;
      
      for (let __counter = 0; __counter < map_data.length; __counter++) {
        let row_label = "";
        let item_map = map_data[__counter].seat_map;
        
        row_label = "Row " + item_map[0].seat_label + " - ";
        if (item_map[item_map.length - 1].seat_label !== " ") {
          row_label += item_map[item_map.length - 1].seat_label;
        } else {
          row_label += item_map[item_map.length - 2].seat_label;
        }
        row_label += " : Birr " + map_data[__counter].seat_price;
  
        item_map.forEach(map_element => {
          let mapObj = {
            seatRowLabel: map_element.seat_label,
            seats: [],
            seatPricingInformation: row_label
          };
          
          row_label = "";
          let seatValArr = map_element.layout.split("");
  
          if (seatChartConfig.newSeatNoForRow) {
            seatNoCounter = 1; // Reset the seat label counter for new row
          }
  
          let totalItemCounter = 1;
          seatValArr.forEach(item => {
            let seatObj = {
              key: map_element.seat_label + "_" + totalItemCounter,
              price: map_data[__counter].seat_price,
              status: "available"
            };
  
            if (item !== "_") {
              seatObj["seatLabel"] = map_element.seat_label + " " + seatNoCounter;
              seatObj["seatNo"] = seatNoCounter < 10 ? "0" + seatNoCounter : "" + seatNoCounter;
              seatNoCounter++;
            } else {
              seatObj["seatLabel"] = "";
              seatObj["seatNo"] = "";
            }
  
            totalItemCounter++;
            mapObj["seats"].push(seatObj);
          });
  
          seatmap.push(mapObj);
        });
      }
    }
  }
  