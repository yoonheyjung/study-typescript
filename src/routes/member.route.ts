import { Router } from "express";
import memberController from "../controllers/member.controller";

const {
  getUserData,
  generateMemberData,
  generateScore,
  deleteMember,
  getCsv,
  getGeoAvg,
} = memberController;

const router = Router();

// 전체 유저 조회
router.get("/", getUserData);

// 신규 유저 가입
router.post("/", generateMemberData);

// 유저의 스코어 등록
router.post("/:memberId/score", generateScore);

// 유저 삭제
router.delete("/:memberId", deleteMember);

// 유저 데이터 csv 다운로드
router.get("/csv", getCsv);

// 해당 지역의 과목별 평균값
router.get("/avg/:osmId", getGeoAvg);

export default router;
