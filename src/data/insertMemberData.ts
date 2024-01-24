import fs from "fs";
import path from "path";
import db from "../models/index";
import { Member } from "../entities/member.entity";

// 폴더 내의 파일 순차적으로 읽기
const folderPath = `${__dirname}/user_data`;

const insertData = () => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // 파일을 하나씩 처리하기 위해 각 파일에 대한 처리 함수 정의
    const processFile = (index: number) => {
      if (index === files.length) {
        // 모든 파일을 처리했으면 종료
        console.log("Finished reading all files.");
        return;
      }

      const fileName = files[index];
      const filePath = path.join(folderPath, fileName);

      // 파일 읽기
      fs.readFile(filePath, "utf8", async (readErr, data) => {
        if (readErr) {
          console.error(`Error reading file ${fileName}:`, readErr);
        } else {
          // 파일의 내용을 출력
          console.log(`Contents of ${fileName}:\n`);

          try {
            const jsonData = JSON.parse(data);

            jsonData.forEach(async (item: any) => {
              // Create a new Member instance
              const newMember = new Member();
              newMember.id = item.id;
              newMember.name = item.name;
              newMember.nickname = item.nickname;
              newMember.birthday = item.birthday;

              const geoJSONData = {
                type: "Point",
                coordinates: item.coordinates,
              };
              newMember.location = geoJSONData;
              newMember.createdAt = new Date(item.createdAt);
              newMember.updatedAt = new Date(item.updatedAt);

              await db.manager.save(newMember);
              // await delay(1000);

              console.log("------------------------");
            });
          } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
          }

          // 다음 파일 처리를 위해 재귀 호출
          processFile(index + 1);
        }
      });
    };

    // 첫 번째 파일부터 시작
    processFile(0);
  });
};

export default insertData;
