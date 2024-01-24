import { Request, Response } from "express";
import memberService from "../service/member.service";
import scoreService from "../service/score.service";
import csvService from "../service/csv.service";

enum Subject {
  Math = "math",
  Science = "science",
  English = "english",
}

interface FindByUser {
  osm_id?: any;
  start_date?: string;
  end_date?: string;
  name?: string;
  nickname?: string;
}

interface generateMemberData {
  member: {
    name: string;
    nickname: string;
    birthday: string;
  };
  score: {
    subject: Subject;
    score: number;
  };
}

// 랜덤 닉네임 생성
const generateRandomString = (length: number) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset.charAt(randomIndex);
  }

  return result;
};

export default {
  getUserData: async (req: Request<{}, {}, {}, FindByUser>, res: Response) => {
    const { osm_id, start_date, end_date, name, nickname } = req.query;

    const data = await memberService.findByMember({
      osm_id,
      start_date,
      end_date,
      name,
      nickname,
    });

    res.status(200).json({
      code: 2000,
      msg: "성공",
      data,
    });
  },
  getGeoAvg: async (req: Request<{ osmId: string }>, res: Response) => {
    const { osmId } = req.params;

    const dataAvg: any = await memberService.subjectAverage(osmId);
    const result: any = {};

    dataAvg.forEach(async (data: any) => {
      if (data.subject) {
        result[data.subject] = data.sumscore / data.count1;
      }
    });

    res.status(200).json({
      code: 2000,
      msg: "Success",
      result,
    });
  },
  generateMemberData: async (req: Request, res: Response) => {
    const { member, score } = req.body;

    // 중복된 닉네임이면 랜덤 닉네임 생성 및
    let checkUniqueNickname = await memberService.checkUniqueNickname(
      member.nickname
    );

    while (!!checkUniqueNickname) {
      member.nickname = generateRandomString(10);
      checkUniqueNickname = await memberService.checkUniqueNickname(
        member.nickname
      );
    }

    // user(member) 저장
    const userData = await memberService.generateMemberData(member);

    // score 저장
    if (userData.id) {
      score.forEach(async (data: any) => {
        await scoreService.generateScore(userData.id, data.subject, data.score);
      });
    }

    res.status(200).json({
      code: 2000,
      msg: "Success",
    });
  },
  generateScore: async (req: Request<{ memberId: string }>, res: Response) => {
    const { memberId } = req.params;
    const { subject, score } = req.body;

    /* Validation Check */
    if (!Object.values(Subject).includes(subject) || score < 0 || score > 100) {
      return res.status(400).json({
        code: 4000,
        msg: "Validation Error",
      });
    }

    await scoreService.generateScore(memberId, subject, score);

    res.status(200).json({
      code: 2000,
      msg: "Success",
    });
  },
  deleteMember: async (req: Request<{ memberId: string }>, res: Response) => {
    const { memberId } = req.params;

    await memberService.deleteMember(memberId);

    res.status(200).json({
      code: 2000,
      msg: "Success",
    });
  },
  getCsv: async (req: Request<{}, {}, {}, FindByUser>, res: Response) => {
    const { osm_id, start_date, end_date, name, nickname } = req.query;

    const data = await memberService.findByMember({
      osm_id,
      start_date,
      end_date,
      name,
      nickname,
    });

    await csvService.downloadCsv(data);

    res.status(200).json({
      code: 2000,
      msg: "Success",
    });
  },
};
