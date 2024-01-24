import db from "../models/index";
import { Score } from "../entities/score.entity";

const scoreRepository = db.getRepository(Score);

export default {
  generateScore: async (memberId: any, subject: string, score: number) => {
    try {
      // 찾기 시도
      let existingScore = await scoreRepository.findOne({
        where: { member: { id: memberId }, subject },
      });

      if (existingScore) {
        // 이미 존재하면 업데이트
        existingScore.score = score;
        await scoreRepository.save(existingScore);
      } else {
        // 존재하지 않으면 새로운 레코드 삽입
        const newScore = new Score();
        newScore.member = memberId;
        newScore.subject = subject;
        newScore.score = score;

        await scoreRepository.save(newScore);
      }

      return { success: true, message: "Score saved successfully." };
    } catch (error) {
      console.error("Error saving score:", error);
      return { success: false, message: "Error saving score." };
    }
  },
};
