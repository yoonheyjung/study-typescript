import { DataSource } from "typeorm";

// 선언해둔 테이블
import { Member } from "../entities/member.entity";
import { Score } from "../entities/score.entity";
import { District } from "../entities/district.entity";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "test123",
  database: "nara",
  entities: [Member, Score, District],
  synchronize: true,
  logging: true,
  extra: {
    ssl: false,
    driver: "postgres",
    geometryColumnType: "geometry",
  },
});
