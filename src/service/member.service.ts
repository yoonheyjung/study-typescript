import db from "../models/index";
import { Member } from "../entities/member.entity";
import { District } from "../entities/district.entity";

const memberRepository = db.getRepository(Member);

interface FindByMemberOptions {
  osm_id?: any;
  start_date?: string;
  end_date?: string;
  name?: string;
  nickname?: string;
}

export default {
  findByMember: async (options: FindByMemberOptions) => {
    try {
      return await memberRepository
        .createQueryBuilder("member")
        .leftJoinAndSelect("member.scores", "score")
        .innerJoin(
          District,
          "district",
          "ST_Within(member.location, district.geometry)"
        )
        .where("district.osm_id = :osm_id", { osm_id: options.osm_id })
        .andWhere(options.name ? `member.name LIKE :name` : "1=1", {
          name: `%${options.name}%`,
        })
        .andWhere(options.nickname ? `member.nickname LIKE :nickname` : "1=1", {
          nickname: `%${options.nickname}%`,
        })
        .andWhere(
          options.start_date ? "member.birthday > :start_date" : "1=1",
          {
            start_date: options.start_date,
          }
        )
        .andWhere(options.end_date ? "member.birthday < :end_date" : "1=1", {
          end_date: options.end_date,
        })

        .orderBy({
          "member.birthday": "DESC",
          "member.createdAt": "DESC",
        })
        .getMany();
    } catch (error) {
      console.error("findByUser에서 에러 발생:", error);
      return error;
    }
  },
  subjectAverage: async (osm_id: string) => {
    try {
      return await memberRepository
        .createQueryBuilder("member")
        .select([
          "score.subject as subject",
          "SUM(score.score) as sumScore",
          "COUNT(*) as count1",
        ])
        .leftJoin("score", "score", '"score"."memberId" = "member"."id"')
        .innerJoin(
          "district",
          "district",
          'ST_Within("member"."location", "district"."geometry")'
        )
        .where('"district"."osm_id" = :osm_id', { osm_id })
        .groupBy('"score"."subject"')
        .getRawMany();
    } catch (error) {}
  },
  checkUniqueNickname: async (nickname: string) => {
    try {
      return await memberRepository.findOne({
        select: ["nickname"],
        where: { nickname },
      });
    } catch (error) {
      return error;
    }
  },
  generateMemberData: async (member: any) => {
    try {
      const geoJSONData = {
        type: "Point",
        coordinates: member.coordinates,
      };
      member.location = geoJSONData;

      return await memberRepository.save(member);
    } catch (error) {
      return error;
    }
  },
  deleteMember: async (id: any) => {
    try {
      const memberToDelete = await memberRepository.findOneBy({ id });

      if (!memberToDelete) throw new Error("Member not found");

      await memberRepository.remove([memberToDelete]);

      // 성공적으로 삭제됨
      return true;
    } catch (error) {
      console.error("Error deleting member:", error);
      return error;
    }
  },
};
