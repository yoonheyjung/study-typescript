import fs from "fs";
import dateUtil from "../util/date.util";

export default {
  downloadCsv: async (data: any) => {
    const fileName = `./유저데이터다운로드_${dateUtil.formatDate()}.csv`;
    const saveFile = fs.createWriteStream(fileName);

    saveFile.write(
      " id, 이름(name), 닉네임(nickname), 생년월일(birthday), 등록일(createdAt)\n"
    );

    data.forEach((element: any) => {
      saveFile.write(
        `${element.id},${element.name},${element.nickname},${
          element.birthday
        },${dateUtil.formatDate(element.createdAt)}\n`
      );
    });
    saveFile.end();
  },
};
