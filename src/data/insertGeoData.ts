import fs from "fs";
import db from "../models/index";
import { District } from "../entities/district.entity";

// filePath
const filePath = `${__dirname}/koreaGeo.json`;
// const filePath = `${__dirname}/geo.json`;

const delay = (milliseconds: number) => {
  console.log("delay 실행중ㅇ우웅");
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const insertData = () => {
  // 파일 읽기
  fs.readFile(filePath, "utf8", async (readErr, data) => {
    if (readErr) {
      console.error(`Error reading file koreaGeo.json:`, readErr);
    } else {
      // 파일의 내용을 출력
      console.log(`Contents of koreaGeo.json:\n`);

      try {
        const jsonData = JSON.parse(data);

        jsonData.features.forEach(async (item: any) => {
          // Create a new Member instance
          const newDistrict = new District();
          newDistrict.osm_id = item.properties.osm_id;

          const geoJSONData = {
            type: "Polygon",
            coordinates: item.geometry.coordinates,
          };
          newDistrict.geometry = geoJSONData;

          await db.manager.save(newDistrict);
          console.log(`🚀 ~ jsonData.forEach ~ newDistrict:`, newDistrict);

          console.log("------------------------");
        });
      } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
      }
    }
  });
};

export default insertData;
